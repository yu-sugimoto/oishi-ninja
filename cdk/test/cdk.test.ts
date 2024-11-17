import * as cdk from 'aws-cdk-lib';
import { Template } from 'aws-cdk-lib/assertions';
import { NetworkAndDatabaseStack } from '../lib/network-and-database-stack';
import { WebApiStack } from '../lib/web-api-stack';
import { ClientStaticSiteStack } from '../lib/client-static-site-stack';
import { AssetsStaticSiteStack } from '../lib/assets-static-site-stack';
import { AssetsCertStack } from '../lib/assets-cert-stack';
import { ClientCertStack } from '../lib/client-cert-stack';

test('NetworkAndDatabaseStack Created', () => {
  const app = new cdk.App();
  const stack = new NetworkAndDatabaseStack(app, 'NetworkAndDatabaseStack');
  const template = Template.fromStack(stack);

  template.resourceCountIs('AWS::EC2::VPC', 1);
});

test('WebApiStack Created', () => {
  const app = new cdk.App();
  const networkAndDatabaseStack = new NetworkAndDatabaseStack(app, 'NetworkAndDatabaseStack');
  const stack = new WebApiStack(app, 'WebApiStack', {
    vpc: networkAndDatabaseStack.vpc,
    domainName: 'example.com',
    prefix: 'test',
  });
  const template = Template.fromStack(stack);

  template.resourceCountIs('AWS::ApiGateway::RestApi', 1);
});

test('ClientStaticSiteStack Created', () => {
  const app = new cdk.App();
  const certStack = new ClientCertStack(app, 'ClientCertStack', {
    domainName: 'example.com',
    prefix: 'test',
  });
  const stack = new ClientStaticSiteStack(app, 'ClientStaticSiteStack', {
    apiUrl: 'https://api.example.com',
    domainName: 'example.com',
    prefix: 'test',
    certificateArn: certStack.certificateArn,
  });
  const template = Template.fromStack(stack);

  template.resourceCountIs('AWS::S3::Bucket', 1);
});

test('AssetsStaticSiteStack Created', () => {
  const app = new cdk.App();
  const assetsCertStack = new AssetsCertStack(app, 'AssetsCertStack', {
    domainName: 'example.com',
    prefix: 'test',
  });
  const stack = new AssetsStaticSiteStack(app, 'AssetsStaticSiteStack', {
    domainName: 'example.com',
    prefix: 'test',
    certificateArn: assetsCertStack.certificateArn,
  });
  const template = Template.fromStack(stack);

  template.resourceCountIs('AWS::S3::Bucket', 1);
});
