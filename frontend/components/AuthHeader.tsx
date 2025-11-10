"use client";

import { useState, useEffect } from "react";
import { getCurrentUser, signOut, fetchAuthSession } from "aws-amplify/auth";

export default function AuthHeader() {
  const [user, setUser] = useState<{ username: string; userId: string } | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    try {
      const currentUser = await getCurrentUser();
      const session = await fetchAuthSession();
      const userId = session.tokens?.idToken?.payload?.sub as
        | string
        | undefined;

      setUser({
        username: currentUser.username,
        userId: userId || currentUser.userId,
      });
    } catch {
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      setUser(null);
      window.location.reload();
    } catch (err) {
      console.error("Error signing out:", err);
    }
  };

  if (isLoading) {
    return (
      <div className="mb-4 text-right">
        <div className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-solid border-blue-600 border-r-transparent"></div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="mb-4 flex justify-between items-center bg-white rounded-lg shadow-sm p-4">
      <div>
        <p className="text-sm text-gray-600">Signed in as</p>
        <p className="text-sm font-medium text-gray-900">{user.username}</p>
      </div>
      <button
        onClick={handleSignOut}
        className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
      >
        Sign Out
      </button>
    </div>
  );
}
