import * as cdk from 'aws-cdk-lib';
import { Stack, StackProps } from 'aws-cdk-lib';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as route53 from 'aws-cdk-lib/aws-route53';
import * as route53Targets from 'aws-cdk-lib/aws-route53-targets';
import * as cloudfront from 'aws-cdk-lib/aws-cloudfront';
import * as cloudfrontOrigins from 'aws-cdk-lib/aws-cloudfront-origins';
import * as certificatemanager from 'aws-cdk-lib/aws-certificatemanager';
import { createDomainName } from './utilities/domain';

interface AssetsStaticSiteStackProps extends StackProps {
  domainName: string;
  envName?: string;
  certificateArn: string; // 証明書のARNを受け取る
}

export class AssetsStaticSiteStack extends Stack {
  public readonly bucket: s3.Bucket;
  public readonly distribution: cloudfront.Distribution;

  constructor(scope: cdk.App, id: string, props: AssetsStaticSiteStackProps) {
    super(scope, id, props);

    const hostedZone = route53.HostedZone.fromLookup(this, 'HostedZone', {
      domainName: props.domainName,
    });

    // サブドメインを生成
    const siteDomain = createDomainName(props.domainName, 'assets', props.envName);

    // S3 バケット作成
    this.bucket = new s3.Bucket(this, 'AssetsBucket', {
      publicReadAccess: false,
      blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      autoDeleteObjects: true, // 開発用（必要に応じて削除）
    });

    // 証明書をARNから取得
    const certificate = certificatemanager.Certificate.fromCertificateArn(
      this,
      'AssetsCertificate',
      props.certificateArn
    );

    // CloudFront Distribution 作成
    this.distribution = new cloudfront.Distribution(this, 'AssetsDistribution', {
      defaultBehavior: {
        origin: new cloudfrontOrigins.S3StaticWebsiteOrigin(this.bucket),
        viewerProtocolPolicy: cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
      },
      domainNames: [siteDomain],
      certificate,
    });

    // Route 53 に A レコードを追加
    new route53.ARecord(this, 'AssetsAliasRecord', {
      zone: hostedZone,
      recordName: siteDomain,
      target: route53.RecordTarget.fromAlias(new route53Targets.CloudFrontTarget(this.distribution)),
    });

    // 出力
    new cdk.CfnOutput(this, 'AssetsDistributionDomainName', {
      value: `https://${siteDomain}`,
      description: 'CloudFront domain name for the assets',
    });

    new cdk.CfnOutput(this, 'AssetsBucketName', {
      value: this.bucket.bucketName,
      description: 'S3 bucket name for storing assets',
    });
  }
}
