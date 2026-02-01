"use client";

import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header";
import { Badge } from "@/components/ui/badge";
import type { ColumnDef } from "@tanstack/react-table";
import { AlertCircle, CheckCircle, Mail, Phone, XCircle } from "lucide-react";
import type { Otp } from "../model";

const formatTimestamp = (timestamp: number | null | undefined) => {
  if (!timestamp) return <span className="text-muted-foreground">-</span>;
  const date = new Date(timestamp * 1000);
  return (
    <div className="flex flex-col">
      <span>
        {date.toLocaleDateString("en-US", {
          year: "numeric",
          month: "short",
          day: "numeric",
        })}
      </span>
      <span className="text-xs text-muted-foreground">
        {date.toLocaleTimeString("en-US", { timeStyle: "short" })}
      </span>
    </div>
  );
};

export const columns: ColumnDef<Otp>[] = [
  {
    accessorKey: "receiver",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Receiver" />
    ),
    cell: ({ row }) => {
      const receiver = row.original.receiver;
      const isEmail = receiver.includes("@");
      const Icon = isEmail ? Mail : Phone;

      return (
        <div className="flex items-center gap-2">
          <Icon className="h-4 w-4 text-muted-foreground" />
          <span>{receiver}</span>
        </div>
      );
    },
    enableColumnFilter: true,
    meta: {
      label: "Receiver",
    },
  },
  {
    accessorKey: "otp",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="OTP" />
    ),
    cell: ({ row }) => (
      <div className="font-mono text-sm">{row.getValue("otp")}</div>
    ),
    meta: {
      label: "OTP",
    },
  },
  {
    accessorKey: "event",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Event" />
    ),
    cell: ({ row }) => {
      const event = row.getValue("event");
      return event ? (
        <Badge variant="outline">{(event as string).replace("_", " ")}</Badge>
      ) : (
        "-"
      );
    },
    meta: {
      label: "Event",
    },
  },
  {
    accessorKey: "created_at",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Created At" />
    ),
    cell: ({ row }) => formatTimestamp(row.getValue("created_at")),
    enableColumnFilter: true,
    meta: {
      label: "Created At",
      variant: "date",
    },
  },
  {
    accessorKey: "expired_at",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Expires At" />
    ),
    cell: ({ row }) => formatTimestamp(row.getValue("expired_at")),
    meta: {
      label: "Expires At",
    },
  },
  {
    accessorKey: "used_at",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Used At" />
    ),
    cell: ({ row }) => formatTimestamp(row.getValue("used_at")),
    meta: {
      label: "Used At",
    },
  },
  {
    id: "status",
    accessorFn: (row) => {
      const { used_at, expired_at } = row;
      const now = Date.now() / 1000;
      if (used_at) return "used";
      if (expired_at < now) return "expired";
      return "active";
    },
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Status" />
    ),
    cell: ({ row }) => {
      const status = row.getValue("status");
      if (status === "used") {
        return (
          <Badge variant="outline" className="border-green-600 text-green-600">
            <CheckCircle className="mr-1 h-3 w-3" />
            Used
          </Badge>
        );
      }
      if (status === "expired") {
        return (
          <Badge variant="outline" className="border-red-600 text-red-600">
            <XCircle className="mr-1 h-3 w-3" />
            Expired
          </Badge>
        );
      }
      return (
        <Badge variant="outline" className="border-yellow-600 text-yellow-600">
          <AlertCircle className="mr-1 h-3 w-3" />
          Active
        </Badge>
      );
    },
    enableColumnFilter: true,
    meta: {
      label: "Status",
      variant: "multiSelect",
      options: [
        { label: "Active", value: "active", icon: AlertCircle },
        { label: "Used", value: "used", icon: CheckCircle },
        { label: "Expired", value: "expired", icon: XCircle },
      ],
    },
  },
];
