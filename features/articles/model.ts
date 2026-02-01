import { User } from "../users/model";

export interface Tag {
  id: string;
  name: string;
  slug: string;
}

export interface ArticleCategory {
  id: string;
  name: string;
  slug: string;
  description: string;
  created_at: number;
}

export interface Article {
  id: string;
  title: string;
  slug: string;
  description: string;
  banner: string;
  meta_title: string;
  meta_description: string;
  meta_keywords: string;
  content: any;
  content_html: string;
  status: "DRAFT" | "PUBLISHED" | "ARCHIVED";
  category: ArticleCategory;
  user: User;
  tags: Tag[];
  created_at: number;
  updated_at: number;
}
