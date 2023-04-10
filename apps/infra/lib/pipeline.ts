import * as pipelines from "aws-cdk-lib/pipelines";
import { Construct } from "constructs";

export class Pipeline extends Construct {
  constructor(scope: Construct, id: string) {
    super(scope, id);

    new pipelines.CodePipeline(this, "Pipeline", {
      pipelineName: "MyPipeline",
      synth: new pipelines.ShellStep("Synth", {
        input: pipelines.CodePipelineSource.connection(
          "blntrsz/turbo-cdk",
          "main",
          {
            connectionArn:
              "arn:aws:codestar-connections:eu-central-1:155601209279:connection/51dc3226-ffdd-459d-a034-50f9ff503d2b",
          }
        ),
        commands: [
          "node -v",
          "npm -v",
          "npm i -g pnpm@7.30.3",
          "pnpm i",
          "pnpm infra:deploy",
        ],
      }),
    });
  }
}
