"use client";

import { Button } from "./ui/Button";
import { AuthOperations } from "../types";

interface AuthViewProps extends Pick<AuthOperations, 'onLogin'> {}

export function AuthView({ onLogin }: AuthViewProps) {
  return (
    <main className="min-h-screen flex items-center justify-center bg-white">
      <div className="bg-gray-500 p-10 rounded-2xl shadow-lg text-center w-[400px]">
        <h1 className="text-3xl font-bold mb-3">
          Smart Bookmark App
        </h1>
        <p className="text-gray-300 mb-6">
          Save and manage your bookmarks securely.
        </p>

        <Button
          onClick={onLogin}
          variant="accent"
          fullWidth
          className="py-3"
        >
          Continue with Google
        </Button>
      </div>
    </main>
  );
}
