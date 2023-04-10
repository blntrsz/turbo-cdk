import * as cdk from "aws-cdk-lib";
import * as cloudfront from "aws-cdk-lib/aws-cloudfront";
import * as cloudfrontOrigins from "aws-cdk-lib/aws-cloudfront-origins";
import * as iam from "aws-cdk-lib/aws-iam";
import * as s3 from "aws-cdk-lib/aws-s3";
import * as s3deploy from "aws-cdk-lib/aws-s3-deployment";
import { Construct } from "constructs";
import { execSync } from "child_process";
import { join } from "path";
import { RemovalPolicy } from "aws-cdk-lib";

// spa configuration so refreshing non-root path will not get as 404
const errorResponse: cloudfront.ErrorResponse = {
  httpStatus: 403,
  responseHttpStatus: 200,
  responsePagePath: "/index.html",
};

export class Frontend extends Construct {
  constructor(scope: Construct, id: string, stage: string) {
    super(scope, id);

    const oai = new cloudfront.OriginAccessIdentity(this, "cloudfront-oai");

    const bucket = new s3.Bucket(this, "bucket", {
      bucketName: `turbo-cdk-${stage}`,
      publicReadAccess: false,
      removalPolicy: RemovalPolicy.DESTROY,
      autoDeleteObjects: true,
      blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,
    });

    bucket.addToResourcePolicy(
      new iam.PolicyStatement({
        actions: ["s3:GetObject"],
        resources: [bucket.arnForObjects("*")],
        principals: [
          new iam.CanonicalUserPrincipal(
            oai.cloudFrontOriginAccessIdentityS3CanonicalUserId
          ),
        ],
      })
    );

    const distribution = new cloudfront.Distribution(this, "distribution", {
      defaultRootObject: "index.html",
      errorResponses: [errorResponse],
      defaultBehavior: {
        origin: new cloudfrontOrigins.S3Origin(bucket, {
          originAccessIdentity: oai,
        }),
        allowedMethods: cloudfront.AllowedMethods.ALLOW_GET_HEAD_OPTIONS,
      },
    });

    const clientDir = join(__dirname, "..", "..", "client");

    execSync("npx turbo build --filter=client");

    // Deploy site contents to S3 bucket
    new s3deploy.BucketDeployment(this, "DeployWithInvalidation", {
      sources: [s3deploy.Source.asset(join(clientDir, "dist"))],
      destinationBucket: bucket,
      distribution,
      distributionPaths: ["/*"],
    });

    new cdk.CfnOutput(this, "apiEndpoint", {
      value: distribution.distributionDomainName,
    });
  }
}
