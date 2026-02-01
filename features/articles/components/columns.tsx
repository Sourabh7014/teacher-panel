"use client";

import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header";
import type { ColumnDef } from "@tanstack/react-table";
import { Checkbox } from "@/components/ui/checkbox";
import { Check, Pencil, Trash } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useConfirm } from "@/hooks/use-confirm";
import type { Article } from "../model";
import articleService from "../api.service";
import { useRouter } from "next/navigation";

function ArticleActions({
  row,
  refetch,
}: {
  row: { original: Article };
  refetch: () => void;
}) {
  const confirm = useConfirm();
  const router = useRouter();
  const article = row.original;

  const onEdit = () => {
    router.push(`/blogs/articles/${article.id}`);
  };

  const onDelete = async () => {
    await confirm({
      title: "Remove Article",
      description: `Are you sure you want to remove ${article.title}? This action cannot be undone.`,
      variant: "destructive",
      confirmText: "Remove",
      onConfirm: async () => {
        try {
          await articleService.remove(article.id);
          refetch();
        } catch (error) {
          console.error(error);
        }
      },
    });
  };

  const onPublish = async () => {
    await confirm({
      title: "Publish Article",
      description: `Are you sure you want to publish ${article.title}? This action cannot be undone.`,
      variant: "success",
      confirmText: "Publish",
      onConfirm: async () => {
        try {
          await articleService.publish(article.id);
          refetch();
        } catch (error) {
          console.error(error);
        }
      },
    });
  };

  return (
    <div className="flex justify-end items-center gap-2">
      {article.status === "DRAFT" && (
        <Button variant="default" onClick={onPublish}>
          <Check className="h-4 w-4" />
        </Button>
      )}
      <Button variant="outline" onClick={onEdit}>
        <Pencil className="h-4 w-4" />
      </Button>
      <Button variant="destructive" onClick={onDelete}>
        <Trash className="h-4 w-4" />
      </Button>
    </div>
  );
}

export const getColumns = (refetch: () => void): ColumnDef<Article>[] => [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value: any) =>
          table.toggleAllPageRowsSelected(!!value)
        }
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    id: "title",
    accessorKey: "title",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Title" />
    ),
    cell: ({ row }) => row.original.title,
    meta: {
      label: "Title",
    },
    enableHiding: false,
  },
  {
    accessorKey: "category_name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Category" />
    ),
    cell: ({ row }) => {
      return row.original.category?.name ?? "NA";
    },
    meta: {
      label: "Category",
    },
  },
  {
    accessorKey: "status",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Status" />
    ),
    cell: ({ cell }) => {
      const status = cell.getValue<Article["status"]>();
      const isPublished = status === "PUBLISHED";
      return (
        <Badge
          className={`capitalize text-white font-medium ${
            isPublished ? "bg-green-800" : "bg-yellow-700"
          }`}
        >
          {status}
        </Badge>
      );
    },
    meta: {
      label: "Status",
    },
  },
  {
    accessorKey: "created_at",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Created At" />
    ),
    cell: ({ cell }) => {
      const timestamp = cell.getValue<number>();
      const date = new Date(timestamp * 1000);
      return (
        <div>
          <div>
            {date.toLocaleDateString("en-US", {
              year: "numeric",
              month: "short",
              day: "numeric",
            })}
          </div>
          <div className="text-xs text-muted-foreground">
            {date.toLocaleTimeString("en-US", { timeStyle: "short" })}
          </div>
        </div>
      );
    },
    meta: {
      label: "Created At",
      variant: "dateRange",
    },
  },
  {
    id: "actions",
    cell: ({ row }) => <ArticleActions row={row} refetch={refetch} />,
    enableHiding: false,
    enableSorting: false,
  },
];
