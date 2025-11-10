const { ulid } = require("ulid");
const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const { DynamoDBDocumentClient, PutCommand } = require("@aws-sdk/lib-dynamodb");

const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);

const VALID_SENTIMENTS = ["happy", "sad", "neutral", "angry"];

function validateText(text) {
  if (!text || typeof text !== "string") {
    throw new Error("Text is required and must be a string");
  }
  const trimmed = text.trim();
  if (trimmed.length === 0) {
    throw new Error("Text cannot be empty");
  }
  if (trimmed.length > 1000) {
    throw new Error("Text cannot exceed 1000 characters");
  }
  return trimmed;
}

function validateSentiment(sentiment) {
  if (!sentiment || typeof sentiment !== "string") {
    throw new Error("Sentiment is required and must be a string");
  }
  if (!VALID_SENTIMENTS.includes(sentiment.toLowerCase())) {
    throw new Error(
      `Invalid sentiment. Must be one of: ${VALID_SENTIMENTS.join(", ")}`
    );
  }
  return sentiment.toLowerCase();
}

exports.handler = async (event) => {
  try {
    if (!event.arguments) {
      throw new Error("Missing arguments");
    }

    const { text, sentiment, userId: providedUserId } = event.arguments;

    const userId =
      providedUserId ||
      event.identity?.sub ||
      event.identity?.username ||
      event.requestContext?.identity?.cognitoIdentityId ||
      "anonymous";

    const validatedText = validateText(text);
    const validatedSentiment = validateSentiment(sentiment);

    const id = ulid();
    const dateCreated = new Date().toISOString();

    const note = {
      id,
      text: validatedText,
      sentiment: validatedSentiment,
      dateCreated,
      userId,
    };

    await docClient.send(
      new PutCommand({
        TableName: process.env.NOTES_TABLE_NAME,
        Item: note,
      })
    );

    return note;
  } catch (error) {
    console.error("Error creating note:", error);
    if (
      error.message &&
      (error.message.includes("Invalid") ||
        error.message.includes("required") ||
        error.message.includes("cannot") ||
        error.message.includes("Missing arguments"))
    ) {
      throw error;
    }
    throw new Error("Failed to create note");
  }
};
