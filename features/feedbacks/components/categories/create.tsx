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
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useState } from "react";
import { FeedbackCategory } from "../../model";
import {
  CreateCategoryValues,
  createCategorySchema,
  EditCategoryValues,
  editCategorySchema,
} from "../../schema";
import feedbackService from "../../api.service";

export default function CreateCategory({
  category,
  onConfirm,
}: {
  category?: FeedbackCategory;
  onConfirm: (data: FeedbackCategory | null) => void;
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
          order: category?.order,
        }
      : {
          name: "",
          order: 0,
        },
  });

  async function onSubmit(values: CreateCategoryValues | EditCategoryValues) {
    try {
      setLoading(true);
      const response = await feedbackService.saveCategory(values, category?.id);
      console.log(response);
      if (response?.category) {
        onConfirm(response.category as FeedbackCategory);
      }
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
                name="order"
                render={({ field: { onChange, ...restField } }) => (
                  <FormItem>
                    <FormLabel>Order</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="10"
                        {...restField}
                        onChange={(e) => {
                          const value = e.target.value;
                          // Convert the string input to a number
                          onChange(value === "" ? "" : Number(value));
                        }}
                      />
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
              : "Create Admin"}
          </Button>
        </DialogFooter>
      </form>
    </Form>
  );
}
