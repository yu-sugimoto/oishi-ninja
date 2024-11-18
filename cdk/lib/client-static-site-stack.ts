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
import { createDomainName } from './utilities/domain';
import { createId } from './utilities/id';

interface ClientStaticSiteStackProps extends StackProps {
  apiUrl: string;
  domainName: string;
  envName?: string;
  certificateArn: string;
}

export class ClientStaticSiteStack extends Stack {
  constructor(scope: cdk.App, id: string, props: ClientStaticSiteStackProps) {
    super(scope, id, props);

    const hostedZone = route53.HostedZone.fromLookup(this, createId('HostedZone', props.envName), {
      domainName: props.domainName,
    });

    // サブドメインを生成
    const siteDomain = createDomainName(props.domainName, '', props.envName);

    // S3 バケット作成
    const staticSiteBucket = new s3.Bucket(this, createId('ClientStaticSiteBucket', props.envName), {
      websiteIndexDocument: 'index.html',
      publicReadAccess: false, // CloudFront 経由でのみアクセス
      blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,
    });

    // 証明書をARNから取得
    const certificate = certificatemanager.Certificate.fromCertificateArn(
      this,
      'ClientCertificate',
      props.certificateArn
    );

    // CloudFront オリジンアクセスアイデンティティを作成
    const originAccessIdentity = new cloudfront.OriginAccessIdentity(this, 'OAI', {
      comment: `OAI for ${props.envName}`,
    });

    // CloudFront Distribution 作成
    const distribution = new cloudfront.Distribution(this, createId('ClientStaticSiteDistribution', props.envName), {
      defaultBehavior: {
        origin: new cloudfrontOrigins.S3Origin(staticSiteBucket, {
          originAccessIdentity,
        }),
        viewerProtocolPolicy: cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
      },
      domainNames: [siteDomain],
      certificate,
    });

    // S3 バケットポリシーに OAI を追加
    staticSiteBucket.addToResourcePolicy(new iam.PolicyStatement({
      actions: ['s3:GetObject'],
      resources: [`${staticSiteBucket.bucketArn}/*`],
      principals: [new iam.CanonicalUserPrincipal(originAccessIdentity.cloudFrontOriginAccessIdentityS3CanonicalUserId)],
    }));

    // Route 53 に A レコードを追加
    new route53.ARecord(this, 'ClientAliasRecord', {
      zone: hostedZone,
      recordName: siteDomain,
      target: route53.RecordTarget.fromAlias(new route53Targets.CloudFrontTarget(distribution)),
    });

    // API URL を環境変数として S3 にデプロイ
    new s3Deployment.BucketDeployment(this, 'DeployApiConfig', {
      sources: [
        s3Deployment.Source.data('api-config.json', JSON.stringify({ apiUrl: props.apiUrl })),
      ],
      destinationBucket: staticSiteBucket,
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
  }
}
