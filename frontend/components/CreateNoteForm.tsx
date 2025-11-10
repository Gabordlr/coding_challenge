"use client";

import { useState } from "react";
import { Sentiment } from "@/lib/graphql/types";
import { useCreateNote } from "@/hooks/useCreateNote";

interface CreateNoteFormProps {
  onNoteCreated: () => void;
  userId?: string | null;
}

export default function CreateNoteForm({
  onNoteCreated,
  userId,
}: CreateNoteFormProps) {
  const [text, setText] = useState("");
  const [sentiment, setSentiment] = useState<Sentiment>(Sentiment.NEUTRAL);
  const { createNote, isSubmitting, error, reset } = useCreateNote({ userId });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    reset();

    const success = await createNote(text, sentiment);
    if (success) {
      setText("");
      setSentiment(Sentiment.NEUTRAL);
      onNoteCreated();
    }
  };

  const sentimentColors = {
    [Sentiment.HAPPY]: "bg-yellow-100 border-yellow-300 text-yellow-800",
    [Sentiment.SAD]: "bg-blue-100 border-blue-300 text-blue-800",
    [Sentiment.NEUTRAL]: "bg-gray-100 border-gray-300 text-gray-800",
    [Sentiment.ANGRY]: "bg-red-100 border-red-300 text-red-800",
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white rounded-lg shadow-md p-6 mb-8"
    >
      <h2 className="text-2xl font-bold mb-4 text-gray-800">Create a Note</h2>

      {error && (
        <div className="mb-4 p-3 bg-red-100 border border-red-300 text-red-800 rounded">
          {error}
        </div>
      )}

      <div className="mb-4">
        <label
          htmlFor="text"
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          Note Text
        </label>
        <textarea
          id="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows={4}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 bg-white placeholder:text-gray-500"
          placeholder="Write your note here..."
          maxLength={1000}
        />
        <div className="mt-1 text-right text-xs text-gray-500">
          {text.length}/1000 characters
        </div>
      </div>

      <div className="mb-4">
        <label
          htmlFor="sentiment"
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          Sentiment
        </label>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          {Object.values(Sentiment).map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => setSentiment(s)}
              className={`px-4 py-2 rounded-md border-2 transition-all ${
                sentiment === s
                  ? sentimentColors[s] + " font-bold"
                  : "bg-white border-gray-300 text-gray-700 hover:bg-gray-50"
              }`}
            >
              {s.charAt(0).toUpperCase() + s.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        {isSubmitting ? "Creating..." : "Create Note"}
      </button>
    </form>
  );
}
