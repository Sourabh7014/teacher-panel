"use client";

import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header";
import { useConfirm } from "@/hooks/use-confirm";
import type { ColumnDef } from "@tanstack/react-table";
import type { City } from "../../model";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
import locationService from "../../api.service";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

const SupportedCell = ({
  city,
  refetch,
}: {
  city: City;
  refetch: () => void;
}) => {
  const confirm = useConfirm();

  const onToggle = async (value: boolean) => {
    await confirm({
      title: `Mark as ${value ? "Supported" : "Unsupported"}`,
      description: `Are you sure you want to mark ${city.name} as ${
        value ? "supported" : "unsupported"
      }?`,
      onConfirm: async () => {
        await locationService.updateCity(city.id, { supported: value });
        refetch();
      },
    });
  };

  return (
    <div className="flex items-center">
      <Switch
        checked={city.supported}
        onCheckedChange={onToggle}
        className="data-[state=checked]:bg-primary"
      />
    </div>
  );
};

const ActiveCell = ({ city, refetch }: { city: City; refetch: () => void }) => {
  const confirm = useConfirm();

  const onToggle = async (value: boolean) => {
    await confirm({
      title: `Mark as ${value ? "Active" : "Inactive"}`,
      description: `Are you sure you want to mark ${city.name} as ${
        value ? "active" : "inactive"
      }?`,
      onConfirm: async () => {
        await locationService.updateCity(city.id, { active: value });
        refetch();
      },
    });
  };

  return (
    <div className="flex items-center">
      <Switch
        checked={city.active}
        onCheckedChange={onToggle}
        className="data-[state=checked]:bg-primary"
      />
    </div>
  );
};

export const getColumns = (refetch: () => void): ColumnDef<City>[] => [
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
    accessorKey: "state",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="State" />
    ),
    cell: ({ row }) => row.original.state?.name || "N/A",
    meta: {
      label: "State",
    },
  },
  {
    accessorKey: "supported",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Supported" />
    ),
    cell: ({ row }) => <SupportedCell city={row.original} refetch={refetch} />,
    meta: {
      label: "Supported",
    },
  },
  {
    accessorKey: "active",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Active" />
    ),
    cell: ({ row }) => <ActiveCell city={row.original} refetch={refetch} />,
    meta: {
      label: "Active",
    },
  },
];
