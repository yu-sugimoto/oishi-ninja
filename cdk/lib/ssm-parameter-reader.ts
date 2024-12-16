import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as cr from 'aws-cdk-lib/custom-resources';
import * as iam from 'aws-cdk-lib/aws-iam';

interface SsmParameterReaderProps {
    parameterName: string;
    region: string;
}

export class SsmParameterReader extends Construct {
  private reader: cr.AwsCustomResource;

  get stringValue(): string {
    return this.getParameterValue();
  }

  constructor(scope: Construct, name: string, props: SsmParameterReaderProps) {
    super(scope, name);

    const { parameterName, region } = props;

    const customResource = new cr.AwsCustomResource(scope, `${name}CustomResource`, {
      policy: cr.AwsCustomResourcePolicy.fromStatements([
        new iam.PolicyStatement({
          effect: iam.Effect.ALLOW,
          actions: ['ssm:GetParameter*'],
          resources: [
            cdk.Stack.of(this).formatArn({
              service: 'ssm',
              region,
              resource: 'parameter',
              resourceName: parameterName.replace(/^\/+/, '')
            }),
          ],
        }),
      ]),
      onUpdate: {
        service: 'SSM',
        action: 'getParameter',
        parameters: {
          Name: parameterName,
        },
        region,
        physicalResourceId: cr.PhysicalResourceId.of(Date.now().toString())
      },
    });

    this.reader = customResource;
  }

  getParameterValue(): string {
    return this.reader.getResponseField('Parameter.Value');
  }
}
