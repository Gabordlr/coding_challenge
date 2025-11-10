const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const {
  DynamoDBDocumentClient,
  QueryCommand,
  ScanCommand,
} = require("@aws-sdk/lib-dynamodb");

const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);

const VALID_SENTIMENTS = ["happy", "sad", "neutral", "angry"];

function validateLimit(limit) {
  if (limit === undefined || limit === null) {
    return 10;
  }
  const num = parseInt(limit, 10);
  if (isNaN(num) || num < 1) {
    throw new Error("Limit must be a positive number");
  }
  if (num > 100) {
    throw new Error("Limit cannot exceed 100");
  }
  return num;
}

function validateSentiment(sentiment) {
  if (sentiment === null || sentiment === undefined) {
    return null;
  }
  if (typeof sentiment !== "string") {
    throw new Error("Sentiment must be a string");
  }
  const lower = sentiment.toLowerCase();
  if (!VALID_SENTIMENTS.includes(lower)) {
    throw new Error(
      `Invalid sentiment. Must be one of: ${VALID_SENTIMENTS.join(", ")}`
    );
  }
  return lower;
}

function validateNextToken(nextToken) {
  if (!nextToken) {
    return null;
  }
  if (typeof nextToken !== "string") {
    throw new Error("nextToken must be a string");
  }
  return nextToken;
}

exports.handler = async (event) => {
  try {
    const args = event.arguments || {};

    const limitNum = validateLimit(args.limit);
    const sentiment = validateSentiment(args.sentiment);
    const nextToken = validateNextToken(args.nextToken);

    let userId = null;
    if (args.hasOwnProperty("userId")) {
      userId = args.userId || null;
    } else {
      userId = event.identity?.sub || event.identity?.username || null;
    }

    let result;

    if (userId) {
      const params = {
        TableName: process.env.NOTES_TABLE_NAME,
        IndexName: "userId-dateCreated-index",
        KeyConditionExpression: "userId = :userId",
        ExpressionAttributeValues: {
          ":userId": userId,
        },
        Limit: limitNum + 1,
        ScanIndexForward: false,
      };

      if (sentiment) {
        params.FilterExpression = "sentiment = :sentiment";
        params.ExpressionAttributeValues[":sentiment"] = sentiment;
      }

      if (nextToken) {
        params.ExclusiveStartKey = JSON.parse(
          Buffer.from(nextToken, "base64").toString("utf-8")
        );
      }

      result = await docClient.send(new QueryCommand(params));
    } else if (sentiment) {
      const params = {
        TableName: process.env.NOTES_TABLE_NAME,
        IndexName: "sentiment-dateCreated-index",
        KeyConditionExpression: "sentiment = :sentiment",
        ExpressionAttributeValues: {
          ":sentiment": sentiment,
        },
        Limit: limitNum + 1,
        ScanIndexForward: false,
      };

      if (nextToken) {
        params.ExclusiveStartKey = JSON.parse(
          Buffer.from(nextToken, "base64").toString("utf-8")
        );
      }

      result = await docClient.send(new QueryCommand(params));
    } else {
      const params = {
        TableName: process.env.NOTES_TABLE_NAME,
        Limit: limitNum + 1,
      };

      if (nextToken) {
        params.ExclusiveStartKey = JSON.parse(
          Buffer.from(nextToken, "base64").toString("utf-8")
        );
      }

      result = await docClient.send(new ScanCommand(params));
    }

    const items = result.Items || [];
    const hasMore = items.length > limitNum;
    const notes = hasMore ? items.slice(0, limitNum) : items;

    const notesWithUserId = notes.map((note) => {
      if (!note.userId) {
        return {
          ...note,
          userId: "anonymous",
        };
      }
      return note;
    });

    notesWithUserId.sort((a, b) => {
      return (
        new Date(b.dateCreated).getTime() - new Date(a.dateCreated).getTime()
      );
    });

    let nextTokenValue = null;
    if (hasMore && result.LastEvaluatedKey) {
      nextTokenValue = Buffer.from(
        JSON.stringify(result.LastEvaluatedKey)
      ).toString("base64");
    }

    return {
      items: notesWithUserId,
      nextToken: nextTokenValue,
      scannedCount: result.ScannedCount || notesWithUserId.length,
    };
  } catch (error) {
    console.error("Error getting notes:", error);
    if (
      error.message &&
      (error.message.includes("Invalid") ||
        error.message.includes("must be") ||
        error.message.includes("exceed"))
    ) {
      throw error;
    }
    throw new Error("Failed to get notes");
  }
};
