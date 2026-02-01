"use client";

import { zodResolver } from "@hookform/resolvers/zod";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import authService from "../api.service";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { Loader2 } from "lucide-react";
import { cookieService } from "@/lib/cookie";
import { ResetPasswordSchema } from "../schema";
import { z } from "zod";

type ResetPasswordFormValues = z.infer<typeof ResetPasswordSchema>;

export function ResetPasswordForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  // get email from url
  const searchParams = useSearchParams();
  const email = searchParams.get("email") || "";

  const maskedEmail = email ? email.replace(/(.{3})(.*)(@.*)/, "$1•••$3") : "";

  const form = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(ResetPasswordSchema),
    defaultValues: {
      email: email || "",
      otp: "",
      password: "",
      password_confirmation: "",
    },
  });

  const onSubmit = (values: ResetPasswordFormValues) => {
    setLoading(true);
    authService
      .resetPassword(values)
      .then((response: any) => {
        cookieService.setCookie("user", JSON.stringify(response?.admin));

        const redirect = cookieService.getCookie("redirect");
        if (redirect) {
          cookieService.deleteCookie("redirect");
          router.push(redirect);
        } else {
          router.push("/dashboard");
        }
      })
      .finally(() => {
        setLoading(false);
      });
  };
  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="shadow-lg">
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Reset Password</CardTitle>
          <CardDescription>
            Reset password for{""}{" "}
            <span className="font-medium text-white">{maskedEmail}</span>
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-6">
              <div className="grid gap-3">
                <FormField
                  control={form.control}
                  name="otp"
                  render={({ field }) => (
                    <FormItem className="flex flex-col items-center py-4">
                      <FormLabel className="text-white mb-2">
                        Verification Code
                      </FormLabel>
                      <FormControl>
                        <InputOTP maxLength={6} {...field}>
                          <InputOTPGroup>
                            <InputOTPSlot
                              className="max-w-14 min-w-10 h-14"
                              index={0}
                            />
                            <InputOTPSlot
                              className="max-w-14 min-w-10 h-14"
                              index={1}
                            />
                            <InputOTPSlot
                              className="max-w-14 min-w-10 h-14"
                              index={2}
                            />
                            <InputOTPSlot
                              className="max-w-14 min-w-10 h-14"
                              index={3}
                            />
                            <InputOTPSlot
                              className="max-w-14 min-w-10 h-14"
                              index={4}
                            />
                            <InputOTPSlot
                              className="max-w-14 min-w-10 h-14"
                              index={5}
                            />
                          </InputOTPGroup>
                        </InputOTP>
                      </FormControl>
                      <FormDescription className="text-zinc-400 text-sm mt-2">
                        Enter the verification code sent to your email
                      </FormDescription>
                      <FormMessage className="text-red-500" />
                    </FormItem>
                  )}
                />
              </div>
              <div className="grid gap-3">
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-white mb-2">
                        Password
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Password"
                          type="password"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="grid gap-3">
                <FormField
                  control={form.control}
                  name="password_confirmation"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-white mb-2">
                        Password Confirmation
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Password Confirmation"
                          type="password"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : null}
                Submit
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
