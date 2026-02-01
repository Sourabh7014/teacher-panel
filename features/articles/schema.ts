import { z } from "zod";

export const createArticleSchema = z.object({
  title: z.string().min(1, { message: "Please enter title" }),
  slug: z.string().min(1, { message: "Please enter slug" }),

  category_id: z.string().min(1, { message: "Please select category" }),
  description: z.string().optional().nullable(),

  content: z.array(z.any()).min(1, { message: "Please enter content" }),
  content_html: z.string().optional().nullable(),
  banner: z.string().min(1, { message: "Please upload banner" }),

  meta_title: z.string().optional().nullable(),
  meta_description: z.string().optional().nullable(),
  meta_keywords: z.string().optional().nullable(),

  tags: z.array(z.string()),

  status: z.enum(["DRAFT", "PUBLISHED", "ARCHIVED"]).default("DRAFT"),
});

export const editArticleSchema = createArticleSchema;

export type CreateArticleValues = z.infer<typeof createArticleSchema>;
export type EditArticleValues = z.infer<typeof editArticleSchema>;

export const createCategorySchema = z.object({
  name: z.string({ message: "Please enter name" }).min(1),
  slug: z.string({ message: "Please enter slug" }).min(1),
  description: z.string().optional().nullable(),
});

export const editCategorySchema = z.object({
  name: z.string({ message: "Please enter name" }).min(1),
  slug: z.string({ message: "Please enter slug" }).min(1),
  description: z.string().optional().nullable(),
});

export type CreateCategoryValues = z.infer<typeof createCategorySchema>;
export type EditCategoryValues = z.infer<typeof editCategorySchema>;
