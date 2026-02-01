"use client";

import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header";
import type { ColumnDef } from "@tanstack/react-table";
import { CheckCircle } from "lucide-react";
import { Button } from "../../../components/ui/button";
import feedbackService from "../api.service";
import { useState } from "react";
import { toast } from "sonner";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Feedback } from "../model";

// Define the Feedback interface since it's not fully defined in the codebase

// Create a separate component for the acknowledged cell to use hooks properly
const AcknowledgedCell = ({ feedback }: { feedback: Feedback }) => {
  const [currentState, setCurrentState] = useState({
    acknowledged: feedback.acknowledged,
    acknowledgedAt: feedback.acknowledged_at,
  });

  const handleAcknowledge = async () => {
    try {
      await feedbackService.acknowledge(feedback.id);
      // Update local state
      const acknowledgedTime = Math.floor(Date.now() / 1000);
      setCurrentState({
        acknowledged: true,
        acknowledgedAt: acknowledgedTime,
      });
      toast.success("Feedback acknowledged successfully");
    } catch (error) {
      toast.error("Failed to acknowledge feedback");
      console.error("Error acknowledging feedback:", error);
    }
  };

  return (
    <div className="flex flex-col gap-1">
      {currentState.acknowledgedAt ? (
        <div>
          <div>
            {new Date(currentState.acknowledgedAt * 1000).toLocaleString([], {
              month: "short",
              day: "numeric",
              year: "numeric",
            })}
          </div>
          <div className="text-xs text-muted-foreground">
            {new Date(currentState.acknowledgedAt * 1000).toLocaleString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </div>
        </div>
      ) : (
        <Button
          className="h-8 w-8 cursor-pointer border-green-500/50 bg-green-500/50 hover:bg-green-500/90 hover:text-white"
          size="icon"
          onClick={handleAcknowledge}
        >
          <CheckCircle className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
};

export const getColumns = (): ColumnDef<Feedback>[] => [
  {
    id: "user",
    accessorKey: "user",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="User" />
    ),
    cell: ({ row }) => {
      const user = row.original.user;
      if (!user) return <div>N/A</div>;

      const name = `${user.first_name} ${user.last_name}`;
      const initials = `${user.first_name.charAt(0)}${user.last_name.charAt(
        0
      )}`;

      return (
        <div className="flex items-center gap-2">
          <Avatar className="h-8 w-8">
            <AvatarFallback className="rounded-lg bg-primary text-primary-foreground text-xs">
              {initials}
            </AvatarFallback>
          </Avatar>
          <div className="grid gap-0.5">
            <div className="font-medium">{name}</div>
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              {user.email}
            </div>
          </div>
        </div>
      );
    },
  },
  {
    id: "category",
    accessorKey: "category.name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Category" />
    ),
    cell: ({ row }) => {
      const category = row.original.category;
      return <div className="capitalize">{category?.name || "N/A"}</div>;
    },
  },
  {
    id: "description",
    accessorKey: "description",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Description" />
    ),
    cell: ({ row }) => {
      const description = row.original.description;
      return (
        <div className="max-w-xs truncate text-muted-foreground">
          {description}
        </div>
      );
    },
  },
  {
    id: "acknowledged",
    accessorKey: "acknowledged",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Acknowledged" />
    ),
    cell: ({ row }) => {
      return <AcknowledgedCell feedback={row.original} />;
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
    meta: {
      label: "Acknowledged",
      variant: "select",
      options: [
        { label: "Yes", value: "true" },
        { label: "No", value: "false" },
      ],
    },
  },
  {
    id: "acknowledged_by",
    accessorKey: "acknowledged_user",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Acknowledged By" />
    ),
    cell: ({ row }) => {
      const acknowledgedBy = row.original.acknowledged_user;
      if (!acknowledgedBy) return <div>N/A</div>;

      const name = `${acknowledgedBy.first_name} ${acknowledgedBy.last_name}`;
      const initials = `${acknowledgedBy.first_name.charAt(
        0
      )}${acknowledgedBy.last_name.charAt(0)}`;

      return (
        <div className="flex items-center gap-2">
          <Avatar className="h-8 w-8">
            <AvatarFallback className="rounded-lg bg-primary text-primary-foreground text-xs">
              {initials}
            </AvatarFallback>
          </Avatar>
          <div className="grid gap-0.5">
            <div className="font-medium">{name}</div>
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              {acknowledgedBy.email}
            </div>
          </div>
        </div>
      );
    },
  },
  {
    id: "created_at",
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
    filterFn: (row, id, value) => {
      if (!value || (!value.from && !value.to)) return true;

      const cellValue = row.getValue(id);
      if (typeof cellValue !== "number") return true;

      const date = new Date(cellValue * 1000).getTime();
      const from = value.from ? new Date(value.from).getTime() : null;
      const to = value.to ? new Date(value.to).getTime() : null;

      if (from && to) {
        return date >= from && date <= to;
      }
      if (from) {
        return date >= from;
      }
      if (to) {
        return date <= to;
      }
      return true;
    },
  },
];
