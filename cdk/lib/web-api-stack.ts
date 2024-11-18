import * as cdk from 'aws-cdk-lib';
import * as iam from 'aws-cdk-lib/aws-iam';
import { Stack, StackProps } from 'aws-cdk-lib';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as rds from 'aws-cdk-lib/aws-rds';
import * as elb from 'aws-cdk-lib/aws-elasticloadbalancingv2';
import * as route53 from 'aws-cdk-lib/aws-route53';
import * as route53Targets from 'aws-cdk-lib/aws-route53-targets';
import * as certificatemanager from 'aws-cdk-lib/aws-certificatemanager';
import * as elb_targets from 'aws-cdk-lib/aws-elasticloadbalancingv2-targets';
import * as wafv2 from 'aws-cdk-lib/aws-wafv2';
import { createDomainName } from './utilities/domain';
import { createId } from './utilities/id';

interface WebApiStackProps extends StackProps {
  domainName: string;
  envName?: string;
}

export class WebApiStack extends Stack {
  public readonly apiUrl: string;

  constructor(scope: cdk.App, id: string, props: WebApiStackProps) {
    super(scope, id, props);

    const vpc = new ec2.Vpc(this, createId('Vpc', props.envName), {
      maxAzs: 2,
    });

    // RDS 用セキュリティグループ
    const rdsSecurityGroup = new ec2.SecurityGroup(this, createId('RdsSecurityGroup', props.envName), {
      vpc,
      description: 'Security group for RDS instance',
      allowAllOutbound: true,
    });

    // EC2 用セキュリティグループ（SSM セッション経由で接続するインスタンス）
    const ec2SecurityGroup = new ec2.SecurityGroup(this, createId('Ec2SecurityGroup', props.envName), {
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

    // RDS インスタンスの作成
    new rds.DatabaseInstance(this, createId('Database', props.envName), {
      engine: rds.DatabaseInstanceEngine.postgres({
        version: rds.PostgresEngineVersion.VER_16_4,
      }),
      vpc,
      instanceType: ec2.InstanceType.of(ec2.InstanceClass.BURSTABLE3, ec2.InstanceSize.MICRO),
      credentials: rds.Credentials.fromGeneratedSecret('postgres'),
      databaseName: 'app',
      securityGroups: [rdsSecurityGroup],
      deletionProtection: false,
    });

    // EC2 インスタンス用の IAM ロール
    const instanceRole = new iam.Role(this, createId('ApiInstanceRole', props.envName), {
      assumedBy: new iam.ServicePrincipal('ec2.amazonaws.com'),
    });

    instanceRole.addManagedPolicy(
      iam.ManagedPolicy.fromAwsManagedPolicyName('AmazonSSMManagedInstanceCore')
    );

    // EC2 インスタンスの UserData
    const userData = ec2.UserData.forLinux();
    userData.addCommands(
      'yum install -y amazon-ssm-agent',
      'systemctl enable amazon-ssm-agent',
      'systemctl start amazon-ssm-agent'
    );

    // EC2 インスタンスの作成
    const apiServer = new ec2.Instance(this, 'ApiInstance', {
      instanceType: ec2.InstanceType.of(ec2.InstanceClass.T3, ec2.InstanceSize.MICRO),
      machineImage: new ec2.AmazonLinuxImage(),
      vpc,
      role: instanceRole,
      userData: userData,
      securityGroup: ec2SecurityGroup,
    });

    // ALB 用セキュリティグループ
    const albSecurityGroup = new ec2.SecurityGroup(this, 'AlbSecurityGroup', {
      vpc,
      description: 'Security group for ALB',
      allowAllOutbound: true,
    });

    albSecurityGroup.addIngressRule(ec2.Peer.anyIpv4(), ec2.Port.tcp(443), 'Allow HTTPS traffic');

    // ALB の作成
    const loadBalancer = new elb.ApplicationLoadBalancer(this, 'ApiLoadBalancer', {
      vpc,
      internetFacing: true,
      securityGroup: albSecurityGroup,
    });

    const listener = loadBalancer.addListener('HttpsListener', {
      port: 443,
    });

    const hostedZone = route53.HostedZone.fromLookup(this, 'HostedZone', {
      domainName: props.domainName,
    });

    const siteDomain = createDomainName(props.domainName, 'api', props.envName);

    const certificate = new certificatemanager.Certificate(this,  createId('ApiCertificate', props.envName), {
      domainName: siteDomain,
      validation: certificatemanager.CertificateValidation.fromDns(hostedZone),
    });

    listener.addCertificates('ApiCertificate', [certificate]);

    // ターゲットグループの作成
    listener.addTargets('ApiTargetGroup', {
      port: 80,
      targets: [new elb_targets.InstanceTarget(apiServer)],
    });

    // WAF WebACL を作成
    const webAcl = new wafv2.CfnWebACL(this, createId('ApiWebAcl', props.envName), {
      scope: 'REGIONAL',
      defaultAction: { allow: {} },
      rules: [
        {
          name: 'AllowRule',
          priority: 0,
          visibilityConfig: {
            cloudWatchMetricsEnabled: true,
            metricName: 'api-web-acl-metric',
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
        metricName: 'ApiWAFMetric',
        sampledRequestsEnabled: true,
      },
    });

    new wafv2.CfnWebACLAssociation(this,  createId('ApiWebAclAssociation', props.envName), {
      resourceArn: loadBalancer.loadBalancerArn,
      webAclArn: webAcl.attrArn,
    });

    // Route 53 に A レコードを追加
    new route53.ARecord(this, 'ApiAliasRecord', {
      zone: hostedZone,
      recordName: siteDomain,
      target: route53.RecordTarget.fromAlias(new route53Targets.LoadBalancerTarget(loadBalancer)),
    });

    this.apiUrl = `https://${siteDomain}`;

    new cdk.CfnOutput(this, 'ApiUrl', { value: this.apiUrl, });
  }
}
