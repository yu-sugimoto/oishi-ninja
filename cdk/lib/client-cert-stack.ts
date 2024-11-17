import * as cdk from 'aws-cdk-lib';
import { Stack } from 'aws-cdk-lib';
import * as certificatemanager from 'aws-cdk-lib/aws-certificatemanager';
import * as route53 from 'aws-cdk-lib/aws-route53';

interface ClientCertStackProps extends cdk.StackProps {
  domainName: string;
  prefix?: string;
}

export class ClientCertStack extends Stack {
  public readonly certificateArn: string;

  constructor(scope: cdk.App, id: string, props: ClientCertStackProps) {
    super(scope, id, {
      ...props,
      env: {
        ...props.env,
        region: 'us-east-1'
      }
    });

    const siteDomain = props.prefix
      ? `${props.prefix}.${props.domainName}`
      : props.domainName;

    const hostedZone = route53.HostedZone.fromLookup(this, 'HostedZone', {
      domainName: props.domainName,
    });

    // ACM証明書を作成
    const certificate = new certificatemanager.Certificate(this, 'ClientCertificate', {
      domainName: siteDomain,
      validation: certificatemanager.CertificateValidation.fromDns(hostedZone),
    });

    this.certificateArn = certificate.certificateArn;

    // 出力
    new cdk.CfnOutput(this, 'ClientCertificateArn', {
      value: this.certificateArn,
      description: 'ACM Certificate ARN for CloudFront',
    });
  }
}
