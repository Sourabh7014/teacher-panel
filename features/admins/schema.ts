import { z } from "zod";

export const createFormSchema = z.object({
  first_name: z.string({ message: "Please enter first name" }),
  last_name: z.string().optional(),
  email: z.string({ message: "Please enter email" }).email({
    message: "Please enter a valid email address.",
  }),
  country_code: z.number().optional(),
  mobile: z.string().optional(),
  username: z.string({ message: "Please enter username" }).min(5, {
    message: "Username must be at least 5 characters.",
  }),
  password: z.string({ message: "Please enter password" }).min(8, {
    message: "Password must be at least 8 characters.",
  }),
  send_password: z.boolean(),
});

export const editFormSchema = z.object({
  first_name: z.string({ message: "Please enter first name" }),
  last_name: z.string().optional(),
  email: z.string({ message: "Please enter email" }).email({
    message: "Please enter a valid email address.",
  }),
  country_code: z.number().optional(),
  mobile: z.string().optional(),
  username: z.string().optional(),
});

export type CreateAdminValues = z.infer<typeof createFormSchema>;
export type EditAdminValues = z.infer<typeof editFormSchema>;
