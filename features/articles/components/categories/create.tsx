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
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useState, useEffect } from "react";
import { ArticleCategory } from "../../model";
import {
  CreateCategoryValues,
  createCategorySchema,
  EditCategoryValues,
  editCategorySchema,
} from "../../schema";
import articleService from "../../api.service";
import { slugify } from "@/lib/utils";
import { Textarea } from "@/components/ui/textarea";

export default function CreateCategory({
  category,
  onConfirm,
}: {
  category?: ArticleCategory;
  onConfirm: (data: ArticleCategory | null) => void;
}) {
  const [loading, setLoading] = useState(false);
  const isEditMode = !!category;

  const form = useForm<CreateCategoryValues | EditCategoryValues>({
    resolver: zodResolver(
      (isEditMode ? editCategorySchema : createCategorySchema) as any
    ),
    defaultValues: isEditMode
      ? {
          name: category?.name,
          slug: category?.slug,
          description: category?.description ?? "",
        }
      : {
          name: "",
          slug: "",
          description: "",
        },
  });

  // Auto-generate slug from name (only in create mode)
  useEffect(() => {
    if (!isEditMode) {
      const subscription = form.watch((value, { name: fieldName }) => {
        if (fieldName === "name" && value.name) {
          const slug = slugify(value.name);
          form.setValue("slug", slug, { shouldValidate: true });
        }
      });
      return () => subscription.unsubscribe();
    }
  }, [form, isEditMode]);

  async function onSubmit(values: CreateCategoryValues | EditCategoryValues) {
    try {
      setLoading(true);
      // Remove any id field to prevent UUID validation errors
      const { id, ...cleanValues } = values as any;
      console.log("Submitting category data:", cleanValues);
      const response = await articleService.saveCategory(
        cleanValues,
        category?.id
      );
      if ((response as any)?.category) {
        onConfirm((response as any).category as ArticleCategory);
      } else {
        onConfirm(null);
      }
    } catch (error) {
      console.error("Error saving category:", error);
      onConfirm(null);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Form {...(form as any)}>
      <form
        onSubmit={(e) => form.handleSubmit(onSubmit as any)(e)}
        className="space-y-6 flex flex-col max-h-[calc(100vh-100px)]"
      >
        <DialogHeader>
          <DialogTitle>
            {isEditMode ? "Edit Category" : "Create Category"}
          </DialogTitle>
          <DialogDescription>
            {isEditMode
              ? "Update the details for this category."
              : "Fill in the details below to create a new category."}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 flex-1 overflow-hidden">
          <ScrollArea className="h-full">
            <div className="space-y-4 px-1 pb-1">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Category name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="slug"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Slug</FormLabel>
                    <FormControl>
                      <Input placeholder="category-slug" {...field} />
                    </FormControl>
                    <FormDescription className="text-xs">
                      {isEditMode
                        ? "Slug for the category"
                        : "Auto-generated from name, but you can edit it"}
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea rows={4} {...field} value={field.value || ""} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
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
              : "Create"}
          </Button>
        </DialogFooter>
      </form>
    </Form>
  );
}
