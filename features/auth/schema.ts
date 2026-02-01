import { z } from "zod";

export const LoginSchema = z.object({
  email: z.string().email({
    message: "Please enter valid email",
  }),
  password: z.string().min(8, {
    message: "Please enter valid password",
  }),
});

export const ForgotPasswordSchema = z.object({
  email: z.string().email({
    message: "Please enter valid email",
  }),
});

export const ResetPasswordSchema = z.object({
  email: z.string().email({
    message: "Please enter valid email",
  }),
  otp: z.string().min(6, {
    message: "Please enter valid otp",
  }),
  password: z.string().min(8, {
    message: "Password must be at least 8 characters.",
  }),
  password_confirmation: z.string().min(8, {
    message: "Password must be at least 8 characters.",
  }),
});
