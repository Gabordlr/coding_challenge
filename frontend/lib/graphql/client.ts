"use client";

import { generateClient } from "aws-amplify/api";
import type { GraphQLResult } from "@aws-amplify/api-graphql";

// This will be configured via environment variables
export const graphqlClient = generateClient();

type GraphQLQuery = string | any;

export async function executeQuery<T = unknown>(
  query: GraphQLQuery,
  variables?: Record<string, unknown>
): Promise<GraphQLResult<T>> {
  try {
    // @ts-ignore - Type conflict between different GraphQL versions
    // (one in root node_modules, one in @aws-amplify/api-graphql)
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
    // @ts-ignore - Type conflict between different GraphQL versions
    // (one in root node_modules, one in @aws-amplify/api-graphql)
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
