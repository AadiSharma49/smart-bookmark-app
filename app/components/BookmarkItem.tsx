"use client";

import { useState } from "react";
import { Bookmark } from "../types";
import { Button } from "./ui/Button";
import { BookmarkEditor } from "./BookmarkEditor";

interface BookmarkItemProps {
  bookmark: Bookmark;
  onDelete: (id: string) => Promise<boolean>;
  onUpdate: (title: string, url: string, id?: string) => Promise<boolean>;
}

export function BookmarkItem({ bookmark, onDelete, onUpdate }: BookmarkItemProps) {
  const [isEditing, setIsEditing] = useState(false);

  const handleSave = async (title: string, url: string) => {
    const success = await onUpdate(title, url, bookmark.id);
    if (success) {
      setIsEditing(false);
    }
    return success;
  };

  if (isEditing) {
    return (
      <div className="bg-gray-900 p-4 rounded-lg">
        <BookmarkEditor
          initialTitle={bookmark.title}
          initialUrl={bookmark.url}
          onSave={handleSave}
          onCancel={() => setIsEditing(false)}
          submitLabel="Save"
        />
      </div>
    );
  }

  return (
    <div className="bg-gray-900 p-4 rounded-lg flex justify-between items-center group">
      <div>
        <p className="text-white font-medium">
          {bookmark.title}
        </p>
        <a
          href={bookmark.url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-400 text-sm hover:underline"
        >
          {bookmark.url}
        </a>
      </div>

      <div className="flex gap-2">
        <Button
          onClick={() => setIsEditing(true)}
          variant="accent"
          className="text-sm px-3 py-1 opacity-0 group-hover:opacity-100"
        >
          Edit
        </Button>
        <Button
          onClick={() => onDelete(bookmark.id)}
          variant="danger"
          className="text-sm px-3 py-1 opacity-0 group-hover:opacity-100"
        >
          Delete
        </Button>
      </div>
    </div>
  );
}
