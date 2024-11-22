import * as cdk from 'aws-cdk-lib';
import { Stack } from 'aws-cdk-lib';
import * as certificatemanager from 'aws-cdk-lib/aws-certificatemanager';
import * as route53 from 'aws-cdk-lib/aws-route53';
import { buildIdCreator, createDomainName } from './utilities';

interface AssetsCertStackProps extends cdk.StackProps {
  domainName: string;
  envName: string;
  appName: string;
}

export class AssetsCertStack extends Stack {
  public readonly certificateArn: string;

  constructor(scope: cdk.App, id: string, props: AssetsCertStackProps) {
    super(scope, id, {
      ...props,
      env: {
        ...props.env,
        region: 'us-east-1'
      }
    });

    const domainName = props.domainName;
    const siteDomain = createDomainName(domainName, 'assets', props.envName);
    const _id = buildIdCreator(props.appName, props.envName)

    const hostedZone = route53.HostedZone.fromLookup(this, _id('HostedZone'), { domainName });

    // ACM証明書を作成
    const certificate = new certificatemanager.Certificate(this, _id('AssetsStaticSiteCertificate'), {
      domainName: siteDomain,
      validation: certificatemanager.CertificateValidation.fromDns(hostedZone),
    });

    this.certificateArn = certificate.certificateArn;

    // 出力
    new cdk.CfnOutput(this, 'AssetsStaticSiteCertificateArn', {
      value: this.certificateArn,
      description: 'ACM Certificate ARN for CloudFront',
    });
  }
}
