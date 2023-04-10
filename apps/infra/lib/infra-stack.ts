import * as cdk from "aws-cdk-lib";
import { Backend } from "./backend";
import { Construct } from "constructs";
import { Frontend } from "./frontend";

export class InfraStack extends cdk.Stack {
  constructor(
    scope: Construct,
    id: string,
    stage: string,
    props?: cdk.StackProps
  ) {
    super(scope, id, props);

    new Backend(this, "backend");
    new Frontend(this, "frontend", stage);
  }
}
