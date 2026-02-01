"use client";

import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header";
import { useConfirm } from "@/hooks/use-confirm";
import type { ColumnDef } from "@tanstack/react-table";
import type { Country } from "../../model";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
import locationService from "../../api.service";
import { Button } from "@/components/ui/button";
import { Pencil, Trash } from "lucide-react";
import { toast } from "sonner";

const SupportedCell = ({
  country,
  refetch,
}: {
  country: Country;
  refetch: () => void;
}) => {
  const confirm = useConfirm();

  const onToggle = async (value: boolean) => {
    await confirm({
      title: `Mark as ${value ? "Supported" : "Unsupported"}`,
      description: `Are you sure you want to mark ${country.name} as ${
        value ? "supported" : "unsupported"
      }?`,
      onConfirm: async () => {
        await locationService.updateCountry(country.id, { supported: value });
        refetch();
      },
    });
  };

  return (
    <div className="flex items-center">
      <Switch
        checked={country.supported}
        onCheckedChange={onToggle}
        className="data-[state=checked]:bg-primary"
      />
    </div>
  );
};

const ActiveCell = ({
  country,
  refetch,
}: {
  country: Country;
  refetch: () => void;
}) => {
  const confirm = useConfirm();

  const onToggle = async (value: boolean) => {
    await confirm({
      title: `Mark as ${value ? "Active" : "Inactive"}`,
      description: `Are you sure you want to mark ${country.name} as ${
        value ? "active" : "inactive"
      }?`,
      onConfirm: async () => {
        await locationService.updateCountry(country.id, { active: value });
        refetch();
      },
    });
  };

  return (
    <div className="flex items-center">
      <Switch
        checked={country.active}
        onCheckedChange={onToggle}
        className="data-[state=checked]:bg-primary"
      />
    </div>
  );
};

const ActionsCell = ({
  country,
  refetch,
  onEdit,
}: {
  country: Country;
  refetch: () => void;
  onEdit: (country: Country) => void;
}) => {
  const confirm = useConfirm();

  const handleDelete = async () => {
    await confirm({
      title: "Delete Country",
      description: `Are you sure you want to delete ${country.name}? This action cannot be undone.`,
      onConfirm: async () => {
        try {
          await locationService.deleteCountry(country.id);
          toast.success("Country deleted successfully");
          refetch();
        } catch (error) {
          console.error("Error deleting country:", error);
          toast.error("Failed to delete country");
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
        onClick={() => onEdit(country)}
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
  onEdit: (country: Country) => void
): ColumnDef<Country>[] => [
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
    accessorKey: "currency",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Currency" />
    ),
    cell: ({ row }) => row.original.currency || "N/A",
    meta: {
      label: "Currency",
    },
  },
  {
    accessorKey: "country_code",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Country Code" />
    ),
    cell: ({ row }) => row.original.country_code || "N/A",
    meta: {
      label: "Country Code",
    },
  },
  {
    accessorKey: "iso2",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="ISO2" />
    ),
    cell: ({ row }) => row.original.iso2 || "N/A",
    meta: {
      label: "ISO2",
    },
  },
  {
    accessorKey: "iso3",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="ISO3" />
    ),
    cell: ({ row }) => row.original.iso3 || "N/A",
    meta: {
      label: "ISO3",
    },
  },
  {
    accessorKey: "supported",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Supported" />
    ),
    cell: ({ row }) => (
      <SupportedCell country={row.original} refetch={refetch} />
    ),
    meta: {
      label: "Supported",
    },
  },
  {
    accessorKey: "active",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Active" />
    ),
    cell: ({ row }) => <ActiveCell country={row.original} refetch={refetch} />,
    meta: {
      label: "Active",
    },
  },
  {
    id: "actions",
    header: () => <div className="text-right">Actions</div>,
    cell: ({ row }) => (
      <ActionsCell country={row.original} refetch={refetch} onEdit={onEdit} />
    ),
    meta: {
      label: "Actions",
    },
  },
];
