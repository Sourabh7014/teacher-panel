export interface FeedbackCategory {
  id: string;
  name: string;
  order: number;
  created_at: number;
}

export interface Feedback {
  id: string;
  user: {
    id: string;
    first_name: string;
    last_name: string;
    email: string;
  };
  category: {
    id: string;
    name: string;
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
