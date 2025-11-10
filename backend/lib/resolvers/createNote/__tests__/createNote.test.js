const { handler } = require("../index");
const { DynamoDBDocumentClient, PutCommand } = require("@aws-sdk/lib-dynamodb");

// Mock AWS SDK
jest.mock("@aws-sdk/lib-dynamodb", () => {
  const mockSend = jest.fn();
  return {
    DynamoDBDocumentClient: {
      from: jest.fn(() => ({
        send: mockSend,
      })),
    },
    PutCommand: jest.fn((params) => params),
    mockSend,
  };
});

const { mockSend } = require("@aws-sdk/lib-dynamodb");

describe("createNote Lambda Handler", () => {
  const originalEnv = process.env;

  beforeEach(() => {
    jest.clearAllMocks();
    process.env = {
      ...originalEnv,
      NOTES_TABLE_NAME: "TestNotesTable",
    };
    mockSend.mockResolvedValue({});
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  it("should create a note with valid input", async () => {
    const event = {
      arguments: {
        text: "This is a test note",
        sentiment: "happy",
      },
    };

    const result = await handler(event);

    expect(result).toHaveProperty("id");
    expect(result).toHaveProperty("text", "This is a test note");
    expect(result).toHaveProperty("sentiment", "happy");
    expect(result).toHaveProperty("dateCreated");
    expect(mockSend).toHaveBeenCalledTimes(1);
    expect(PutCommand).toHaveBeenCalledWith({
      TableName: "TestNotesTable",
      Item: expect.objectContaining({
        text: "This is a test note",
        sentiment: "happy",
      }),
    });
  });

  it("should trim whitespace and normalize sentiment", async () => {
    const event = {
      arguments: {
        text: "  Trimmed text  ",
        sentiment: "HAPPY",
      },
    };

    const result = await handler(event);

    expect(result.text).toBe("Trimmed text");
    expect(result.sentiment).toBe("happy");
  });

  it("should throw error if text is empty or missing", async () => {
    const event1 = {
      arguments: {
        sentiment: "happy",
      },
    };

    await expect(handler(event1)).rejects.toThrow("Text is required");

    const event2 = {
      arguments: {
        text: "   ",
        sentiment: "happy",
      },
    };

    await expect(handler(event2)).rejects.toThrow("Text cannot be empty");
  });

  it("should throw error if text exceeds 1000 characters", async () => {
    const event = {
      arguments: {
        text: "a".repeat(1001),
        sentiment: "happy",
      },
    };

    await expect(handler(event)).rejects.toThrow(
      "Text cannot exceed 1000 characters"
    );
  });

  it("should throw error if sentiment is missing or invalid", async () => {
    const event1 = {
      arguments: {
        text: "Test note",
      },
    };

    await expect(handler(event1)).rejects.toThrow("Sentiment is required");

    const event2 = {
      arguments: {
        text: "Test note",
        sentiment: "invalid",
      },
    };

    await expect(handler(event2)).rejects.toThrow("Invalid sentiment");
  });

  it("should extract userId from Cognito identity context", async () => {
    const event = {
      arguments: {
        text: "Test note",
        sentiment: "happy",
      },
      identity: {
        sub: "user-123",
      },
    };

    const result = await handler(event);

    expect(result).toHaveProperty("userId", "user-123");
    expect(mockSend).toHaveBeenCalledWith(
      expect.objectContaining({
        Item: expect.objectContaining({
          userId: "user-123",
        }),
      })
    );
  });

  it("should use anonymous userId when identity is not available", async () => {
    const event = {
      arguments: {
        text: "Test note",
        sentiment: "happy",
      },
    };

    const result = await handler(event);

    expect(result).toHaveProperty("userId", "anonymous");
  });
});
