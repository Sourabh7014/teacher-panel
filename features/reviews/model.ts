import { User } from "../users/model";
import { Vendor } from "../vendors/model";

export interface Review {
  id: string;
  user: User;
  vendor: Vendor;
  rating: number;
  comment: string;
  hidden: boolean;
  created_at: number;
}
