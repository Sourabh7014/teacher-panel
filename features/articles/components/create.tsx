"use client";

import { useState, useEffect, useCallback } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";

import {
  CreateArticleValues,
  EditArticleValues,
  createArticleSchema,
  editArticleSchema,
} from "../schema";
import articleService from "../api.service";
import { ArticleCategory } from "../model";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormField,
  FormControl,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";

import { EditorField } from "@/components/editor/plate-editor";
import MediaUpload from "@/features/media/components/upload";
import { slugify } from "@/lib/utils";

import { Loader2, Save, X } from "lucide-react";

export default function CreateArticle({ id }: { id?: string }) {
  const [loading, setLoading] = useState(false);
  const [articleLoading, setArticleLoading] = useState(Boolean(id));
  const [categoryLoading, setCategoryLoading] = useState(true);

  const [categories, setCategories] = useState<ArticleCategory[]>([]);
  const [tagInput, setTagInput] = useState("");

  const isEditMode = !!id;
  const router = useRouter();

  const form = useForm<CreateArticleValues | EditArticleValues>({
    resolver: zodResolver(
      isEditMode ? editArticleSchema : createArticleSchema
    ) as any,
    defaultValues: {
      title: "",
      slug: "",
      description: "",
      banner: "",
      content: [],
      content_html: "",
      meta_title: "",
      meta_description: "",
      meta_keywords: "",
      status: "DRAFT",
      category_id: "",
      tags: [],
    },
  });

  const { setValue, watch } = form;
  const tags = watch("tags") || [];

  /* ------------------------------ Fetch Category ------------------------------ */
  useEffect(() => {
    async function loadCategories() {
      try {
        setCategoryLoading(true);
        const res = await articleService.categories({ per_page: 100 });
        setCategories((res?.categories as ArticleCategory[]) ?? []);
      } finally {
        setCategoryLoading(false);
      }
    }
    loadCategories();
  }, []);

  /* ------------------------------ Fetch Article ------------------------------- */
  useEffect(() => {
    if (!id) return;

    async function loadArticle() {
      try {
        setArticleLoading(true);
        const response = await articleService.view(id as string);

        if (response?.article) {
          const a = response.article;

          form.reset({
            title: a.title,
            slug: a.slug,
            content: a.content,
            content_html: a.content_html,
            description: a.description,
            banner: a.banner,
            meta_title: a.meta_title,
            meta_description: a.meta_description,
            meta_keywords: a.meta_keywords,
            status: a.status,
            category_id: a.category.id,
            tags: a.tags.map((t) => t.name),
          });
        }
      } finally {
        setArticleLoading(false);
      }
    }

    loadArticle();
  }, [id, form]);

  /* ----------------------------- Auto Slugify ----------------------------- */
  useEffect(() => {
    if (!isEditMode) {
      const subscription = form.watch((v, { name }) => {
        if (name === "title" && v.title) {
          setValue("slug", slugify(v.title), { shouldValidate: true });
        }
      });
      return () => subscription.unsubscribe();
    }
  }, [isEditMode, form, setValue]);

  /* ----------------------------- Tag Add/Remove ----------------------------- */
  const addTag = useCallback(() => {
    const newTag = tagInput.trim();
    if (newTag && !tags.includes(newTag)) {
      setValue("tags", [...tags, newTag], { shouldValidate: true });
      setTagInput("");
    }
  }, [tagInput, tags, setValue]);

  const removeTag = (tagToRemove: string) => {
    setValue(
      "tags",
      tags.filter((t) => t !== tagToRemove),
      { shouldValidate: true }
    );
  };

  /* ------------------------------- Submit Actions ------------------------------- */
  const handleSubmit = async (values: any, status: "DRAFT" | "PUBLISHED") => {
    try {
      setLoading(true);
      const payload = { ...values, status };

      const res = isEditMode
        ? await articleService.update(id!, payload)
        : await articleService.create(payload);

      if (res?.article) router.push("/blogs/articles");
    } finally {
      setLoading(false);
    }
  };

  const onPublish = (values: any) => handleSubmit(values, "PUBLISHED");
  const onSaveDraft = (values: any) => handleSubmit(values, "DRAFT");

  /* -------------------------- Loading Skeleton UI -------------------------- */
  if (articleLoading || categoryLoading) {
    return (
      <div className="max-w-7xl mx-auto py-10 animate-pulse space-y-6">
        <div className="h-10 w-64 bg-muted rounded" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="h-40 bg-muted rounded" />
            <div className="h-40 bg-muted rounded" />
            <div className="h-80 bg-muted rounded" />
          </div>
          <div className="space-y-6">
            <div className="h-40 bg-muted rounded" />
            <div className="h-40 bg-muted rounded" />
          </div>
        </div>
      </div>
    );
  }

  /* ------------------------------- Main UI ------------------------------- */
  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onPublish)}
        className="space-y-8 max-w-7xl mx-auto py-6"
      >
        {/* Header */}
        <div className="sticky top-0 z-10 flex items-center justify-between bg-background/80 backdrop-blur-sm p-4 -mx-6 -mt-6 border-b">
          <div>
            <h2 className="text-3xl font-bold">
              {isEditMode ? "Edit Article" : "Create New Article"}
            </h2>
            <p className="text-muted-foreground">
              {isEditMode
                ? "Update your article details."
                : "Fill in details to create an article."}
            </p>
          </div>

          <div className="flex gap-2 items-center">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
            >
              Cancel
            </Button>

            <Button
              type="button"
              variant="outline"
              onClick={form.handleSubmit(onSaveDraft)}
              disabled={loading}
            >
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Save className="h-4 w-4" />
              )}
              Save Draft
            </Button>

            <Button type="submit" disabled={loading}>
              {loading && <Loader2 className="h-4 w-4 animate-spin" />}
              {isEditMode ? "Update Article" : "Publish"}
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-8">
            {/* Basic info */}
            <Card>
              <CardContent className="pt-6 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Title */}
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Title</FormLabel>
                        <FormControl>
                          <Input placeholder="Article title" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Slug */}
                  <FormField
                    control={form.control}
                    name="slug"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Slug</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="auto-generated or custom"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          URL-friendly article identifier.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Description */}
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea
                          rows={4}
                          {...field}
                          value={field.value || ""}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            {/* Banner */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Banner</CardTitle>
              </CardHeader>
              <CardContent>
                <FormField
                  control={form.control}
                  name="banner"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <MediaUpload
                          value={field.value}
                          onChange={field.onChange}
                          accept="image/*"
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            {/* Content editor */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Content</CardTitle>
              </CardHeader>
              <CardContent>
                <FormField
                  control={form.control}
                  name="content"
                  render={({ field }) => (
                    <FormItem className="border rounded-md">
                      <FormControl>
                        <EditorField
                          value={field.value}
                          onChange={async (json, html) => {
                            field.onChange(json);
                            form.setValue("content_html", html);
                          }}
                          placeholder="Write your content..."
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>
          </div>

          {/* Right Column */}
          <div className="space-y-8">
            {/* General */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">General</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Category */}
                <FormField
                  control={form.control}
                  name="category_id"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Category</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select category" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {categories.map((cat) => (
                            <SelectItem key={cat.id} value={cat.id}>
                              {cat.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Tags */}
                <FormField
                  control={form.control}
                  name="tags"
                  render={() => (
                    <FormItem>
                      <FormLabel>Tags</FormLabel>
                      <div className="space-y-3">
                        <div className="flex gap-2">
                          <Input
                            placeholder="New tag..."
                            value={tagInput}
                            onChange={(e) => setTagInput(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === "Enter" || e.key === ",") {
                                e.preventDefault();
                                addTag();
                              }
                            }}
                          />
                          <Button type="button" size="sm" onClick={addTag}>
                            Add
                          </Button>
                        </div>

                        <div className="flex flex-wrap gap-2">
                          {tags.length ? (
                            tags.map((tag) => (
                              <Badge
                                key={tag}
                                className="flex items-center gap-1 px-2 py-1"
                              >
                                {tag}
                                <button
                                  type="button"
                                  onClick={() => removeTag(tag)}
                                >
                                  <X className="h-3 w-3" />
                                </button>
                              </Badge>
                            ))
                          ) : (
                            <p className="text-sm text-muted-foreground">
                              No tags added.
                            </p>
                          )}
                        </div>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            {/* SEO */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">SEO</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="meta_title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>SEO Title</FormLabel>
                      <FormControl>
                        <Input {...field} value={field.value || ""} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="meta_description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>SEO Description</FormLabel>
                      <FormControl>
                        <Textarea
                          rows={3}
                          {...field}
                          value={field.value || ""}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>
          </div>
        </div>
      </form>
    </Form>
  );
}
