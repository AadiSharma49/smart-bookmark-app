import { useEffect, useState, useCallback } from "react";
import { supabase } from "../lib/supabaseClient";
import { Bookmark } from "../types";
import { Session } from "@supabase/supabase-js";

export function useBookmarks(session: Session | null) {
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchBookmarks = useCallback(async () => {
    if (!session) return;
    setLoading(true);
    const { data, error } = await supabase
      .from("bookmarks")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Fetch error:", error);
    } else {
      setBookmarks(data || []);
    }
    setLoading(false);
  }, [session]);

  useEffect(() => {
    if (!session) {
      setBookmarks([]);
      return;
    }

    fetchBookmarks();

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

    return () => {
      supabase.removeChannel(channel);
    };
  }, [session, fetchBookmarks]);

  const saveBookmark = async (title: string, url: string, id?: string): Promise<boolean> => {
    if (!session || !title || !url) return false;

    if (id) {
      const { error } = await supabase
        .from("bookmarks")
        .update({ title, url })
        .eq("id", id);

      if (error) {
        console.error("Update error:", error);
        return false;
      }
    } else {
      const { error } = await supabase.from("bookmarks").insert([
        {
          title,
          url,
          user_id: session.user.id,
        },
      ]);

      if (error) {
        console.error("Insert Error:", error);
        return false;
      }
    }
    return true;
  };

  const deleteBookmark = async (id: string): Promise<boolean> => {
    // Optimistic update
    setBookmarks((prev) => prev.filter((b) => b.id !== id));

    const { error } = await supabase
      .from("bookmarks")
      .delete()
      .eq("id", id);

    if (error) {
      console.error("Delete error:", error);
      fetchBookmarks(); // rollback on error
      return false;
    }
    return true;
  };

  return { bookmarks, loading, saveBookmark, deleteBookmark, fetchBookmarks };
}
