import { User } from "@/features/users/model";
import { Otp } from "@/features/otps/model";
import { OperationHour, Vendor } from "@/features/vendors/model";
import { Amenity } from "@/features/amenities/model";
import { City, State, Country } from "@/features/locations/model";
import { Article, ArticleCategory } from "@/features/articles/model";
import { FeedbackCategory, Feedback } from "@/features/feedbacks/model";
import { Post } from "@/features/posts/model";
import { Review } from "@/features/reviews/model";
import { Voucher } from "@/features/vouchers/model";
export interface Data {
  user?: any;
  users?: User[];
  otps?: Otp[];
  meta?: Meta;
  vendors?: Vendor[];
  posts?: Post[];
  vendor?: Vendor;
  cities?: City[];
  states?: State[];
  countries?: Country[];
  amenities?: Amenity[];
  category?: FeedbackCategory | ArticleCategory;
  categories?: FeedbackCategory[] | ArticleCategory[];
  operation_hours?: OperationHour[];
  article?: Article;
  articles?: Article[];
  article_category?: ArticleCategory;
  article_categories?: ArticleCategory[];
  reports?: any[];
  feedbacks?: Feedback[];
  reviews?: Review[];
  vouchers?: Voucher[];
}

export interface Meta {
  total_pages: number;
  total_items: number;
  current_page: number;
  per_page: number;
}
