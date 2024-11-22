import { Stack, StackProps } from 'aws-cdk-lib';
import * as cdk from 'aws-cdk-lib';
import * as certificatemanager from 'aws-cdk-lib/aws-certificatemanager';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as elb from 'aws-cdk-lib/aws-elasticloadbalancingv2';
import * as elb_targets from 'aws-cdk-lib/aws-elasticloadbalancingv2-targets';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as logs from 'aws-cdk-lib/aws-logs';
import * as rds from 'aws-cdk-lib/aws-rds';
import * as route53 from 'aws-cdk-lib/aws-route53';
import * as route53Targets from 'aws-cdk-lib/aws-route53-targets';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as wafv2 from 'aws-cdk-lib/aws-wafv2';
import { buildIdCreator, createDomainName } from './utilities';

interface WebApiStackProps extends StackProps {
  appName: string;
  domainName: string;
  envName?: string;
  port?: number;
}

export class WebApiStack extends Stack {
  public readonly apiUrl: string;

  constructor(scope: cdk.App, id: string, props: WebApiStackProps) {
    super(scope, id, props);

    const _id = buildIdCreator(props.appName, props.envName);
    const domainName = props.domainName;
    const siteDomain = createDomainName(domainName, 'api', props.envName);
    const port = props.port || 4000;
    this.apiUrl = `https://${siteDomain}`;

    const vpc = new ec2.Vpc(this, _id('WebApiVpc'), {
      maxAzs: 2,
    });

    // RDS 用セキュリティグループ
    const rdsSecurityGroup = new ec2.SecurityGroup(this, _id('RdsSecurityGroup'), {
      vpc,
      description: 'Security group for RDS instance',
      allowAllOutbound: true,
    });

    // EC2 用セキュリティグループ（SSM セッション経由で接続するインスタンス）
    const ec2SecurityGroup = new ec2.SecurityGroup(this, _id('Ec2SecurityGroup'), {
      vpc,
      description: 'Security group for EC2 instances used with SSM sessions',
      allowAllOutbound: true,
    });

    // RDS セキュリティグループにインバウンドルールを追加（EC2 セキュリティグループを許可）
    rdsSecurityGroup.addIngressRule(
      ec2SecurityGroup,
      ec2.Port.tcp(5432),
      'Allow PostgreSQL access from EC2 instances'
    );

    // RDS パラメータグループ
    const parameterGroup = new rds.ParameterGroup(this, _id('RdsParameterGroup'), {
      engine: rds.DatabaseInstanceEngine.postgres({
        version: rds.PostgresEngineVersion.VER_16_4,
      }),
      parameters: {
        'log_statement': 'all',
        'log_min_duration_statement': '0',
      },
    });

    // RDS インスタンスの作成
    const database = new rds.DatabaseInstance(this, _id('Rds'), {
      engine: rds.DatabaseInstanceEngine.postgres({
        version: rds.PostgresEngineVersion.VER_16_4,
      }),
      vpc,
      instanceType: ec2.InstanceType.of(ec2.InstanceClass.BURSTABLE3, ec2.InstanceSize.MICRO),
      credentials: rds.Credentials.fromGeneratedSecret('postgres'),
      databaseName: 'app',
      securityGroups: [rdsSecurityGroup],
      deletionProtection: false,
      parameterGroup
    });

    // EC2 インスタンス用の IAM ロール
    const instanceRole = new iam.Role(this, _id('WebApiInstanceRole'), {
      assumedBy: new iam.ServicePrincipal('ec2.amazonaws.com'),
    });

    // EC2 インスタンスにSSMセッションを許可
    instanceRole.addManagedPolicy(
      iam.ManagedPolicy.fromAwsManagedPolicyName('AmazonSSMManagedInstanceCore')
    );

    // CloudWatch Agent 用のポリシーを追加
    instanceRole.addManagedPolicy(
      iam.ManagedPolicy.fromAwsManagedPolicyName('CloudWatchAgentServerPolicy')
    );

    // CloudWatch ロググループ
    new logs.LogGroup(this, _id('WebApiLogGroup'), {
      logGroupName: _id('WebApiLogGroup'),
      retention: logs.RetentionDays.ONE_MONTH,
    });

    new logs.LogGroup(this, _id('AlbLogGroup'), {
      retention: logs.RetentionDays.ONE_MONTH,
    });

    // EC2 インスタンスの UserData
    const userData = ec2.UserData.forLinux();

    // 必要な依存関係のインストール
    userData.addCommands(
      'yum update -y',
      'yum groupinstall -y "Development Tools"',
      'yum install -y gcc libffi-devel bzip2 bzip2-devel zlib-devel xz-devel wget make'
    );

    // Python 3.13のインストール
    userData.addCommands(
      'cd /usr/src',
      'wget https://www.python.org/ftp/python/3.13.0/Python-3.13.0.tgz',
      'tar xzf Python-3.13.0.tgz',
      'cd Python-3.13.0',
      './configure --enable-optimizations',
      'make altinstall',
      'python3.13 --version'
    );

    // Poetryのインストール
    userData.addCommands(
      'curl -sSL https://install.python-poetry.org | python3.13 -'
    );

    // アプリケーションログの準備
    userData.addCommands(
      'mkdir -p /var/log/webapi',
      'echo "Log initialized" > /var/log/webapi/app.log',
      'chmod 644 /var/log/webapi/app.log'
    );

    // CloudWatch Agentのインストールと設定
    userData.addCommands(
      'yum install -y amazon-cloudwatch-agent',
      `cat <<EOT > /opt/aws/amazon-cloudwatch-agent/etc/amazon-cloudwatch-agent.json
    {
      "logs": {
        "logs_collected": {
          "files": {
            "collect_list": [
              {
                "file_path": "/var/log/webapi/app.log",
                "log_group_name": "${_id('WebApiLogGroup')}",
                "log_stream_name": "{instance_id}"
              }
            ]
          }
        }
      }
    }
    EOT`,
      '/opt/aws/amazon-cloudwatch-agent/bin/amazon-cloudwatch-agent-ctl -a start'
    );

    // 環境変数の書き出し
    userData.addCommands(
      `echo "PORT=4000" >> /etc/environment`,
      `echo "DATABASE_URL=postgresql://oishi_ninja:oishi_ninja@localhost/oishi_ninja" >> /etc/environment`
    );

    // EC2 インスタンスの作成
    const apiServer = new ec2.Instance(this, _id('WebApiInstance'), {
      instanceType: ec2.InstanceType.of(ec2.InstanceClass.T3, ec2.InstanceSize.MICRO),
      machineImage: new ec2.AmazonLinuxImage(),
      vpc,
      role: instanceRole,
      userData: userData,
      securityGroup: ec2SecurityGroup,
    });

    // ALB 用セキュリティグループ
    const albSecurityGroup = new ec2.SecurityGroup(this, _id('AlbSecurityGroup'), {
      vpc,
      description: 'Security group for ALB',
      allowAllOutbound: true,
    });

    albSecurityGroup.addIngressRule(ec2.Peer.anyIpv4(), ec2.Port.tcp(443), 'Allow HTTPS traffic');

    // ALB の作成
    const loadBalancer = new elb.ApplicationLoadBalancer(this, _id('WebApiLoadBalancer'), {
      vpc,
      internetFacing: true,
      securityGroup: albSecurityGroup,
    });

    // ALB 用のリスナー
    const listener = loadBalancer.addListener(_id('HttpsListener'), {
      port: 443,
    });

    const hostedZone = route53.HostedZone.fromLookup(this, _id('HostedZone'), {
      domainName: domainName,
    });

    const certificate = new certificatemanager.Certificate(this,  _id('WebApiCertificate'), {
      domainName: siteDomain,
      validation: certificatemanager.CertificateValidation.fromDns(hostedZone),
    });

    listener.addCertificates(_id('WebApiCertificate'), [certificate]);

    listener.addTargets(_id('WebApiTargetGroup'), {
      port: 80,
      targets: [new elb_targets.InstanceTarget(apiServer)],
    });

    ec2SecurityGroup.addIngressRule(
      albSecurityGroup,
      ec2.Port.tcp(port),
      'Allow traffic from ALB to Python application on port 5000'
    );

    // WAF WebACL を作成
    const webAcl = new wafv2.CfnWebACL(this, _id('WebApiWebAcl'), {
      scope: 'REGIONAL',
      defaultAction: { allow: {} },
      rules: [
        {
          name: 'AllowRule',
          priority: 0,
          visibilityConfig: {
            cloudWatchMetricsEnabled: true,
            metricName: _id('api-web-acl-metric'),
            sampledRequestsEnabled: true,
          },
          action: { allow: {} },
          statement: {
            byteMatchStatement: {
              searchString: 'allow',
              fieldToMatch: {
                uriPath: {},
              },
              textTransformations: [{ priority: 0, type: 'NONE' }],
              positionalConstraint: 'CONTAINS',
            },
          },
        },
      ],
      visibilityConfig: {
        cloudWatchMetricsEnabled: true,
        metricName: _id('ApiWAFMetric'),
        sampledRequestsEnabled: true,
      },
    });

    new wafv2.CfnWebACLAssociation(this,  _id('WebApiWebAclAssociation'), {
      resourceArn: loadBalancer.loadBalancerArn,
      webAclArn: webAcl.attrArn,
    });

    // Route 53 に A レコードを追加
    new route53.ARecord(this, _id('ApiAliasRecord'), {
      zone: hostedZone,
      recordName: siteDomain,
      target: route53.RecordTarget.fromAlias(new route53Targets.LoadBalancerTarget(loadBalancer)),
    });

    new cdk.CfnOutput(this, 'Web API Url', { value: this.apiUrl });
    new cdk.CfnOutput(this, 'Web API Server Intance ID', { value: apiServer.instanceId });
    new cdk.CfnOutput(this, 'Web API Load Balancer DNS Name', { value: loadBalancer.loadBalancerDnsName });

    new cdk.CfnOutput(this, 'Database: hostname', { value: database.instanceEndpoint.hostname });
    new cdk.CfnOutput(this, 'Database: port', { value: database.instanceEndpoint.port.toString() });
    new cdk.CfnOutput(this, 'Database: socketAddress', { value: database.instanceEndpoint.socketAddress });
  }
}
