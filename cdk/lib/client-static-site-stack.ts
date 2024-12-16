import * as cdk from 'aws-cdk-lib';
import * as iam from 'aws-cdk-lib/aws-iam';
import { Stack, StackProps } from 'aws-cdk-lib';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as route53 from 'aws-cdk-lib/aws-route53';
import * as route53Targets from 'aws-cdk-lib/aws-route53-targets';
import * as cloudfront from 'aws-cdk-lib/aws-cloudfront';
import * as cloudfrontOrigins from 'aws-cdk-lib/aws-cloudfront-origins';
import * as certificatemanager from 'aws-cdk-lib/aws-certificatemanager';
import * as ssm from 'aws-cdk-lib/aws-ssm';

import { AwsCustomResource, AwsCustomResourcePolicy } from 'aws-cdk-lib/custom-resources';

import { createDomainName } from './utilities';
import { SsmParameterReader } from './ssm-parameter-reader';
import { ErrorResponse } from 'aws-cdk-lib/aws-cloudfront';

interface ClientStaticSiteStackProps extends StackProps {
  appName: string;
  domainName: string;
  envName?: string;
  createId: (name: string) => string;
  createBucketName: (bucketKey: string) => string;
  createSsmParameterName: (name: string) => string;
}

export class ClientStaticSiteStack extends Stack {
  constructor(scope: cdk.App, id: string, props: ClientStaticSiteStackProps) {
    super(scope, id, props);

    const _id = props.createId;
    const ssmParameterName = props.createSsmParameterName;

    const domainName = props.domainName;
    const siteDomain = createDomainName(props.domainName, '', props.envName);

    const hostedZone = route53.HostedZone.fromLookup(this, _id('ClientStaticSiteHostedZone'), {
      domainName
    });

    // S3 バケット作成
    const staticSiteBucket = new s3.Bucket(this, _id('ClientStaticSiteBucket'), {
      bucketName: props.createBucketName('client-static-site'),
      blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      autoDeleteObjects: true,
      enforceSSL: true,
      versioned: false,
    });

    const certificateArnParameterName = ssmParameterName('ClientStaticSiteCertificateArn');

    const certificateArnReader = new SsmParameterReader(this, 'CertificateArnParameter', {
      parameterName: certificateArnParameterName,
      region: 'us-east-1',
    });

    const certificateArn = certificateArnReader.stringValue;

    const certificate = certificatemanager.Certificate.fromCertificateArn(this, _id('ClientStaticSiteCertificate'),
      certificateArn
    );

    // SPA 用のリライトの設定
    function errorResponse (httpStatus: number): ErrorResponse {
      return {
        httpStatus,
        responseHttpStatus: 200,
        responsePagePath: '/index.html',
        ttl: cdk.Duration.days(1),
      }
    }

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
        errorResponse(404),
        errorResponse(403)
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
