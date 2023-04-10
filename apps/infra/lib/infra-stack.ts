import * as cdk from "aws-cdk-lib";
import { Backend } from "./backend";
import { Construct } from "constructs";
import { Frontend } from "./frontend";
import { Pipeline } from "./pipeline";

export class InfraStack extends cdk.Stack {
  constructor(
    scope: Construct,
    id: string,
    stage: string,
    props?: cdk.StackProps
  ) {
    super(scope, id, props);

    new Pipeline(this, "pipeline");
    new Backend(this, "backend");
    new Frontend(this, "frontend", stage);
  }
}
