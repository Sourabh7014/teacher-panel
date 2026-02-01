"use client";

import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header";
import { useConfirm } from "@/hooks/use-confirm";
import type { ColumnDef } from "@tanstack/react-table";
import type { State } from "../../model";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
import locationService from "../../api.service";
import { Button } from "@/components/ui/button";
import { Pencil, Trash, Trash2 } from "lucide-react";
import { toast } from "sonner";

const SupportedCell = ({
  state,
  refetch,
}: {
  state: State;
  refetch: () => void;
}) => {
  const confirm = useConfirm();

  const onToggle = async (value: boolean) => {
    await confirm({
      title: `Mark as ${value ? "Supported" : "Unsupported"}`,
      description: `Are you sure you want to mark ${state.name} as ${
        value ? "supported" : "unsupported"
      }?`,
      onConfirm: async () => {
        await locationService.updateState(state.id, { supported: value });
        refetch();
      },
    });
  };

  return (
    <div className="flex items-center">
      <Switch
        checked={state.supported}
        onCheckedChange={onToggle}
        className="data-[state=checked]:bg-primary"
      />
    </div>
  );
};

const ActiveCell = ({
  state,
  refetch,
}: {
  state: State;
  refetch: () => void;
}) => {
  const confirm = useConfirm();

  const onToggle = async (value: boolean) => {
    await confirm({
      title: `Mark as ${value ? "Active" : "Inactive"}`,
      description: `Are you sure you want to mark ${state.name} as ${
        value ? "active" : "inactive"
      }?`,
      onConfirm: async () => {
        await locationService.updateState(state.id, { active: value });
        refetch();
      },
    });
  };

  return (
    <div className="flex items-center">
      <Switch
        checked={state.active}
        onCheckedChange={onToggle}
        className="data-[state=checked]:bg-primary"
      />
    </div>
  );
};

export const getColumns = (refetch: () => void): ColumnDef<State>[] => [
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
    accessorKey: "country",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Country" />
    ),
    cell: ({ row }) => row.original.country?.name || "N/A",
    meta: {
      label: "Country",
    },
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
    accessorKey: "state_code",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="State Code" />
    ),
    cell: ({ row }) => row.original.state_code || "N/A",
    meta: {
      label: "State Code",
    },
  },
  {
    accessorKey: "supported",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Supported" />
    ),
    cell: ({ row }) => <SupportedCell state={row.original} refetch={refetch} />,
    meta: {
      label: "Supported",
    },
  },
  {
    accessorKey: "active",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Active" />
    ),
    cell: ({ row }) => <ActiveCell state={row.original} refetch={refetch} />,
    meta: {
      label: "Active",
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const state = row.original;

      const handleEdit = () => {
        // This will be handled by the parent component
        window.dispatchEvent(new CustomEvent("editState", { detail: state }));
      };

      const handleDelete = () => {
        // This will be handled by the parent component
        window.dispatchEvent(new CustomEvent("deleteState", { detail: state }));
      };

      return (
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            className="cursor-pointer"
            size="sm"
            onClick={handleEdit}
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
    },
    meta: {
      label: "Actions",
    },
  },
];
