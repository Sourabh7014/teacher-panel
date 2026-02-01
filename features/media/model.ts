export interface Otp {
  id: string;
  receiver: string;
  event: string;
  token: string;
  token_used_at: number;
  expired_at: number;
  used_at: number;
  created_at: number;
}
