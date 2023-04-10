#!/usr/bin/env node
import "source-map-support/register";
import * as cdk from "aws-cdk-lib";
import { InfraStack } from "../lib/infra-stack";
import { execSync } from "child_process";

const stage = execSync("git branch --show-current")
  .toString()
  .replace(/^\s+|\s+$/g, "");

const app = new cdk.App();
new InfraStack(app, `infra-${stage}`, stage, {
  env: {
    account: process.env.CDK_DEFAULT_ACCOUNT,
    region: process.env.CDK_DEFAULT_REGION,
  },
});
