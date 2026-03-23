"use client";

import { Card } from "./ui/Card";
import { BookmarkEditor } from "./BookmarkEditor";

interface BookmarkFormProps {
  onAdd: (title: string, url: string) => Promise<boolean>;
}

export function BookmarkForm({ onAdd }: BookmarkFormProps) {
  return (
    <Card title="Add New Bookmark">
      <BookmarkEditor
        onSave={onAdd}
        submitLabel="Add Bookmark"
      />
    </Card>
  );
}
