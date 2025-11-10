"use client";

import { useEffect, useState } from "react";
import { configureAmplify } from "@/lib/amplify-config";
import { getCurrentUser, fetchAuthSession } from "aws-amplify/auth";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import CreateNoteForm from "@/components/CreateNoteForm";
import NotesList from "@/components/NotesList";
import SignIn from "@/components/SignIn";
import SignUp from "@/components/SignUp";
import AuthHeader from "@/components/AuthHeader";

type AuthView = "signin" | "signup";

export default function Home() {
  const [isConfigured, setIsConfigured] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [authView, setAuthView] = useState<AuthView>("signin");
  const [refreshKey, setRefreshKey] = useState(0);

  const checkAuth = async () => {
    try {
      const user = await getCurrentUser();
      const session = await fetchAuthSession();

      // Try to get user ID from session token (Cognito sub)
      // This is the actual user ID we need for filtering
      const userSub = session.tokens?.idToken?.payload?.sub as
        | string
        | undefined;

      // Fallback to username if sub is not available
      // Note: username might be the email, but we need the sub for filtering
      const userId = userSub || user.userId || user.username;

      console.log("User ID for filtering:", userId);
      console.log("User object:", user);
      console.log("Session tokens:", session.tokens?.idToken?.payload);

      setUserId(userId);
      setIsAuthenticated(true);
    } catch (err) {
      console.error("Error checking auth:", err);
      setIsAuthenticated(false);
      setUserId(null);
    }
  };

  useEffect(() => {
    // Configure Amplify when component mounts
    const configure = async () => {
      try {
        configureAmplify();
        setIsConfigured(true);
        await checkAuth();
      } catch (error) {
        console.error("Failed to configure Amplify:", error);
      }
    };
    configure();
  }, []);

  const handleNoteCreated = () => {
    // Trigger refresh of notes list
    setRefreshKey((prev) => prev + 1);
  };

  const handleAuthSuccess = async () => {
    await checkAuth();
  };

  if (!isConfigured) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <p className="text-gray-600">Configuring application...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <ErrorBoundary>
        <div className="min-h-screen bg-gray-50 py-8">
          <div className="max-w-4xl mx-auto px-4">
            <header className="mb-8 text-center">
              <h1 className="text-4xl font-bold text-gray-900 mb-2">
                Notes with Sentiment
              </h1>
              <p className="text-gray-600">
                Create and view notes with emotional context
              </p>
            </header>
            {authView === "signin" ? (
              <SignIn
                onSignInSuccess={handleAuthSuccess}
                onSwitchToSignUp={() => setAuthView("signup")}
              />
            ) : (
              <SignUp
                onSignUpSuccess={handleAuthSuccess}
                onSwitchToSignIn={() => setAuthView("signin")}
              />
            )}
          </div>
        </div>
      </ErrorBoundary>
    );
  }

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4">
          <header className="mb-8 text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              Notes with Sentiment
            </h1>
            <p className="text-gray-600">
              Create and view notes with emotional context
            </p>
          </header>

          <AuthHeader />

          <ErrorBoundary>
            <CreateNoteForm onNoteCreated={handleNoteCreated} userId={userId} />
          </ErrorBoundary>
          <ErrorBoundary>
            <NotesList key={refreshKey} userId={userId} />
          </ErrorBoundary>
        </div>
      </div>
    </ErrorBoundary>
  );
}
