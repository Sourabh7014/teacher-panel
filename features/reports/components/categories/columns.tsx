"use client";

import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header";
import type { ColumnDef } from "@tanstack/react-table";
import type { ReportCategory } from "../../model";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { useConfirm } from "@/hooks/use-confirm";
import { useModal } from "@/hooks/use-modal";
import reportService from "../../api.service";
import CreateCategory from "./create";
import { Pencil, Trash } from "lucide-react";

function UserActions({
  row,
  refetch,
}: {
  row: { original: ReportCategory };
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
          await reportService.deleteCategory(category.id);

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
): ColumnDef<ReportCategory>[] => [
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
    accessorKey: "order",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Order" />
    ),
    cell: ({ row }) => row.original.order,
    meta: {
      label: "Order",
    },
  },
  {
    accessorKey: "created_at",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Created At" />
    ),
    cell: ({ cell }) => {
      const timestamp = cell.getValue<number>();
      // Create date in UTC to ensure consistent rendering between server and client
      const date = new Date(timestamp * 1000);

      // Format date manually to avoid hydration issues
      const months = [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
      ];
      const month = months[date.getUTCMonth()];
      const day = date.getUTCDate();
      const year = date.getUTCFullYear();

      // Format time manually (HH:MM AM/PM)
      let hours = date.getUTCHours();
      const minutes = date.getUTCMinutes().toString().padStart(2, "0");
      const ampm = hours >= 12 ? "PM" : "AM";
      hours = hours % 12;
      hours = hours ? hours : 12; // the hour '0' should be '12'
      const formattedTime = `${hours}:${minutes} ${ampm}`;

      return (
        <div>
          <div>{`${month} ${day}, ${year}`}</div>
          <div className="text-xs text-muted-foreground">{formattedTime}</div>
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
    cell: ({ row }) => <UserActions row={row} refetch={refetch} />,
    enableHiding: false,
    enableSorting: false,
  },
];
