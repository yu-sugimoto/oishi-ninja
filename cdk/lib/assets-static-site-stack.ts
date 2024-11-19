import * as cdk from 'aws-cdk-lib';
import * as iam from 'aws-cdk-lib/aws-iam';
import { Stack, StackProps } from 'aws-cdk-lib';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as route53 from 'aws-cdk-lib/aws-route53';
import * as route53Targets from 'aws-cdk-lib/aws-route53-targets';
import * as cloudfront from 'aws-cdk-lib/aws-cloudfront';
import * as cloudfrontOrigins from 'aws-cdk-lib/aws-cloudfront-origins';
import * as certificatemanager from 'aws-cdk-lib/aws-certificatemanager';
import { createDomainName } from './utilities/domain';
import { createId } from './utilities/id';

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

    const hostedZone = route53.HostedZone.fromLookup(this, createId('HostedZone', props.envName), {
      domainName: props.domainName,
    });

    // サブドメインを生成
    const siteDomain = createDomainName(props.domainName, 'assets', props.envName);

    // S3 バケット作成
    const staticSiteBucket = new s3.Bucket(this, createId('AssetsStaticSiteBucket', props.envName), {
      blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL, // パブリックアクセスを完全にブロック
      enforceSSL: true, // SSLを強制
    });

    // 証明書をARNから取得
    const certificate = certificatemanager.Certificate.fromCertificateArn(
      this,
      'AssetsCertificate',
      props.certificateArn
    );

    // OAC を作成
    const originAccessControl = new cloudfront.CfnOriginAccessControl(this, createId('OAC', props.envName), {
      originAccessControlConfig: {
        name: createId('AssetsStaticSiteOACConfig', props.envName),
        originAccessControlOriginType: 's3',
        signingBehavior: 'always',
        signingProtocol: 'sigv4',
      },
    });

    // CloudFront Distribution 作成
    const distribution = new cloudfront.Distribution(this, createId('AssetsStaticSiteDistribution', props.envName), {
      defaultBehavior: {
        origin: cloudfrontOrigins.S3BucketOrigin.withOriginAccessControl(staticSiteBucket, ),
        viewerProtocolPolicy: cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
      },
      domainNames: [siteDomain],
      certificate,
      additionalBehaviors: {}
    });

    // OAC を Origin にリンク
    const cfnDistribution = distribution.node.defaultChild as cloudfront.CfnDistribution;
    cfnDistribution.addOverride('Properties.DistributionConfig.Origins.0.OriginAccessControlId', originAccessControl.attrId);

    staticSiteBucket.addToResourcePolicy(new iam.PolicyStatement({
      actions: ['s3:GetObject'],
      resources: [`${staticSiteBucket.bucketArn}/*`],
      principals: [
        new iam.ServicePrincipal('cloudfront.amazonaws.com'),
      ],
      conditions: {
        StringEquals: {
          'AWS:SourceArn': `arn:aws:cloudfront::${this.account}:distribution/${distribution.distributionId}`,
        },
      },
    }));

    // Route 53 に A レコードを追加
    new route53.ARecord(this, 'AssetsAliasRecord', {
      zone: hostedZone,
      recordName: siteDomain,
      target: route53.RecordTarget.fromAlias(new route53Targets.CloudFrontTarget(distribution)),
    });

    // 出力
    new cdk.CfnOutput(this, 'AssetsStaticSiteBucketName', {
      value: staticSiteBucket.bucketName,
      description: 'The name of the S3 bucket where the client static files are stored',
    });

    new cdk.CfnOutput(this, 'AssetsStaticSiteDomainName', {
      value: `https://${siteDomain}`,
      description: 'The CloudFront domain name for serving the client static files',
    });
  }
}
