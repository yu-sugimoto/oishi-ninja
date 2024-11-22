import * as cdk from 'aws-cdk-lib';
import * as iam from 'aws-cdk-lib/aws-iam';
import { Stack, StackProps } from 'aws-cdk-lib';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as s3Deployment from 'aws-cdk-lib/aws-s3-deployment';
import * as route53 from 'aws-cdk-lib/aws-route53';
import * as route53Targets from 'aws-cdk-lib/aws-route53-targets';
import * as cloudfront from 'aws-cdk-lib/aws-cloudfront';
import * as cloudfrontOrigins from 'aws-cdk-lib/aws-cloudfront-origins';
import * as certificatemanager from 'aws-cdk-lib/aws-certificatemanager';
import { buildIdCreator, createDomainName } from './utilities';

interface ClientStaticSiteStackProps extends StackProps {
  appName: string;
  apiUrl: string;
  domainName: string;
  envName?: string;
  certificateArn: string;
}

export class ClientStaticSiteStack extends Stack {
  constructor(scope: cdk.App, id: string, props: ClientStaticSiteStackProps) {
    super(scope, id, props);

    const domainName = props.domainName;
    const siteDomain = createDomainName(props.domainName, '', props.envName);
    const _id = buildIdCreator(props.appName, props.envName);

    const hostedZone = route53.HostedZone.fromLookup(this, _id('HostedZone'), { domainName });

    // S3 バケット作成
    const staticSiteBucket = new s3.Bucket(this, _id('ClientStaticSiteBucket'), {
      blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,
      enforceSSL: true,
    });

    // 証明書をARNから取得
    const certificate = certificatemanager.Certificate.fromCertificateArn(
      this,
      _id('ClientStaticSiteCertificate'),
      props.certificateArn
    );

    // CloudFront Distribution 作成
    const distribution = new cloudfront.Distribution(this, _id('ClientStaticSiteDistribution'), {
      defaultBehavior: {
        origin: cloudfrontOrigins.S3BucketOrigin.withOriginAccessControl(staticSiteBucket),
        viewerProtocolPolicy: cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
      },
      domainNames: [siteDomain],
      certificate,
      defaultRootObject: 'index.html',
      errorResponses: [
        {
          httpStatus: 404,
          responseHttpStatus: 200,
          responsePagePath: '/index.html', // 404をindex.htmlにフォールバック
          ttl: cdk.Duration.days(1),
        },
      ],
    });

    // バケットポリシーにCloudFront OACを設定
    staticSiteBucket.addToResourcePolicy(new iam.PolicyStatement({
      actions: ['s3:GetObject'],
      resources: [`${staticSiteBucket.bucketArn}/*`],
      principals: [new iam.ServicePrincipal('cloudfront.amazonaws.com')],
    }));

    // Route 53 に A レコードを追加
    new route53.ARecord(this, _id('ClientAliasRecord'), {
      zone: hostedZone,
      recordName: siteDomain,
      target: route53.RecordTarget.fromAlias(new route53Targets.CloudFrontTarget(distribution)),
    });

    // 出力
    new cdk.CfnOutput(this, 'ClientStaticSiteBucketName', {
      value: staticSiteBucket.bucketName,
      description: 'The name of the S3 bucket where the client static files are stored',
    });

    new cdk.CfnOutput(this, 'ClientStaticSiteDomainName', {
      value: `https://${siteDomain}`,
      description: 'The CloudFront domain name for serving the client static files',
    });

    new cdk.CfnOutput(this, 'ClientStaticSiteDistributionId', {
      value: distribution.distributionId,
      description: 'The ID of the CloudFront distribution',
    });
  }
}
