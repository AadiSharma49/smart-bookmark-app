export interface BookmarkData {
  title: string;
  url: string;
}

export interface Bookmark extends BookmarkData {
  id: string;
  created_at: string;
  user_id: string;
}

export interface BookmarkOperations {
  onAdd: (data: BookmarkData) => Promise<boolean>;
  onDelete: (id: string) => Promise<boolean>;
  onUpdate: (id: string, data: BookmarkData) => Promise<boolean>;
}

export interface AuthOperations {
  onLogin: () => Promise<void>;
  onLogout: () => Promise<void>;
}
