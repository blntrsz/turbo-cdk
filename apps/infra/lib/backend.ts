import * as cdk from "aws-cdk-lib";
import * as gateway from "aws-cdk-lib/aws-apigateway";
import { NodejsFunction } from "aws-cdk-lib/aws-lambda-nodejs";
import { Construct } from "constructs";
import { Runtime } from "aws-cdk-lib/aws-lambda";
import { readdirSync } from "fs";
import { join } from "path";

export class Backend extends Construct {
  constructor(scope: Construct, id: string) {
    super(scope, id);

    const api = new gateway.RestApi(this, "api", {
      defaultCorsPreflightOptions: {
        allowHeaders: [
          "Content-Type",
          "X-Amz-Date",
          "Authorization",
          "X-Api-Key",
          "X-Amz-Security-Token",
          "Access-Control-Allow-Origin",
          "Access-Control-Allow-Methods",
          "Access-Control-Allow-Headers",
        ],
        allowOrigins: gateway.Cors.ALL_ORIGINS,
        allowMethods: gateway.Cors.ALL_METHODS,
      },
    });

    const fnDir = join(__dirname, "..", "..", "functions", "src");

    readdirSync(fnDir).forEach((fn) => {
      const entry = join(fnDir, fn);
      const lambda = new NodejsFunction(this, fn, {
        runtime: Runtime.NODEJS_18_X,
        entry,
      });

      const { handlerFunction } = require(entry);

      api.root
        .addResource(handlerFunction.path)
        .addMethod(
          handlerFunction.method,
          new gateway.LambdaIntegration(lambda)
        );
    });

    new cdk.CfnOutput(this, "apiEndpoint", {
      value: api.url,
    });
  }
}
