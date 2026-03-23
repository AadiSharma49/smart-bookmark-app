"use client";

import { Bookmark } from "../types";
import { BookmarkItem } from "./BookmarkItem";
import { Card } from "./ui/Card";

interface BookmarkListProps {
  bookmarks: Bookmark[];
  onDelete: (id: string) => Promise<boolean>;
  onUpdate: (title: string, url: string, id?: string) => Promise<boolean>;
}

export function BookmarkList({ bookmarks, onDelete, onUpdate }: BookmarkListProps) {
  return (
    <Card title="Your Bookmarks">
      {bookmarks.length === 0 ? (
        <p className="text-gray-400">No bookmarks yet.</p>
      ) : (
        <div className="space-y-3">
          {bookmarks.map((bookmark) => (
            <BookmarkItem
              key={bookmark.id}
              bookmark={bookmark}
              onDelete={onDelete}
              onUpdate={onUpdate}
            />
          ))}
        </div>
      )}
    </Card>
  );
}
