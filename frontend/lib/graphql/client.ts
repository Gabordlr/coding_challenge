"use client";

import { generateClient } from "aws-amplify/api";
import type { GraphQLResult } from "@aws-amplify/api-graphql";
import type { DocumentNode } from "graphql";

// This will be configured via environment variables
export const graphqlClient = generateClient();

export async function executeQuery<T = unknown>(
  query: string | DocumentNode,
  variables?: Record<string, unknown>
): Promise<GraphQLResult<T>> {
  try {
    const result = (await graphqlClient.graphql({
      query,
      variables,
    })) as Promise<GraphQLResult<T>>;
    return result;
  } catch (error) {
    console.error("GraphQL query error:", error);
    throw error;
  }
}

export async function executeMutation<T = unknown>(
  mutation: string | DocumentNode,
  variables?: Record<string, unknown>
): Promise<GraphQLResult<T>> {
  try {
    const result = (await graphqlClient.graphql({
      query: mutation,
      variables,
    })) as Promise<GraphQLResult<T>>;
    return result;
  } catch (error) {
    console.error("GraphQL mutation error:", error);
    throw error;
  }
}
