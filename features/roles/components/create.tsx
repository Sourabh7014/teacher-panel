"use client";

import * as React from "react";

import { Button } from "@/components/ui/button";
import {
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
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
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useWatch } from "react-hook-form";
import { z } from "zod";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { permissions } from "../data";
import type { Role } from "../data";

const formSchema = z.object({
  name: z
    .string()
    .min(2, {
      message: "Name must be at least 2 characters.",
    })
    .regex(/^[a-z0-9-]+$/, {
      message: "Name can only contain lowercase letters, numbers, and hyphens.",
    }),
  displayName: z.string().min(2, {
    message: "Display name must be at least 2 characters.",
  }),
  description: z.string().optional(),
  permissions: z
    .array(z.string())
    .refine((value) => value.some((item) => item), {
      message: "You have to select at least one permission.",
    }),
});

export type CreateRoleValues = z.infer<typeof formSchema>;

export default function RoleCreate({
  role,
  onConfirm,
}: {
  role?: Role;
  onConfirm: (data: CreateRoleValues | null) => void;
}) {
  const isEditMode = !!role;

  const form = useForm<CreateRoleValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: role?.id ?? "",
      displayName: role?.name ?? "",
      description: role?.description ?? "",
      permissions: role?.permissions ?? [],
    },
  });

  const { isSubmitting } = form.formState;

  const watchedPermissions = useWatch({
    control: form.control,
    name: "permissions",
  });

  async function onSubmit(values: CreateRoleValues) {
    // TODO: Implement API call to create role
    console.log("Creating role with values:", values);
    await new Promise((resolve) => setTimeout(resolve, 2000));
    onConfirm(values);
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-6 flex flex-col max-h-[calc(100vh-100px)]"
      >
        <DialogHeader className="flex-shrink-0">
          <DialogTitle>{isEditMode ? "Edit Role" : "Create Role"}</DialogTitle>
          <DialogDescription>
            {isEditMode
              ? "Update the details for this role."
              : "Fill in the details below to create a new role."}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 flex-1 overflow-hidden">
          <ScrollArea className="h-full">
            <div className="px-2">
              <div className="grid gap-4 sm:grid-cols-2 items-start">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name (slug)</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="e.g. content-editor"
                          {...field}
                          disabled={isEditMode}
                        />
                      </FormControl>
                      <FormDescription>
                        A unique identifier for the role.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="displayName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Display Name</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g. Content Editor" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              {/* <Card className="border-none shadow-none">
                <CardHeader className="px-1">
                  <CardTitle>Permissions</CardTitle>
                  <FormDescription>
                    Select the permissions for this role.
                  </FormDescription>
                </CardHeader>
                <CardContent className="space-y-6 px-1">
                  {permissions.map((group) => {
                    const groupPermissionIds = group.permissions.map(
                      (p) => p.id
                    );
                    const areAllSelected = groupPermissionIds.every((id) =>
                      watchedPermissions.includes(id)
                    );

                    const handleSelectAll = (checked: boolean) => {
                      const currentPermissions = form.getValues("permissions");
                      const newPermissions = checked
                        ? [
                            ...new Set([
                              ...currentPermissions,
                              ...groupPermissionIds,
                            ]),
                          ]
                        : currentPermissions.filter(
                            (p) => !groupPermissionIds.includes(p)
                          );
                      form.setValue("permissions", newPermissions, {
                        shouldDirty: true,
                      });
                    };

                    return (
                      <Card key={group.id}>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                          <CardTitle className="text-base font-medium">
                            {group.name}
                          </CardTitle>
                          <div className="flex items-center space-x-2">
                            <Switch
                              checked={areAllSelected}
                              onCheckedChange={handleSelectAll}
                              aria-label={`Select all ${group.name} permissions`}
                            />
                            <FormLabel className="text-sm font-normal">
                              Select All
                            </FormLabel>
                          </div>
                        </CardHeader>
                        <CardContent className="pt-4">
                          <div className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
                            {group.permissions.map((permission) => (
                              <FormField
                                key={permission.id}
                                control={form.control}
                                name="permissions"
                                render={({ field }) => (
                                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                                    <div className="space-y-0.5">
                                      <FormLabel>{permission.name}</FormLabel>
                                      <FormDescription>
                                        {permission.description}
                                      </FormDescription>
                                    </div>
                                    <FormControl>
                                      <Switch
                                        checked={field.value?.includes(
                                          permission.id
                                        )}
                                        onCheckedChange={(checked) => {
                                          return checked
                                            ? field.onChange([
                                                ...field.value,
                                                permission.id,
                                              ])
                                            : field.onChange(
                                                field.value?.filter(
                                                  (value) =>
                                                    value !== permission.id
                                                )
                                              );
                                        }}
                                      />
                                    </FormControl>
                                  </FormItem>
                                )}
                              />
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                  <FormMessage>
                    {form.formState.errors.permissions?.message}
                  </FormMessage>
                </CardContent>
              </Card> */}
              <div className="space-y-4 border-t pt-3 mt-3">
                {/* Select All */}
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="font-medium">Permissions</h2>
                    <p className="text-sm text-muted-foreground">
                      Select the permissions for this role.
                    </p>
                  </div>
                  {/* <div className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground">
                      Select All
                    </span>
                    <Switch
                      className="cursor-pointer"
                      aria-label={`Select all Permissions`}
                    />
                  </div> */}
                </div>

                <div className="space-y-3">
                  {permissions.map((group) => {
                    const groupPermissionIds = group.permissions.map(
                      (p) => p.id
                    );
                    const areAllSelected = groupPermissionIds.every((id) =>
                      watchedPermissions.includes(id)
                    );

                    const handleSelectAll = (checked: boolean) => {
                      const currentPermissions = form.getValues("permissions");
                      const newPermissions = checked
                        ? [
                            ...new Set([
                              ...currentPermissions,
                              ...groupPermissionIds,
                            ]),
                          ]
                        : currentPermissions.filter(
                            (p) => !groupPermissionIds.includes(p)
                          );
                      form.setValue("permissions", newPermissions, {
                        shouldDirty: true,
                      });
                    };

                    return (
                      <Card
                        key={group.id}
                        className="overflow-hidden p-0 gap-0"
                      >
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 py-3 px-4 bg-muted/50">
                          <CardTitle className="text-sm font-medium">
                            {group.name}
                          </CardTitle>
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-muted-foreground">
                              Select All
                            </span>
                            <Switch
                              className="cursor-pointer"
                              checked={areAllSelected}
                              onCheckedChange={handleSelectAll}
                              aria-label={`Select all ${group.name} permissions`}
                            />
                          </div>
                        </CardHeader>
                        <CardContent className="p-3">
                          <div className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
                            {group.permissions.map((permission) => (
                              <FormField
                                key={permission.id}
                                control={form.control}
                                name="permissions"
                                render={({ field }) => (
                                  <FormItem className="flex flex-row items-center justify-between space-y-0 rounded-md border bg-card p-2.5 hover:bg-accent/50 transition-colors">
                                    {/* I want to add click event to switch on all box */}
                                    <div className="flex-1 space-y-0">
                                      <FormLabel className="text-sm font-medium cursor-pointer">
                                        {permission.name}
                                      </FormLabel>
                                      <FormDescription className="text-xs">
                                        {permission.description}
                                      </FormDescription>
                                    </div>
                                    <FormControl>
                                      <Switch
                                        className="cursor-pointer"
                                        checked={field.value?.includes(
                                          permission.id
                                        )}
                                        onCheckedChange={(checked) => {
                                          const currentValue = Array.isArray(
                                            field.value
                                          )
                                            ? field.value
                                            : [];
                                          return checked
                                            ? field.onChange([
                                                ...currentValue,
                                                permission.id,
                                              ])
                                            : field.onChange(
                                                currentValue.filter(
                                                  (value) =>
                                                    value !== permission.id
                                                )
                                              );
                                        }}
                                      />
                                    </FormControl>
                                  </FormItem>
                                )}
                              />
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>

                {form.formState.errors.permissions && (
                  <p className="text-sm font-medium text-destructive">
                    {form.formState.errors.permissions.message}
                  </p>
                )}
              </div>
            </div>
          </ScrollArea>
        </div>

        <DialogFooter className="mt-2 pt-4 border-t flex-shrink-0">
          <Button
            type="button"
            variant="outline"
            onClick={() => onConfirm(null)}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting
              ? isEditMode
                ? "Saving..."
                : "Creating..."
              : isEditMode
              ? "Save Changes"
              : "Create Role"}
          </Button>
        </DialogFooter>
      </form>
    </Form>
  );
}
