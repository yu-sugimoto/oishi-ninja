import * as cdk from 'aws-cdk-lib';
import { Stack } from 'aws-cdk-lib';
import * as certificatemanager from 'aws-cdk-lib/aws-certificatemanager';
import * as route53 from 'aws-cdk-lib/aws-route53';
import * as ssm from 'aws-cdk-lib/aws-ssm';

import { createDomainName } from './utilities';

interface ClientCertStackProps extends cdk.StackProps {
  domainName: string;
  appName: string;
  envName: string;
  createId: (name: string) => string;
  createSsmParameterName: (name: string) => string;
}

export class ClientCertStack extends Stack {
  constructor(scope: cdk.App, id: string, props: ClientCertStackProps) {
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
    const siteDomain = createDomainName(props.domainName, '', props.envName);

    const hostedZone = route53.HostedZone.fromLookup(this, _id('ClientCertHostedZone'), { domainName });

    const certificate = new certificatemanager.Certificate(this, _id('ClientStaticSiteCertificate'), {
      domainName: siteDomain,
      validation: certificatemanager.CertificateValidation.fromDns(hostedZone),
    });

    const certificateArnParameterName = ssmParameterName('ClientStaticSiteCertificateArn');
    const certificateArnParameterValue = certificate.certificateArn;

    new ssm.StringParameter(this, _id('ClientStaticSiteCertificateArnParameter'), {
      parameterName: certificateArnParameterName,
      stringValue: certificateArnParameterValue,
    });

    new cdk.CfnOutput(this, _id('ClientStaticSiteCertificateArn'), {
      description: 'ACM Certificate ARN for CloudFront',
      value: certificate.certificateArn,
    });
  }
}
