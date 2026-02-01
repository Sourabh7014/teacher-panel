import { z } from "zod";

export const createCategorySchema = z.object({
  name: z.string({ message: "Please enter first name" }),
  order: z.number().optional(),
});

export const editCategorySchema = z.object({
  name: z.string({ message: "Please enter first name" }),
  order: z.number().optional(),
});

export type CreateCategoryValues = z.infer<typeof createCategorySchema>;
export type EditCategoryValues = z.infer<typeof editCategorySchema>;
