import * as cdk from 'aws-cdk-lib';
import { Stack } from 'aws-cdk-lib';
import * as certificatemanager from 'aws-cdk-lib/aws-certificatemanager';
import * as route53 from 'aws-cdk-lib/aws-route53';
import * as ssm from 'aws-cdk-lib/aws-ssm';

import { createDomainName } from './utilities';

interface AssetsCertStackProps extends cdk.StackProps {
  domainName: string;
  envName: string;
  appName: string;
  createId: (name: string) => string;
  createSsmParameterName: (name: string) => string;
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

    const _id = props.createId;
    const ssmParameterName = props.createSsmParameterName;

    const domainName = props.domainName;
    const siteDomain = createDomainName(domainName, 'assets', props.envName);

    const hostedZone = route53.HostedZone.fromLookup(this, _id('AssetsHostedZone'), { domainName });

    const certificate = new certificatemanager.Certificate(this, _id('AssetsStaticSiteCertificate'), {
      domainName: siteDomain,
      validation: certificatemanager.CertificateValidation.fromDns(hostedZone),
    });

    const certificateArnParameterName = ssmParameterName('AssetsStaticSiteCertificateArn');
    const certificateArnParameterValue = certificate.certificateArn;

    new ssm.StringParameter(this, _id('AssetsStaticSiteCertificateArnParameter'), {
      parameterName: certificateArnParameterName,
      stringValue: certificateArnParameterValue,
    });

    new cdk.CfnOutput(this, 'AssetsStaticSiteCertificateArn', {
      value: certificate.certificateArn,
      description: 'ACM Certificate ARN for CloudFront',
    });

    new cdk.CfnOutput(this, 'AssetsStaticSiteCertificateArnParameterName', {
      value: certificateArnParameterName,
      description: 'SSM Parameter Name for ACM Certificate ARN',
    });
  }
}
