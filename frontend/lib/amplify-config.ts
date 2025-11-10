"use client";

import { Amplify } from "aws-amplify";

const amplifyConfig = {
  API: {
    GraphQL: {
      endpoint: process.env.NEXT_PUBLIC_APPSYNC_API_URL || "",
      region: process.env.NEXT_PUBLIC_AWS_REGION || "us-east-1",
      defaultAuthMode: "apiKey" as const,
      apiKey: process.env.NEXT_PUBLIC_APPSYNC_API_KEY || "",
    },
  },
  Auth: {
    Cognito: {
      userPoolId: process.env.NEXT_PUBLIC_USER_POOL_ID || "",
      userPoolClientId: process.env.NEXT_PUBLIC_USER_POOL_CLIENT_ID || "",
      region: process.env.NEXT_PUBLIC_AWS_REGION || "us-east-1",
    },
  },
};

export function configureAmplify() {
  Amplify.configure(amplifyConfig);
}
