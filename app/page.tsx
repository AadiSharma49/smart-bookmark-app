"use client";

import { useAuth } from "./hooks/useAuth";
import { AuthView } from "./components/AuthView";
import { Dashboard } from "./components/Dashboard";

export default function Home() {
  const { session, loading, onLogin, onLogout } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500" />
      </div>
    );
  }

  if (!session) {
    return <AuthView onLogin={onLogin} />;
  }

  return <Dashboard session={session} onLogout={onLogout} />;
}
