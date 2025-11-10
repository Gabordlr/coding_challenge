"use client";

import { useEffect } from "react";
import { Sentiment } from "@/lib/graphql/types";
import { useNotes } from "@/hooks/useNotes";
import NoteSkeleton from "./NoteSkeleton";

interface NotesListProps {
  userId?: string | null;
}

export default function NotesList({ userId }: NotesListProps) {
  const {
    notes,
    loading,
    error,
    hasMore,
    selectedSentiment,
    setSelectedSentiment,
    filterByUser,
    setFilterByUser,
    loadMore,
    refresh,
  } = useNotes({ userId });

  useEffect(() => {
    refresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const sentimentColors = {
    [Sentiment.HAPPY]: "bg-yellow-100 text-yellow-800 border-yellow-300",
    [Sentiment.SAD]: "bg-blue-100 text-blue-800 border-blue-300",
    [Sentiment.NEUTRAL]: "bg-gray-100 text-gray-800 border-gray-300",
    [Sentiment.ANGRY]: "bg-red-100 text-red-800 border-red-300",
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    // Use a consistent format to avoid hydration mismatches
    const months = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];
    const year = date.getFullYear();
    const month = months[date.getMonth()];
    const day = date.getDate();
    const hours = date.getHours().toString().padStart(2, "0");
    const minutes = date.getMinutes().toString().padStart(2, "0");
    return `${month} ${day}, ${year} at ${hours}:${minutes}`;
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-gray-800">Notes</h2>
        <button
          onClick={refresh}
          disabled={loading}
          className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 disabled:opacity-50 transition-colors"
        >
          Refresh
        </button>
      </div>

      <div className="mb-4 space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Filter by User
          </label>
          <div className="flex gap-2">
            <button
              onClick={() => setFilterByUser(false)}
              className={`px-4 py-2 rounded-md border-2 transition-all ${
                !filterByUser
                  ? "bg-gray-800 text-white border-gray-800 font-bold"
                  : "bg-white border-gray-300 text-gray-700 hover:bg-gray-50"
              }`}
            >
              All Notes
            </button>
            <button
              onClick={() => setFilterByUser(true)}
              className={`px-4 py-2 rounded-md border-2 transition-all ${
                filterByUser
                  ? "bg-blue-600 text-white border-blue-600 font-bold"
                  : "bg-white border-gray-300 text-gray-700 hover:bg-gray-50"
              }`}
            >
              My Notes
            </button>
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Filter by Sentiment
          </label>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedSentiment("all")}
              className={`px-4 py-2 rounded-md border-2 transition-all ${
                selectedSentiment === "all"
                  ? "bg-gray-800 text-white border-gray-800 font-bold"
                  : "bg-white border-gray-300 text-gray-700 hover:bg-gray-50"
              }`}
            >
              All
            </button>
            {Object.values(Sentiment).map((s) => (
              <button
                key={s}
                onClick={() => setSelectedSentiment(s)}
                className={`px-4 py-2 rounded-md border-2 transition-all ${
                  selectedSentiment === s
                    ? sentimentColors[s] + " font-bold"
                    : "bg-white border-gray-300 text-gray-700 hover:bg-gray-50"
                }`}
              >
                {s.charAt(0).toUpperCase() + s.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-100 border border-red-300 text-red-800 rounded">
          {error}
        </div>
      )}

      {loading && notes.length === 0 ? (
        <div className="space-y-4">
          <NoteSkeleton />
          <NoteSkeleton />
          <NoteSkeleton />
        </div>
      ) : notes.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          No notes found. Create one above!
        </div>
      ) : (
        <>
          <div className="space-y-4">
            {notes.map((note) => (
              <div
                key={note.id}
                className={`p-4 rounded-lg border-2 ${
                  sentimentColors[note.sentiment]
                }`}
              >
                <div className="flex justify-between items-start mb-2">
                  <span className="font-semibold text-sm">
                    {note.sentiment.charAt(0).toUpperCase() +
                      note.sentiment.slice(1)}
                  </span>
                  <span className="text-xs opacity-75">
                    {formatDate(note.dateCreated)}
                  </span>
                </div>
                <p className="text-sm whitespace-pre-wrap">{note.text}</p>
              </div>
            ))}
          </div>

          {hasMore && (
            <div className="mt-6 text-center">
              <button
                onClick={loadMore}
                disabled={loading}
                className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {loading ? "Loading..." : "Load More"}
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
