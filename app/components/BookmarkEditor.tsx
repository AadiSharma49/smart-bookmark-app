"use client";

import { useState } from "react";
import { Input } from "./ui/Input";
import { Button } from "./ui/Button";

interface BookmarkEditorProps {
  initialTitle?: string;
  initialUrl?: string;
  onSave: (title: string, url: string) => Promise<boolean>;
  onCancel?: () => void;
  submitLabel: string;
}

export function BookmarkEditor({
  initialTitle = "",
  initialUrl = "",
  onSave,
  onCancel,
  submitLabel,
}: BookmarkEditorProps) {
  const [title, setTitle] = useState(initialTitle);
  const [url, setUrl] = useState(initialUrl);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !url.trim()) return;

    const success = await onSave(title, url);
    if (success && !initialTitle) {
      setTitle("");
      setUrl("");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        type="text"
        placeholder="Bookmark Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />

      <Input
        type="url"
        placeholder="https://example.com"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
      />

      <div className="flex gap-2">
        <Button
          type="submit"
          variant="primary"
          fullWidth={!onCancel}
          className={onCancel ? "text-sm px-3 py-1" : ""}
        >
          {submitLabel}
        </Button>
        {onCancel && (
          <Button
            type="button"
            onClick={onCancel}
            variant="secondary"
            className="text-sm px-3 py-1"
          >
            Cancel
          </Button>
        )}
      </div>
    </form>
  );
}
