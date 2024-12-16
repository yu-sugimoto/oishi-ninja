import { Stack, StackProps } from 'aws-cdk-lib';
import * as cdk from 'aws-cdk-lib';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as route53 from 'aws-cdk-lib/aws-route53';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as s3Deploy from 'aws-cdk-lib/aws-s3-deployment';

import { createDomainName } from './utilities';

const DOCKER_COMPOSE_VERSION = '2.27.0';

interface WebApiStackProps extends StackProps {
  appName: string;
  domainName: string;
  envName?: string;
  port: number;
  dbName: string;
  dbUser: string;
  dbPassword: string;
  createId: (name: string) => string;
  createBucketName: (bucketKey: string) => string;
}

export class WebApiStack extends Stack {
  public readonly apiUrl: string;

  constructor(scope: cdk.App, id: string, props: WebApiStackProps) {
    super(scope, id, props);
    const _id = props.createId;
    const {
      domainName,
      dbName,
      dbUser,
      dbPassword,
      port,
    } = props;
    const siteDomain = createDomainName(domainName, 'api', props.envName);
    this.apiUrl = `https://${siteDomain}`;

    // S3 バケット作成
    const temporaryBucket = new s3.Bucket(this, _id('WebApiTemporaryBucket'), {
      bucketName: props.createBucketName('web-api-temporary'),
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,
      versioned: false,
      publicReadAccess: false,
      autoDeleteObjects: true,
    });

    new s3Deploy.BucketDeployment(this, 'DeployFiles', {
      sources: [s3Deploy.Source.asset('./opt/api/scripts')],
      destinationBucket: temporaryBucket,
      destinationKeyPrefix: 'scripts',
    });

    // VPC の作成
    const vpc = new ec2.Vpc(this, _id('WebApiVpc'), {
      maxAzs: 2,
      natGateways: 0,
      subnetConfiguration: [
        {
          name: 'Public',
          subnetType: ec2.SubnetType.PUBLIC,
        },
      ],
    });

    // SSM エンドポイントの作成
    new ec2.InterfaceVpcEndpoint(this, 'SSMVpcEndpoint', { vpc, service: ec2.InterfaceVpcEndpointAwsService.SSM });
    new ec2.InterfaceVpcEndpoint(this, 'SSMMessagesVpcEndpoint', { vpc, service: ec2.InterfaceVpcEndpointAwsService.SSM_MESSAGES });
    new ec2.InterfaceVpcEndpoint(this, 'EC2MessagesVpcEndpoint', { vpc, service: ec2.InterfaceVpcEndpointAwsService.EC2_MESSAGES });

    // EC2 用セキュリティグループ（SSM セッション経由で接続するインスタンス）
    const securityGroup = new ec2.SecurityGroup(this, _id('WebApiEc2SecurityGroup'), {
      vpc,
      description: 'Security group for EC2 instances used with SSM sessions',
      allowAllOutbound: true,
    });
    securityGroup.addIngressRule(ec2.Peer.anyIpv4(), ec2.Port.tcp(80), 'Allow HTTP');
    securityGroup.addIngressRule(ec2.Peer.anyIpv4(), ec2.Port.tcp(443), 'Allow HTTPS');

    // EC2 インスタンス用の IAM ロール
    const role = new iam.Role(this, _id('WebApiInstanceRole'), {
      assumedBy: new iam.ServicePrincipal('ec2.amazonaws.com'),
    });
    role.addManagedPolicy(iam.ManagedPolicy.fromAwsManagedPolicyName('AmazonSSMManagedInstanceCore'));
    role.addManagedPolicy(iam.ManagedPolicy.fromAwsManagedPolicyName('AmazonS3ReadOnlyAccess'));
    role.addToPolicy(new iam.PolicyStatement({
      actions: ['s3:GetObject'],
      resources: [`${temporaryBucket.bucketArn}/*`], // 必要なオブジェクトへのアクセスを許可
    }));

    // EC2 インスタンスの UserData
    const userData = ec2.UserData.forLinux();

    const environmentPath = '~/.env';

    const environmentVariables = {
      DOMAIN_NAME: siteDomain,
      FLASK_ENV: 'production',
      DB_HOST: 'localhost',
      DB_PORT: '5432',
      DB_NAME: dbName,
      DB_USER: dbUser,
      DB_PASSWORD: dbPassword,
      S3_BUCKET: temporaryBucket.bucketName,
      S3_APP_PATH: '/app',
      APP_PORT: port.toString(),
      APP_DIR: '/app'
    }
    for (const [key, value] of Object.entries(environmentVariables)) {
      userData.addCommands(`echo "${key}=${value}" >> ${environmentPath}`);
    }
    userData.addCommands(
      `chmod +x ${environmentPath}`,
      `source ${environmentPath}`,

      `cp ${environmentPath} /home/ec2-user/.env`,
    );

    const dockerSourceUrl = `https://github.com/docker/compose/releases/download/v${DOCKER_COMPOSE_VERSION}/docker-compose-$(uname -s)-$(uname -m)`;

    userData.addCommands(
      // AWS CLI インストール
      'yum install -y aws-cli',

      // S3 バケットからスクリプトをダウンロード
      'mkdir -p /home/ec2-user/scripts',
      'cd /home/ec2-user/scripts',
      `aws s3 cp s3://${temporaryBucket.bucketName}/scripts/ . --recursive`,
      'find /home/ec2-user/scripts -name "*.sh" -exec chmod +x {} \\;',

      // Dockerのインストール
      'yum update -y',
      'yum install -y docker',
      'systemctl start docker',
      'systemctl enable docker',

      // Docker Composeのインストール
      'cd /usr/local/bin',
      `curl -L "${dockerSourceUrl}" -o /usr/local/bin/docker-compose`,
      'chmod +x /usr/local/bin/docker-compose',
      'echo "PATH=$PATH:/usr/local/bin" >> /etc/profile',
      'source /etc/profile',
      'docker-compose --version',

      'amazon-linux-extras install epel -y',
      'yum install -y certbot',
    );

    const instance = new ec2.Instance(this, _id('WebApiInstance'), {
      instanceType: ec2.InstanceType.of(ec2.InstanceClass.T3, ec2.InstanceSize.MEDIUM),
      machineImage: new ec2.AmazonLinuxImage({
        generation: ec2.AmazonLinuxGeneration.AMAZON_LINUX_2,
        cpuType: ec2.AmazonLinuxCpuType.X86_64,
      }),
      vpc,
      role,
      userData,
      securityGroup,
    });

    const hostedZone = route53.HostedZone.fromLookup(this, _id('WebApiHostedZone'), { domainName });

    // Route 53 に A レコードを追加
    new route53.ARecord(this, _id('WebApiAliasRecord'), {
      zone: hostedZone,
      recordName: siteDomain,
      target: route53.RecordTarget.fromIpAddresses(instance.instancePublicIp),
    });

    // EC2
    new cdk.CfnOutput(this, 'Web API URL', { value: this.apiUrl });
    new cdk.CfnOutput(this, 'Web API Server Intance ID', { value: instance.instanceId });
    new cdk.CfnOutput(this, 'Web API Server Public IP', { value: instance.instancePublicIp });

    // DB
    new cdk.CfnOutput(this, 'DB Name', { value: dbName });
    new cdk.CfnOutput(this, 'DB Username', { value: dbUser });
    new cdk.CfnOutput(this, 'DB Environment', { value: environmentPath });

    // S3
    new cdk.CfnOutput(this, 'S3 Temporary Bucket Name', { value: temporaryBucket.bucketName });
    new cdk.CfnOutput(this, 'S3 Temporary Bucket URL', { value: temporaryBucket.bucketWebsiteUrl });
  }
}
