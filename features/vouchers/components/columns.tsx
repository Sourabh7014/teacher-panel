"use client";

import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header";
import { useConfirm } from "@/hooks/use-confirm";
import type { ColumnDef } from "@tanstack/react-table";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Pencil, Trash } from "lucide-react";
import { Voucher } from "../model";
import voucherService from "../api.service";
import { useModal } from "@/hooks/use-modal";
import { CreateVoucherDialog } from "./create";

const ActionsCell = ({
  voucher,
  refetch,
  vendorId,
}: {
  voucher: Voucher;
  refetch: () => void;
  vendorId: string;
}) => {
  const { openModal } = useModal();
  const confirm = useConfirm();

  const onEdit = () => {
    openModal(CreateVoucherDialog, { voucher, vendorId }, {}, (result) => {
      if (result) {
        refetch();
      }
    });
  };

  const handleDelete = async () => {
    await confirm({
      title: "Delete Voucher",
      description: `Are you sure you want to delete ${voucher.name}? This action cannot be undone.`,
      onConfirm: async () => {
        try {
          await voucherService.destroy(voucher.id, vendorId);
          refetch();
        } catch (error) {
          console.error("Error deleting voucher:", error);
        }
      },
    });
  };

  return (
    <div className="flex justify-end gap-2">
      <Button
        variant="outline"
        className="cursor-pointer"
        size="sm"
        onClick={() => onEdit()}
      >
        <Pencil className="h-4 w-4" />
      </Button>
      <Button
        variant="destructive"
        className="cursor-pointer"
        size="sm"
        onClick={handleDelete}
      >
        <Trash className="h-4 w-4" />
      </Button>
    </div>
  );
};

export const getColumns = (
  refetch: () => void,
  vendorId: string
): ColumnDef<Voucher>[] => [
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
    accessorKey: "code",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Code" />
    ),
    cell: ({ row }) => row.original.code || "N/A",
    meta: {
      label: "Code",
    },
  },
  {
    accessorKey: "activated_at",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Activated At" />
    ),
    cell: ({ cell }) => {
      const timestamp = cell.getValue<number>();
      const date = new Date(timestamp * 1000);
      return timestamp > 0 ? (
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
      ) : (
        "Not Activated"
      );
    },
    meta: {
      label: "Activated At",
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
      label: "Activated At",
    },
  },
  {
    id: "actions",
    header: () => <div className="text-right">Actions</div>,
    cell: ({ row }) =>
      row.original.activated_at > 0 ? null : (
        <ActionsCell
          voucher={row.original}
          refetch={refetch}
          vendorId={vendorId}
        />
      ),
    meta: {
      label: "Actions",
    },
  },
];
