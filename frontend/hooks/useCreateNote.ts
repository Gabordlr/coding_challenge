"use client";

import { useState, useCallback } from "react";
import { Sentiment } from "@/lib/graphql/types";
import { CREATE_NOTE } from "@/lib/graphql/queries";
import { executeMutation } from "@/lib/graphql/client";

interface UseCreateNoteOptions {
  userId?: string | null;
}

interface UseCreateNoteReturn {
  createNote: (text: string, sentiment: Sentiment) => Promise<boolean>;
  isSubmitting: boolean;
  error: string | null;
  reset: () => void;
}

export function useCreateNote(
  options: UseCreateNoteOptions = {}
): UseCreateNoteReturn {
  const { userId } = options;
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createNote = useCallback(
    async (text: string, sentiment: Sentiment): Promise<boolean> => {
      if (!text.trim()) {
        setError("Please enter some text");
        return false;
      }

      setIsSubmitting(true);
      setError(null);

      try {
        const result = await executeMutation(CREATE_NOTE, {
          text: text.trim(),
          sentiment,
          userId: userId || null,
        });

        if (result.errors) {
          setError(result.errors[0]?.message || "Failed to create note");
          return false;
        }
        return true;
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to create note");
        return false;
      } finally {
        setIsSubmitting(false);
      }
    },
    [userId]
  );

  const reset = useCallback(() => {
    setError(null);
    setIsSubmitting(false);
  }, []);

  return {
    createNote,
    isSubmitting,
    error,
    reset,
  };
}
