import { Stack, StackProps, CfnOutput } from 'aws-cdk-lib';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as apigateway from 'aws-cdk-lib/aws-apigateway';
import { Construct } from 'constructs';
import * as path from 'path';
import { SlackNotificationAction } from '@junglescout/geoglyphs';
import * as cloudwatch from 'aws-cdk-lib/aws-cloudwatch';
// import * as sqs from 'aws-cdk-lib/aws-sqs';

export class IntroCdkStack extends Stack {
  /**
   * The URL of the API Gateway endpoint, for use in the integ tests
   */
  public readonly urlOutput: CfnOutput;
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const handler = new lambda.Function(this, 'serverless', {
      runtime: lambda.Runtime.NODEJS_14_X,
      handler: 'index.handler',
      code: lambda.Code.fromAsset(path.resolve(__dirname, 'lambda')),
    });

    const gw = new apigateway.LambdaRestApi(this, 'Gateway', {
      description: '111modifyEndpoint for a simple Lambda-powered web service,',
      handler,
    });

    const alarmAction = new SlackNotificationAction(this, 'slack', {
      webhookUrl:
        'https://hooks.slack.com/workflows/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',
    });

    const alarm = new cloudwatch.Alarm(this, 'rwa', {
      metric: handler.metricErrors(),
      threshold: 1,
      datapointsToAlarm: 1,
      evaluationPeriods: 1,
    });

    alarm.addAlarmAction(alarmAction);

    this.urlOutput = new CfnOutput(this, 'Url', {
      value: gw.url,
    });
  }
}
