"use client";

import { useEffect, useState } from "react";
import { supabase } from "./lib/supabaseClient";

export default function Home() {
  const [session, setSession] = useState<any>(null);
  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");
  const [bookmarks, setBookmarks] = useState<any[]>([]);

  // 🔥 Fetch Bookmarks
  const fetchBookmarks = async () => {
    const { data, error } = await supabase
      .from("bookmarks")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Fetch error:", error);
      return;
    }

    setBookmarks(data || []);
  };

  useEffect(() => {
    async function getSession() {
      const { data } = await supabase.auth.getSession();
      setSession(data.session);

      if (data.session) {
        fetchBookmarks();
      }
    }

    getSession();
    const channel = supabase
  .channel("bookmarks-changes")
  .on(
    "postgres_changes",
    {
      event: "*",
      schema: "public",
      table: "bookmarks",
    },
    () => {
      fetchBookmarks();
    }
  )
  .subscribe();

    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session);
        if (session) {
          fetchBookmarks();
        } else {
          setBookmarks([]);
        }
      }
    );

    return () => {
  listener.subscription.unsubscribe();
  supabase.removeChannel(channel);
};
  }, []);

  const handleLogin = async () => {
    await supabase.auth.signInWithOAuth({
      provider: "google",
    });
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  const handleAddBookmark = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title || !url) return;

    const { error } = await supabase.from("bookmarks").insert([
      {
        title,
        url,
        user_id: session.user.id,
      },
    ]);

    if (error) {
      console.error("Insert Error:", error);
      return;
    }

    setTitle("");
    setUrl("");

    await fetchBookmarks(); // 🔥 Refresh after insert
  };

  const handleDeleteBookmark = async (id: string) => {
  setBookmarks((prev) => prev.filter((b) => b.id !== id));

  const { error } = await supabase
    .from("bookmarks")
    .delete()
    .eq("id", id);

  if (error) {
    console.error("Delete error:", error);
    await fetchBookmarks(); // fallback if something fails
  }
};

  // 🔐 Not Logged In UI
  if (!session) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-white">
        <div className="bg-gray-500 p-10 rounded-2xl shadow-lg text-center w-[400px]">
          <h1 className="text-3xl font-bold mb-3">
            Smart Bookmark App
          </h1>
          <p className="text-gray-300 mb-6">
            Save and manage your bookmarks securely.
          </p>

          <button
            onClick={handleLogin}
            className="w-full py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition cursor-pointer"
          >
            Continue with Google
          </button>
        </div>
      </main>
    );
  }

  // ✅ Logged In UI
  return (
    <main className="min-h-screen bg-gray-100">
      <div className="max-w-4xl mx-auto p-6 space-y-6">

        {/* Header */}
        <div className="bg-black rounded-2xl shadow-md p-6 flex justify-between items-center">
          <div>
            <h2 className="text-xl font-semibold text-white">
              Welcome back
            </h2>
            <p className="text-blue-500 text-sm">
              {session.user.email}
            </p>
          </div>

          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition cursor-pointer"
          >
            Logout
          </button>
        </div>

        {/* Add Bookmark */}
        <div className="bg-black rounded-2xl shadow-md p-6">
          <h3 className="text-lg font-semibold text-white mb-4">
            Add New Bookmark
          </h3>

          <form onSubmit={handleAddBookmark} className="space-y-4">
            <input
              type="text"
              placeholder="Bookmark Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-gray-900 text-white placeholder-gray-500 border border-gray-800 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            <input
              type="url"
              placeholder="https://example.com"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="w-full bg-gray-900 text-white placeholder-gray-500 border border-gray-800 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            <button
              type="submit"
              className="w-full bg-white text-black py-2 rounded-lg hover:bg-gray-200 transition cursor-pointer font-medium"
            >
              Add Bookmark
            </button>
          </form>
        </div>

        {/* Bookmark List */}
        <div className="bg-black rounded-2xl shadow-md p-6">
  <h3 className="text-lg font-semibold text-white mb-4">
    Your Bookmarks
  </h3>

  {bookmarks.length === 0 ? (
    <p className="text-gray-400">No bookmarks yet.</p>
  ) : (
    <div className="space-y-3">
      {bookmarks.map((bookmark) => (
        <div
          key={bookmark.id}
          className="bg-gray-900 p-4 rounded-lg flex justify-between items-center"
        >
          <div>
            <p className="text-white font-medium">
              {bookmark.title}
            </p>
            <a
              href={bookmark.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-400 text-sm"
            >
              {bookmark.url}
            </a>
          </div>

          <button
            onClick={() => handleDeleteBookmark(bookmark.id)}
            className="bg-red-500 text-white px-3 py-1 rounded-lg hover:bg-red-600 transition text-sm"
          >
            Delete
          </button>
        </div>
      ))}
    </div>
  )}
</div>

      </div>
    </main>
  );
}
