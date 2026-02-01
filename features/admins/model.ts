export interface AdminUser {
  id: string;
  first_name: string;
  last_name: string;
  username: string;
  email: string;
  country_code: number;
  mobile: string | null;
  role: string;
  status: string;
  avatar: string | null;
  last_activity_at: number;
  email_verified_at: number | null;
  mobile_verified_at: number | null;
  created_at: number;
}
