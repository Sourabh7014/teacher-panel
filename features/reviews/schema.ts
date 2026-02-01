import { z } from "zod";

export const reviewSchema = z.object({
  id: z.string().optional(),
  user_id: z.string().min(1, "User is required"),
  vendor_id: z.string().min(1, "Vendor is required"),
  rating: z.number().min(1).max(5),
  comment: z.string().optional(),
  created_at: z.number().optional(),
});

export type ReviewSchema = z.infer<typeof reviewSchema>;
