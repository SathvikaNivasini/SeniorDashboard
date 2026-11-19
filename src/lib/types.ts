export type Announcement = {
  id: string;
  title: string;
  body: string;
  is_pinned: boolean;
  created_at: string;
  updated_at: string;
};

export type HubEvent = {
  id: string;
  title: string;
  subtitle: string | null;
  event_date: string;
  location: string | null;
  created_at: string;
  updated_at: string;
};

export type Deadline = {
  id: string;
  title: string;
  due_date: string;
  detail: string | null;
  created_at: string;
  updated_at: string;
};

export type InfoItem = {
  id: string;
  title: string;
  body: string;
  category: string;
  sort_order: number;
  created_at: string;
  updated_at: string;
};

export type Resource = {
  id: string;
  title: string;
  description: string;
  url: string | null;
  file_path: string | null;
  icon: string;
  sort_order: number;
  created_at: string;
  updated_at: string;
};

export type TableName =
  | "announcements"
  | "events"
  | "deadlines"
  | "info_items"
  | "resources";
