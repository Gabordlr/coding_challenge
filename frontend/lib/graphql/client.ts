"use client";

import { generateClient } from "aws-amplify/api";
import type { GraphQLResult } from "@aws-amplify/api-graphql";
import type { DocumentNode } from "graphql";

// This will be configured via environment variables
export const graphqlClient = generateClient();

type GraphQLQuery = string | DocumentNode;

export async function executeQuery<T = unknown>(
  query: GraphQLQuery,
  variables?: Record<string, unknown>
): Promise<GraphQLResult<T>> {
  try {
    // @ts-expect-error - Type conflict: Two different versions of 'graphql' package exist
    // (root node_modules vs @aws-amplify/api-graphql/node_modules). Types are structurally
    // identical but TypeScript sees them as incompatible. Works correctly at runtime.
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
  mutation: GraphQLQuery,
  variables?: Record<string, unknown>
): Promise<GraphQLResult<T>> {
  try {
    // @ts-expect-error - Type conflict: Two different versions of 'graphql' package exist
    // (root node_modules vs @aws-amplify/api-graphql/node_modules). Types are structurally
    // identical but TypeScript sees them as incompatible. Works correctly at runtime.
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
