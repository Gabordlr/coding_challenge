"use client";

import { useState, useCallback } from "react";
import { Note, Sentiment, NoteQueryResults } from "@/lib/graphql/types";
import { GET_NOTES } from "@/lib/graphql/queries";
import { executeQuery } from "@/lib/graphql/client";

interface UseNotesOptions {
  initialSentiment?: Sentiment | "all";
  pageSize?: number;
  userId?: string | null;
  filterByUser?: boolean;
}

interface UseNotesReturn {
  notes: Note[];
  loading: boolean;
  error: string | null;
  nextToken: string | null;
  hasMore: boolean;
  selectedSentiment: Sentiment | "all";
  filterByUser: boolean;
  loadNotes: (
    sentiment?: Sentiment | "all",
    token?: string | null,
    userId?: string | null
  ) => Promise<void>;
  setSelectedSentiment: (sentiment: Sentiment | "all") => void;
  setFilterByUser: (filter: boolean) => void;
  loadMore: () => Promise<void>;
  refresh: () => Promise<void>;
}

export function useNotes(options: UseNotesOptions = {}): UseNotesReturn {
  const {
    initialSentiment = "all",
    pageSize = 10,
    userId,
    filterByUser: initialFilterByUser = false,
  } = options;
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [nextToken, setNextToken] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(false);
  const [selectedSentiment, setSelectedSentiment] = useState<Sentiment | "all">(
    initialSentiment
  );
  const [filterByUser, setFilterByUserState] = useState(initialFilterByUser);

  const loadNotes = useCallback(
    async (
      sentiment: Sentiment | "all" = selectedSentiment,
      token: string | null = null,
      filterUserId: string | null | undefined = undefined
    ) => {
      const actualFilterUserId =
        filterUserId !== undefined
          ? filterUserId
          : filterByUser
            ? userId
            : null;
      setLoading(true);
      setError(null);

      try {
        const variables: Record<string, unknown> = {
          limit: pageSize,
          nextToken: token,
          sentiment: sentiment === "all" ? null : sentiment,
        };

        variables.userId = actualFilterUserId || null;

        const result = await executeQuery<{ getNotes: NoteQueryResults }>(
          GET_NOTES,
          variables
        );

        if (result.errors) {
          setError(result.errors[0]?.message || "Failed to load notes");
        } else if (result.data) {
          const data = result.data.getNotes;
          if (token) {
            setNotes((prev) => [...prev, ...data.items]);
          } else {
            setNotes(data.items);
          }
          setNextToken(data.nextToken || null);
          setHasMore(!!data.nextToken);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load notes");
      } finally {
        setLoading(false);
      }
    },
    [selectedSentiment, pageSize, filterByUser, userId]
  );

  const loadMore = useCallback(async () => {
    if (nextToken && !loading) {
      await loadNotes(selectedSentiment, nextToken);
    }
  }, [nextToken, loading, selectedSentiment, loadNotes]);

  const refresh = useCallback(async () => {
    await loadNotes(selectedSentiment, null);
  }, [selectedSentiment, loadNotes]);

  const handleSetSelectedSentiment = useCallback(
    (sentiment: Sentiment | "all") => {
      setSelectedSentiment(sentiment);
      loadNotes(sentiment, null);
    },
    [loadNotes]
  );

  const handleSetFilterByUser = useCallback(
    (filter: boolean) => {
      setFilterByUserState(filter);
      const filterUserId = filter ? userId : null;

      if (filter && !userId) {
        setError("User ID not available. Please sign in again.");
        return;
      }
      loadNotes(selectedSentiment, null, filterUserId);
    },
    [selectedSentiment, loadNotes, userId]
  );

  return {
    notes,
    loading,
    error,
    nextToken,
    hasMore,
    selectedSentiment,
    filterByUser,
    loadNotes,
    setSelectedSentiment: handleSetSelectedSentiment,
    setFilterByUser: handleSetFilterByUser,
    loadMore,
    refresh,
  };
}
