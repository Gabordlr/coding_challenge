const fetch = require("node-fetch");

const API_URL = process.env.GRAPHQL_API_URL;
const API_KEY = process.env.GRAPHQL_API_KEY;

// Skip tests if API is not configured
const describeIfConfigured = API_URL && API_KEY ? describe : describe.skip;

describeIfConfigured("GraphQL API Integration Tests", () => {
  const headers = {
    "Content-Type": "application/json",
    "x-api-key": API_KEY,
  };

  const createNoteMutation = `
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

  const getNotesQuery = `
    query GetNotes($sentiment: Sentiment, $limit: Int, $nextToken: String, $userId: ID) {
      getNotes(sentiment: $sentiment, limit: $limit, nextToken: $nextToken, userId: $userId) {
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

  const createdNoteIds = [];

  afterAll(async () => {});

  describe("createNote mutation", () => {
    it("should create a note with valid input", async () => {
      const variables = {
        text: "Integration test note",
        sentiment: "HAPPY",
      };

      const response = await fetch(API_URL, {
        method: "POST",
        headers,
        body: JSON.stringify({
          query: createNoteMutation,
          variables,
        }),
      });

      const result = await response.json();

      expect(response.ok).toBe(true);
      expect(result.errors).toBeUndefined();
      expect(result.data.createNote).toHaveProperty("id");
      expect(result.data.createNote.text).toBe("Integration test note");
      expect(result.data.createNote.sentiment).toBe("happy");
      expect(result.data.createNote).toHaveProperty("dateCreated");

      createdNoteIds.push(result.data.createNote.id);
    });

    it("should reject empty text and invalid sentiment", async () => {
      const response1 = await fetch(API_URL, {
        method: "POST",
        headers,
        body: JSON.stringify({
          query: createNoteMutation,
          variables: { text: "", sentiment: "NEUTRAL" },
        }),
      });

      const result1 = await response1.json();
      expect(result1.errors).toBeDefined();
      expect(result1.errors[0].message).toContain("empty");

      const response2 = await fetch(API_URL, {
        method: "POST",
        headers,
        body: JSON.stringify({
          query: createNoteMutation,
          variables: { text: "Test note", sentiment: "INVALID" },
        }),
      });

      const result2 = await response2.json();
      expect(result2.errors).toBeDefined();
      expect(result2.errors[0].message).toContain("Invalid sentiment");
    });

    it("should create a note with userId parameter", async () => {
      const testUserId = "test-user-123";
      const variables = {
        text: "User-specific note",
        sentiment: "HAPPY",
        userId: testUserId,
      };

      const response = await fetch(API_URL, {
        method: "POST",
        headers,
        body: JSON.stringify({
          query: createNoteMutation,
          variables,
        }),
      });

      const result = await response.json();

      expect(response.ok).toBe(true);
      expect(result.errors).toBeUndefined();
      expect(result.data.createNote.userId).toBe(testUserId);

      createdNoteIds.push(result.data.createNote.id);
    });
  });

  describe("getNotes query", () => {
    beforeAll(async () => {
      // Create some test notes
      const sentiments = ["HAPPY", "SAD", "NEUTRAL", "ANGRY"];
      for (const sentiment of sentiments) {
        const response = await fetch(API_URL, {
          method: "POST",
          headers,
          body: JSON.stringify({
            query: createNoteMutation,
            variables: {
              text: `Test note with ${sentiment} sentiment`,
              sentiment,
            },
          }),
        });

        const result = await response.json();
        if (result.data?.createNote?.id) {
          createdNoteIds.push(result.data.createNote.id);
        }
      }

      // Wait a bit for eventual consistency
      await new Promise((resolve) => setTimeout(resolve, 1000));
    });

    it("should get all notes and filter by sentiment", async () => {
      const response1 = await fetch(API_URL, {
        method: "POST",
        headers,
        body: JSON.stringify({
          query: getNotesQuery,
          variables: {},
        }),
      });

      const result1 = await response1.json();
      expect(response1.ok).toBe(true);
      expect(result1.errors).toBeUndefined();
      expect(result1.data.getNotes).toHaveProperty("items");
      expect(result1.data.getNotes.items.length).toBeGreaterThan(0);

      const response2 = await fetch(API_URL, {
        method: "POST",
        headers,
        body: JSON.stringify({
          query: getNotesQuery,
          variables: { sentiment: "HAPPY" },
        }),
      });

      const result2 = await response2.json();
      expect(response2.ok).toBe(true);
      expect(
        result2.data.getNotes.items.every((note) => note.sentiment === "happy")
      ).toBe(true);
    });

    it("should respect limit and reject limit exceeding 100", async () => {
      const response1 = await fetch(API_URL, {
        method: "POST",
        headers,
        body: JSON.stringify({
          query: getNotesQuery,
          variables: { limit: 2 },
        }),
      });

      const result1 = await response1.json();
      expect(response1.ok).toBe(true);
      expect(result1.data.getNotes.items.length).toBeLessThanOrEqual(2);

      const response2 = await fetch(API_URL, {
        method: "POST",
        headers,
        body: JSON.stringify({
          query: getNotesQuery,
          variables: { limit: 101 },
        }),
      });

      const result2 = await response2.json();
      expect(result2.errors).toBeDefined();
      expect(result2.errors[0].message).toContain("exceed 100");
    });

    it("should filter notes by userId", async () => {
      const testUserId = "test-user-filter-456";

      const userNoteResponse = await fetch(API_URL, {
        method: "POST",
        headers,
        body: JSON.stringify({
          query: createNoteMutation,
          variables: {
            text: "User filter test note",
            sentiment: "HAPPY",
            userId: testUserId,
          },
        }),
      });

      const userNoteResult = await userNoteResponse.json();
      if (userNoteResult.data?.createNote?.id) {
        createdNoteIds.push(userNoteResult.data.createNote.id);
      }

      // Wait for eventual consistency
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const response = await fetch(API_URL, {
        method: "POST",
        headers,
        body: JSON.stringify({
          query: getNotesQuery,
          variables: { userId: testUserId },
        }),
      });

      const result = await response.json();

      expect(response.ok).toBe(true);
      expect(result.errors).toBeUndefined();
      expect(result.data.getNotes).toHaveProperty("items");

      if (result.data.getNotes.items.length > 0) {
        result.data.getNotes.items.forEach((note) => {
          expect(note.userId).toBe(testUserId);
        });
      }
    });
  });
});
