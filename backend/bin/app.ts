#!/usr/bin/env node
import "source-map-support/register";
import * as cdk from "aws-cdk-lib";
import { NotesAppStack } from "../lib/notes-app-stack";

const app = new cdk.App();

const account = process.env.CDK_DEFAULT_ACCOUNT;

const region = process.env.CDK_DEFAULT_REGION || "us-east-1";

new NotesAppStack(app, "NotesAppStack", {
  env: account
    ? {
        account: account,
        region: region,
      }
    : undefined,
});
