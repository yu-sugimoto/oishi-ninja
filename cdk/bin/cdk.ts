#!/usr/bin/env node
import * as dotenv from 'dotenv';

import * as cdk from 'aws-cdk-lib';
import { WebApiStack } from '../lib/web-api-stack';
import { ClientStaticSiteStack } from '../lib/client-static-site-stack';
import { AssetsStaticSiteStack } from '../lib/assets-static-site-stack';
import { AssetsCertStack } from '../lib/assets-cert-stack';
import { ClientCertStack } from '../lib/client-cert-stack';
import { buildStackNameCreator } from '../lib/utilities';

dotenv.config();

const app = new cdk.App();

const ENV_NAME = process.env.ENV_NAME
const DOMAIN_NAME = process.env.DOMAIN_NAME
const APP_NAME = process.env.APP_NAME

if (!ENV_NAME) throw new Error('ENV_NAME environment variable is required');
if (!DOMAIN_NAME) throw new Error('DOMAIN_NAME environment variable is required');
if (!APP_NAME) throw new Error('APP_NAME environment variable is required');

const env = {
  account: process.env.CDK_DEFAULT_ACCOUNT,
  region: process.env.CDK_DEFAULT_REGION,
};

const stackName = buildStackNameCreator(APP_NAME, ENV_NAME)

const webApiStack = new WebApiStack(app, stackName('WebApiStack'), {
  appName: APP_NAME,
  domainName: DOMAIN_NAME,
  envName: ENV_NAME,
  env
});

const certStack = new ClientCertStack(app, stackName('ClientStaticSiteCertStack'), {
  domainName: DOMAIN_NAME,
  envName: ENV_NAME,
  appName: APP_NAME,
  env
});

new ClientStaticSiteStack(app, stackName('ClientStaticSiteStack'), {
  appName: APP_NAME,
  apiUrl: webApiStack.apiUrl,
  domainName: DOMAIN_NAME,
  envName: ENV_NAME,
  certificateArn: certStack.certificateArn,
  crossRegionReferences: true,
  env,
});

const assetsCertStack = new AssetsCertStack(app, stackName('AssetsStaticSiteCertStack'), {
  appName: APP_NAME,
  domainName: DOMAIN_NAME,
  envName: ENV_NAME,
  env
});

new AssetsStaticSiteStack(app, stackName('AssetsStaticSiteStack'), {
  appName: APP_NAME,
  domainName: DOMAIN_NAME,
  envName: ENV_NAME,
  certificateArn: assetsCertStack.certificateArn,
  env,
  crossRegionReferences: true
});
