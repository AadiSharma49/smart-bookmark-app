"use client";

import { Session } from "@supabase/supabase-js";
import { Header } from "./Header";
import { BookmarkForm } from "./BookmarkForm";
import { BookmarkList } from "./BookmarkList";
import { useBookmarks } from "../hooks/useBookmarks";
import { AuthOperations } from "../types";

interface DashboardProps extends Pick<AuthOperations, 'onLogout'> {
  session: Session;
}

export function Dashboard({ session, onLogout }: DashboardProps) {
  const { bookmarks, saveBookmark, deleteBookmark } = useBookmarks(session);

  return (
    <main className="min-h-screen bg-gray-100">
      <div className="max-w-4xl mx-auto p-6 space-y-6">
        <Header email={session.user.email} onLogout={onLogout} />
        <BookmarkForm onAdd={saveBookmark} />
        <BookmarkList
          bookmarks={bookmarks}
          onDelete={deleteBookmark}
          onUpdate={saveBookmark}
        />
      </div>
    </main>
  );
}
