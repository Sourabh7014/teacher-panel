"use client";

import { Button } from "@/components/ui/button";
import {
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import type { AdminUser } from "../model";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useState } from "react";
import adminService from "../api.service";
import {
  CreateAdminValues,
  createFormSchema,
  EditAdminValues,
  editFormSchema,
} from "../schema";

const countryCodes = [
  { label: "+1 (Canada/US)", value: 1 },
  { label: "+44 (UK)", value: 44 },
  { label: "+91 (IN)", value: 91 },
];

export default function CreateUser({
  admin,
  onConfirm,
}: {
  admin?: AdminUser;
  onConfirm: (data: CreateAdminValues | EditAdminValues | null) => void;
}) {
  const [loading, setLoading] = useState(false);
  const isEditMode = !!admin;

  const form = useForm<CreateAdminValues | EditAdminValues>({
    resolver: zodResolver(isEditMode ? editFormSchema : createFormSchema),
    defaultValues: isEditMode
      ? {
          first_name: admin?.first_name ?? "",
          last_name: admin?.last_name ?? "",
          email: admin?.email ?? "",
          country_code: admin?.country_code ?? 1,
          mobile: admin?.mobile ?? "",
          username: admin?.username ?? "",
        }
      : {
          first_name: "",
          last_name: "",
          email: "",
          country_code: 1,
          mobile: "",
          username: "",
          password: "",
          send_password: true,
        },
  });

  async function onSubmit(values: CreateAdminValues | EditAdminValues) {
    try {
      setLoading(true);
      const response = await adminService.save(values, admin?.id);
      console.log(response);
      if (response?.user) {
        onConfirm(response.user);
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <Form {...(form as any)}>
      <form
        onSubmit={(e) => form.handleSubmit(onSubmit)(e)}
        className="space-y-6 flex flex-col max-h-[calc(100vh-100px)]"
      >
        <DialogHeader>
          <DialogTitle>
            {isEditMode ? "Edit Admin" : "Create Admin"}
          </DialogTitle>
          <DialogDescription>
            {isEditMode
              ? "Update the details for this admin user."
              : "Fill in the details below to create a new admin user."}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 flex-1 overflow-hidden">
          <ScrollArea className="h-full">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <FormField
                control={form.control}
                name="first_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>First Name</FormLabel>
                    <FormControl>
                      <Input placeholder="John" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="last_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Last Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Doe" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="md:col-span-2">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input placeholder="john.doe@example.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="md:col-span-2">
                <FormLabel>Mobile</FormLabel>
                <div className="mt-2 flex items-start gap-2">
                  <FormField
                    control={form.control}
                    name="country_code"
                    render={({ field }) => (
                      <FormItem className="w-1/3">
                        <Select
                          onValueChange={(value) =>
                            field.onChange(parseInt(value, 10))
                          }
                          defaultValue={field.value?.toString() || "1"}
                        >
                          <FormControl>
                            <SelectTrigger className="w-full truncate">
                              <SelectValue placeholder="Code" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {countryCodes.map((country) => (
                              <SelectItem
                                key={country.value}
                                value={country.value.toString()}
                              >
                                {country.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="mobile"
                    render={({ field }) => (
                      <FormItem className="flex-1">
                        <FormControl>
                          <Input placeholder="1234567890" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              <div
                className={`${isEditMode ? "md:col-span-2" : ""} grid gap-4`}
              >
                <FormField
                  control={form.control}
                  name="username"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Username</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="johndoe"
                          {...field}
                          readOnly={isEditMode}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {!isEditMode && (
                <>
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Password</FormLabel>
                        <FormControl>
                          <Input
                            type="password"
                            placeholder="••••••••"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="md:col-span-2 grid gap-4">
                    <FormField
                      control={form.control}
                      name="send_password"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                          <div className="space-y-0.5">
                            <FormLabel className="text-base">
                              Send password via email
                            </FormLabel>
                            <FormDescription>
                              Send the password to the user&apos;s email address
                            </FormDescription>
                          </div>
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </div>
                </>
              )}
            </div>
          </ScrollArea>
        </div>

        <DialogFooter className="mt-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => onConfirm(null)}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            className="btn-primary-gradient"
            disabled={loading}
          >
            {loading
              ? isEditMode
                ? "Saving..."
                : "Creating..."
              : isEditMode
              ? "Save Changes"
              : "Create Admin"}
          </Button>
        </DialogFooter>
      </form>
    </Form>
  );
}
