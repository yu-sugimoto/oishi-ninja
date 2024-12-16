#!/usr/bin/env node
import * as dotenv from 'dotenv';
import * as cdk from 'aws-cdk-lib';
import { WebApiStack } from '../lib/web-api-stack';
import { ClientStaticSiteStack } from '../lib/client-static-site-stack';
import { AssetsStaticSiteStack } from '../lib/assets-static-site-stack';
import { AssetsCertStack } from '../lib/assets-cert-stack';
import { ClientCertStack } from '../lib/client-cert-stack';
import {
  buildBucketNameCreator,
  buildIdCreator,
  buildSsmParameterNameCreator,
  buildStackNameCreator
} from '../lib/utilities';

dotenv.config();

const app = new cdk.App();

const ENV_NAME = process.env.ENV_NAME
const DOMAIN_NAME = process.env.DOMAIN_NAME
const APP_NAME = process.env.APP_NAME
const ADMIN_EMAIL = process.env.ADMIN_EMAIL
const DB_NAME = process.env.DB_NAME
const DB_USER = process.env.DB_USER
const DB_PASSWORD = process.env.DB_PASSWORD
const API_PORT = Number(process.env.API_PORT)

if (!ENV_NAME) throw new Error('ENV_NAME environment variable is required');
if (!DOMAIN_NAME) throw new Error('DOMAIN_NAME environment variable is required');
if (!APP_NAME) throw new Error('APP_NAME environment variable is required');
if (!ADMIN_EMAIL) throw new Error('ADMIN_EMAIL environment variable is required');
if (!DB_NAME) throw new Error('DB_NAME environment variable is required');
if (!DB_USER) throw new Error('DB_USER environment variable is required');
if (!DB_PASSWORD) throw new Error('DB_PASSWORD environment variable is required');
if (Number.isNaN(API_PORT)) throw new Error('API_PORT environment variable is required');

const env = {
  account: process.env.CDK_DEFAULT_ACCOUNT,
  region: process.env.CDK_DEFAULT_REGION,
};

const stackName = buildStackNameCreator(APP_NAME, ENV_NAME)
const createId = buildIdCreator(APP_NAME, ENV_NAME)
const createBucketName = buildBucketNameCreator(APP_NAME, ENV_NAME)
const createSsmParameterName = buildSsmParameterNameCreator(APP_NAME, ENV_NAME)

new WebApiStack(app, stackName('WebApiStack'), {
  appName: APP_NAME,
  domainName: DOMAIN_NAME,
  envName: ENV_NAME,
  port: API_PORT,
  dbName: DB_NAME,
  dbUser: DB_USER,
  dbPassword: DB_PASSWORD,
  createId,
  createBucketName,
  env
});

const clientCertStack = new ClientCertStack(app, stackName('ClientStaticSiteCertStack'), {
  domainName: DOMAIN_NAME,
  envName: ENV_NAME,
  appName: APP_NAME,
  createId,
  createSsmParameterName,
  env
});

const clientStaticSiteStack = new ClientStaticSiteStack(app, stackName('ClientStaticSiteStack'), {
  appName: APP_NAME,
  domainName: DOMAIN_NAME,
  envName: ENV_NAME,
  crossRegionReferences: true,
  createId,
  createBucketName,
  createSsmParameterName,
  env,
});

clientStaticSiteStack.addDependency(clientCertStack);

const assetsCertStack = new AssetsCertStack(app, stackName('AssetsStaticSiteCertStack'), {
  appName: APP_NAME,
  domainName: DOMAIN_NAME,
  envName: ENV_NAME,
  createId,
  createSsmParameterName,
  env
});

const assetsStaticSiteStack = new AssetsStaticSiteStack(app, stackName('AssetsStaticSiteStack'), {
  appName: APP_NAME,
  domainName: DOMAIN_NAME,
  envName: ENV_NAME,
  createId,
  createBucketName,
  createSsmParameterName,
  env,
  crossRegionReferences: true
});

assetsStaticSiteStack.addDependency(assetsCertStack);
