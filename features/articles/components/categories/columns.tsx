"use client";

import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header";
import type { ColumnDef } from "@tanstack/react-table";
import type { ArticleCategory } from "../../model";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { useConfirm } from "@/hooks/use-confirm";
import { useModal } from "@/hooks/use-modal";
import articleService from "../../api.service";
import CreateCategory from "./create";
import { Pencil, Trash } from "lucide-react";

function CategoryActions({
  row,
  refetch,
}: {
  row: { original: ArticleCategory };
  refetch: () => void;
}) {
  const confirm = useConfirm();
  const { openModal } = useModal();
  const category = row.original;

  const onEdit = () => {
    openModal(CreateCategory, { category }, {}, (result) => {
      if (result) {
        refetch();
      }
    });
  };

  const onDelete = async () => {
    await confirm({
      title: "Remove Category",
      description: `Are you sure you want to remove ${category.name}? This action cannot be undone.`,
      variant: "destructive",
      confirmText: "Remove",
      onConfirm: async () => {
        try {
          await articleService.deleteCategory(category.id);
          refetch();
        } catch (error) {
          console.error(error);
        }
      },
    });
  };

  return (
    <div className="flex justify-end items-center gap-2">
      <Button variant="outline" onClick={onEdit}>
        <Pencil className="h-4 w-4" />
      </Button>
      <Button variant="destructive" onClick={onDelete}>
        <Trash className="h-4 w-4" />
      </Button>
    </div>
  );
}

export const getColumns = (
  refetch: () => void
): ColumnDef<ArticleCategory>[] => [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
        className="translate-y-[2px]"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
        className="translate-y-[2px]"
      />
    ),
    size: 20,
    enableSorting: false,
    enableHiding: false,
  },
  {
    id: "name",
    accessorKey: "name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Name" />
    ),
    cell: ({ row }) => row.original.name,
    meta: {
      label: "Name",
    },
    enableHiding: false,
  },
  {
    id: "slug",
    accessorKey: "slug",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Slug" />
    ),
    cell: ({ row }) => row.original.slug,
    meta: {
      label: "Slug",
      variant: "text",
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
    cell: ({ row }) => <CategoryActions row={row} refetch={refetch} />,
    enableHiding: false,
    enableSorting: false,
  },
];
