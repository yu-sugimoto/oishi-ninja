#!/usr/bin/env node
import * as dotenv from 'dotenv';

import * as cdk from 'aws-cdk-lib';
import { WebApiStack } from '../lib/web-api-stack';
import { ClientStaticSiteStack } from '../lib/client-static-site-stack';
import { AssetsStaticSiteStack } from '../lib/assets-static-site-stack';
import { AssetsCertStack } from '../lib/assets-cert-stack';
import { ClientCertStack } from '../lib/client-cert-stack';

dotenv.config();

const app = new cdk.App();

const envName = app.node.tryGetContext('env') || '';
const domainName = process.env.DOMAIN_NAME

if (!domainName) throw new Error('DOMAIN_NAME environment variable is required');

const env = {
  account: process.env.CDK_DEFAULT_ACCOUNT,
  region: process.env.CDK_DEFAULT_REGION,
};

const webApiStack = new WebApiStack(app, 'WebApiStack', {
  domainName,
  envName,
  env
});

const certStack = new ClientCertStack(app, 'ClientCertStack', {
  domainName,
  envName,
  env
});

new ClientStaticSiteStack(app, 'ClientStaticSiteStack', {
  apiUrl: webApiStack.apiUrl,
  domainName,
  envName,
  certificateArn: certStack.certificateArn,
  env,
  crossRegionReferences: true
});

const assetsCertStack = new AssetsCertStack(app, 'AssetsCertStack', {
  domainName,
  envName,
  env
});

new AssetsStaticSiteStack(app, 'AssetsStaticSiteStack', {
  domainName,
  envName,
  certificateArn: assetsCertStack.certificateArn,
  env,
  crossRegionReferences: true
});
