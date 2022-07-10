#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { IntroCdkStack } from '../lib/intro-cdk-stack';

const env = { account: '211387097341', region: 'us-east-1' };

const app = new cdk.App();
new IntroCdkStack(app, 'IntroCdkStack', {
  env,
});
