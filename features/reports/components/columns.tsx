"use client";

import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header";
import { Badge } from "@/components/ui/badge";
import type { ColumnDef } from "@tanstack/react-table";
import { CheckCircle, XCircle } from "lucide-react";
import { Report } from "../model";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import ReportService from "../api.service";
import Image from "next/image";

const AcknowledgedCell = ({ feedback }: { feedback: Report }) => {
  const [currentState, setCurrentState] = useState({
    acknowledged: feedback.acknowledged,
    acknowledgedAt: feedback.acknowledged_at || null,
  });

  const handleAcknowledge = async () => {
    try {
      await ReportService.acknowledgeReport(feedback.id);
      // Update local state
      const acknowledgedTime = Math.floor(Date.now() / 1000);
      setCurrentState({
        acknowledged: true,
        acknowledgedAt: acknowledgedTime,
      });
      toast.success("Report acknowledged successfully");
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

export const columns: ColumnDef<Report>[] = [
  {
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
    enableHiding: false,
  },
  {
    accessorKey: "category",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Category Name" />
    ),
    cell: ({ row }) => {
      const category = row.original.category;
      // Handle case where category is an object
      if (typeof category === "object" && category !== null) {
        return <div>{category.name || "Unknown Category"}</div>;
      }
      // Handle case where category is a string
      return <div>{category || "Unknown Category"}</div>;
    },
  },
  {
    accessorKey: "postReview",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Post/Review" />
    ),
    cell: ({ row }) => {
      const report = row.original;

      // Check if it's a post
      if (report.post) {
        const post = report.post;
        // Truncate description if it's too long
        const truncatedDescription =
          post.description.length > 100
            ? post.description.substring(0, 100) + "..."
            : post.description;

        return (
          <div className="flex items-start gap-2">
            {post.media && (
              <div className="flex-shrink-0">
                <div className="relative h-10 w-10 rounded overflow-hidden">
                  <Image
                    src={post.media}
                    alt="Post media"
                    fill
                    className="object-cover"
                    sizes="40px"
                  />
                </div>
              </div>
            )}
            <div className="min-w-0 flex-1">
              <div className="truncate text-sm">{truncatedDescription}</div>
            </div>
          </div>
        );
      }

      // If no post, check if there's a review in the description
      if (report.description) {
        const truncatedReview =
          report.description.length > 100
            ? report.description.substring(0, 100) + "..."
            : report.description;

        return <div className="text-sm">{truncatedReview}</div>;
      }

      return <div>Unknown Post/Review</div>;
    },
  },
  {
    accessorKey: "description",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Description" />
    ),
    cell: ({ row }) => {
      const truncatedReview =
        row.original.description.length > 100
          ? row.original.description.substring(0, 100) + "..."
          : row.original.description;
      return <div className="max-w-xs truncate">{truncatedReview}</div>;
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
    enableColumnFilter: true,
  },
];
