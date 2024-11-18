import * as cdk from 'aws-cdk-lib';
import { Stack } from 'aws-cdk-lib';
import * as certificatemanager from 'aws-cdk-lib/aws-certificatemanager';
import * as route53 from 'aws-cdk-lib/aws-route53';
import { createDomainName } from './utilities/domain';
import { createId } from './utilities/id';

interface AssetsCertStackProps extends cdk.StackProps {
  domainName: string;
  envName: string;
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

    const siteDomain = createDomainName(props.domainName, 'assets', props.envName);

    const hostedZone = route53.HostedZone.fromLookup(this, createId('HostedZone', props.envName), {
      domainName: props.domainName,
    });

    // ACM証明書を作成
    const certificate = new certificatemanager.Certificate(this, createId('AssetsCertificate'), {
      domainName: siteDomain,
      validation: certificatemanager.CertificateValidation.fromDns(hostedZone),
    });

    this.certificateArn = certificate.certificateArn;

    // 出力
    new cdk.CfnOutput(this, createId('AssetsCertificateArn'), {
      value: this.certificateArn,
      description: 'ACM Certificate ARN for CloudFront',
    });
  }
}
