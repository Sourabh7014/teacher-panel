"use client";

import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header";
import type { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Eye, EyeOff } from "lucide-react";
import { Post } from "../model";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import Image from "next/image";
import postService from "../api.service";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

export const columns: ColumnDef<Post>[] = [
  {
    accessorKey: "user",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="User" />
    ),
    cell: ({ row }) => {
      const user = row.original.user;
      if (!user) return <div>N/A</div>;

      // Handle the case where user is a string
      if (typeof user === "string") {
        return <div>{user}</div>;
      }

      // User is an object
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
              {user?.email}
            </div>
          </div>
        </div>
      );
    },
    enableHiding: false,
  },
  {
    accessorKey: "vendor",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Vendor" />
    ),
    cell: ({ row }) => {
      const vendor = row.original.vendor;
      if (!vendor) return <div>N/A</div>;

      // Handle the case where vendor is a string
      if (typeof vendor === "string") {
        return <div>{vendor}</div>;
      }

      // Vendor is an object
      const initials = `${vendor.name.charAt(0)}${vendor.name.charAt(0)}`;

      return (
        <div className="flex items-center gap-2">
          <Avatar className="h-8 w-8">
            <AvatarFallback className="rounded-lg bg-primary text-primary-foreground text-xs">
              {initials}
            </AvatarFallback>
          </Avatar>
          <div className="grid gap-0.5">
            <div className="font-medium">{vendor.name}</div>
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              {vendor.mobile}
            </div>
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "hidden",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Status" />
    ),
    cell: ({ row }) => <div>{row.original.hidden ? "Hidden" : "Visible"}</div>,
  },
  {
    accessorKey: "media",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Media" />
    ),
    cell: ({ row }) => {
      const post = row.original;
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
        </div>
      );
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
    accessorKey: "created_at",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Created At" />
    ),
    cell: ({ row }) => {
      const timestamp = row.original.created_at;
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
  {
    id: "actions",
    cell: ({ row, table }) => {
      const post = row.original;

      const handleHideUnhide = async () => {
        try {
          await postService.hide(post.id);
          // Update the row data to reflect the change
          row.toggleSelected(false);
          toast.success(`Post hidden successfully`);

          // Refresh the table data
          // Get the refetch function from the table meta if available
          const refetch = (table.options.meta as any)?.refetch;
          if (refetch) {
            refetch();
          } else {
            // Fallback: toggle the hidden state locally
            row.original.hidden = !post.hidden;
          }
        } catch (error) {
          toast.error("Failed to update post visibility");
        }
      };

      return post.hidden ? (
        <div>
          <Badge className="rounded bg-red-500">Hidden</Badge>
        </div>
      ) : (
        <Button
          variant="outline"
          size="sm"
          onClick={handleHideUnhide}
          title={post.hidden ? "Unhide post" : "Hide post"}
        >
          <EyeOff className="h-4 w-4" /> Hide
        </Button>
      );
    },
  },
];
