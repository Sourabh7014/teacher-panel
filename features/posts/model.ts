export interface Post {
  id: string;
  user: {
    id: string;
    first_name: string;
    last_name: string;
    username: string;
    email: string;
    avatar: string | null;
  };
  vendor: {
    id: string;
    name: string;
    mobile: string;
  };
  type: string;
  media?: string;
  description: string;
  hidden: boolean;
  created_at: number;
}
