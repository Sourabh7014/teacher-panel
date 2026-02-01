export interface ReportCategory {
  id: string;
  name: string;
  order: number;
  created_at: number;
}

export interface ReportUser {
  id: string;
  first_name?: string;
  last_name?: string;
  username?: string;
  email?: string;
  avatar?: string;
}

export interface Report {
  id: string;
  user: {
    id: string;
    first_name: string;
    last_name: string;
    email: string;
    avatar: string;
  };
  category: string | ReportCategory;
  post: {
    id: string;
    description: string;
    media: any;
  } | null;
  description: string;
  acknowledged: boolean;
  acknowledged_at: number | null;
  acknowledged_user: {
    id: string;
    first_name: string;
    last_name: string;
    email: string;
  } | null;
  created_at: number;
}
