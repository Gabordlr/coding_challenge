import { gql } from "graphql-tag";

export const GET_NOTES = gql`
  query GetNotes(
    $sentiment: Sentiment
    $limit: Int
    $nextToken: String
    $userId: ID
  ) {
    getNotes(
      sentiment: $sentiment
      limit: $limit
      nextToken: $nextToken
      userId: $userId
    ) {
      items {
        id
        text
        sentiment
        dateCreated
        userId
      }
      nextToken
      scannedCount
    }
  }
`;

export const CREATE_NOTE = gql`
  mutation CreateNote($text: String!, $sentiment: Sentiment!, $userId: ID) {
    createNote(text: $text, sentiment: $sentiment, userId: $userId) {
      id
      text
      sentiment
      dateCreated
      userId
    }
  }
`;
