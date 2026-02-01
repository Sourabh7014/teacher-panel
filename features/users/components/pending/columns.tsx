"use client";

import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Checkbox } from "@/components/ui/checkbox";
import type { ColumnDef } from "@tanstack/react-table";
import { Mail, Phone } from "lucide-react";
import type { User } from "../../model";

export const columns: ColumnDef<User>[] = [
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
    size: 18,
    enableSorting: false,
    enableHiding: false,
  },
  {
    id: "name",
    accessorKey: "first_name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="User" />
    ),
    cell: ({ row }) => {
      const user = row.original;
      return (
        <div className="flex items-center gap-2">
          <Avatar className="h-8 w-8">
            {user.avatar && (
              <AvatarImage src={user.avatar} alt={user.first_name} />
            )}
            <AvatarFallback className="rounded-lg bg-primary text-primary-foreground">
              {user.first_name?.charAt(0) || "5"}
            </AvatarFallback>
          </Avatar>
          <div className="grid gap-0.5">
            <div className="font-medium">
              {user.first_name} {user.last_name}
            </div>
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              @{user.username}
            </div>
          </div>
        </div>
      );
    },
    meta: {
      label: "User",
    },
    enableHiding: false,
    minSize: 250,
  },
  {
    accessorKey: "email",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Email" />
    ),
    cell: ({ row }) => {
      const { email } = row.original;

      return (
        <>
          <div className="flex items-center gap-1">
            <Mail className="h-3 w-3" />
            {email}
          </div>
        </>
      );
    },
    size: 150,
    meta: {
      label: "Email",
    },
  },
  {
    accessorKey: "mobile",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Mobile" />
    ),
    cell: ({ row }) => {
      const { mobile } = row.original;

      return (
        <>
          {mobile ? (
            <div className="flex items-center gap-1">
              <Phone className="h-3 w-3" />
              {"+91 " + mobile}
            </div>
          ) : (
            "NA"
          )}
        </>
      );
    },
    size: 150,
    meta: {
      label: "Mobile",
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
    enableColumnFilter: true,
    size: 150,
  },
];
