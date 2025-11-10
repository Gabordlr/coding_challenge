const { handler } = require("../index");
const {
  DynamoDBDocumentClient,
  QueryCommand,
  ScanCommand,
} = require("@aws-sdk/lib-dynamodb");

// Mock AWS SDK
jest.mock("@aws-sdk/lib-dynamodb", () => {
  const mockSend = jest.fn();
  return {
    DynamoDBDocumentClient: {
      from: jest.fn(() => ({
        send: mockSend,
      })),
    },
    QueryCommand: jest.fn((params) => params),
    ScanCommand: jest.fn((params) => params),
    mockSend,
  };
});

const { mockSend } = require("@aws-sdk/lib-dynamodb");

describe("getNotes Lambda Handler", () => {
  const originalEnv = process.env;

  beforeEach(() => {
    jest.clearAllMocks();
    process.env = {
      ...originalEnv,
      NOTES_TABLE_NAME: "TestNotesTable",
    };
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  it("should get all notes without filters", async () => {
    const mockItems = [
      {
        id: "1",
        text: "Note 1",
        sentiment: "happy",
        dateCreated: "2024-01-01T00:00:00Z",
      },
      {
        id: "2",
        text: "Note 2",
        sentiment: "sad",
        dateCreated: "2024-01-02T00:00:00Z",
      },
    ];

    mockSend.mockResolvedValueOnce({
      Items: mockItems,
      ScannedCount: 2,
    });

    const event = {
      arguments: {},
    };

    const result = await handler(event);

    expect(result).toHaveProperty("items");
    expect(result.items).toHaveLength(2);
    expect(result).toHaveProperty("scannedCount", 2);
    expect(ScanCommand).toHaveBeenCalled();
  });

  it("should filter notes by sentiment and respect limit", async () => {
    const mockItems = [
      {
        id: "1",
        text: "Happy note",
        sentiment: "happy",
        dateCreated: "2024-01-01T00:00:00Z",
      },
    ];

    mockSend.mockResolvedValueOnce({
      Items: mockItems,
      ScannedCount: 1,
    });

    const event = {
      arguments: {
        sentiment: "HAPPY",
        limit: 10,
      },
    };

    const result = await handler(event);

    expect(result.items).toHaveLength(1);
    expect(result.items[0].sentiment).toBe("happy");
    expect(QueryCommand).toHaveBeenCalledWith(
      expect.objectContaining({
        ExpressionAttributeValues: {
          ":sentiment": "happy",
        },
      })
    );
  });

  it("should throw error if limit exceeds 100 or is invalid", async () => {
    const event1 = {
      arguments: {
        limit: 101,
      },
    };

    await expect(handler(event1)).rejects.toThrow("Limit cannot exceed 100");

    const event2 = {
      arguments: {
        limit: -1,
      },
    };

    await expect(handler(event2)).rejects.toThrow(
      "Limit must be a positive number"
    );
  });

  it("should filter notes by userId when provided", async () => {
    const mockItems = [
      {
        id: "1",
        text: "User 1 note",
        sentiment: "happy",
        userId: "user-1",
        dateCreated: "2024-01-01T00:00:00Z",
      },
    ];

    mockSend.mockResolvedValueOnce({
      Items: mockItems,
      ScannedCount: 1,
    });

    const event = {
      arguments: {
        userId: "user-1",
      },
    };

    const result = await handler(event);

    expect(result.items).toHaveLength(1);
    expect(QueryCommand).toHaveBeenCalledWith(
      expect.objectContaining({
        IndexName: "userId-dateCreated-index",
        KeyConditionExpression: "userId = :userId",
        ExpressionAttributeValues: {
          ":userId": "user-1",
        },
      })
    );
  });

  it("should filter by userId and sentiment together", async () => {
    const mockItems = [
      {
        id: "1",
        text: "Happy note",
        sentiment: "happy",
        userId: "user-1",
        dateCreated: "2024-01-01T00:00:00Z",
      },
    ];

    mockSend.mockResolvedValueOnce({
      Items: mockItems,
      ScannedCount: 1,
    });

    const event = {
      arguments: {
        userId: "user-1",
        sentiment: "happy",
      },
    };

    const result = await handler(event);

    expect(result.items).toHaveLength(1);
    expect(QueryCommand).toHaveBeenCalledWith(
      expect.objectContaining({
        IndexName: "userId-dateCreated-index",
        FilterExpression: "sentiment = :sentiment",
        ExpressionAttributeValues: {
          ":userId": "user-1",
          ":sentiment": "happy",
        },
      })
    );
  });
});
