import * as cdk from 'aws-cdk-lib';
import { Stack } from 'aws-cdk-lib';
import * as certificatemanager from 'aws-cdk-lib/aws-certificatemanager';
import * as route53 from 'aws-cdk-lib/aws-route53';
import { buildIdCreator, createDomainName } from './utilities';

interface ClientCertStackProps extends cdk.StackProps {
  domainName: string;
  appName: string;
  envName: string;
}

export class ClientCertStack extends Stack {
  public readonly certificateArn: string;

  constructor(scope: cdk.App, id: string, props: ClientCertStackProps) {
    const env = {
      ...props.env,
      region: 'us-east-1'
    }
    super(scope, id, { ...props, env });

    const domainName = props.domainName
    const siteDomain = createDomainName(props.domainName, '', props.envName);
    const _id = buildIdCreator(props.appName, props.envName)

    const hostedZone = route53.HostedZone.fromLookup(this, _id('HostedZone'), { domainName });

    // ACM証明書を作成
    const certificate = new certificatemanager.Certificate(this, _id('ClientCertificate'), {
      domainName: siteDomain,
      validation: certificatemanager.CertificateValidation.fromDns(hostedZone),
    });

    this.certificateArn = certificate.certificateArn;

    // 出力
    new cdk.CfnOutput(this, _id('ClientCertificateArn'), {
      value: this.certificateArn,
      description: 'ACM Certificate ARN for CloudFront',
    });
  }
}
