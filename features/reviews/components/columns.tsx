"use client";

import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { ColumnDef } from "@tanstack/react-table";
import { Review } from "../model";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { BsStarFill } from "react-icons/bs";
import { EyeOff } from "lucide-react";
import { toast } from "sonner";
import ReviewService from "../api.service";

// Wrap the columns in a function that accepts a refetch function
export const getColumns = (refetch: () => void): ColumnDef<Review>[] => [
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
    accessorKey: "user",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="User" />
    ),
    cell: ({ row }) => {
      const user = row.original.user;
      return (
        <div className="flex items-center gap-2">
          <Avatar className="h-8 w-8">
            {user.avatar && (
              <AvatarImage
                src={user.avatar}
                alt={`${user.first_name} ${user.last_name}`}
              />
            )}
            <AvatarFallback className="rounded-lg bg-primary text-primary-foreground">
              {user.first_name.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="grid gap-0.5">
            <div className="font-medium">{`${user.first_name} ${user.last_name}`}</div>
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              {user.email}
            </div>
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "vendor",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Vendor" />
    ),
    cell: ({ row }) => {
      const vendor = row.original.vendor;
      return (
        <div className="flex items-center gap-2">
          <Avatar className="h-8 w-8">
            {vendor.logo && <AvatarImage src={vendor.logo} alt={vendor.name} />}
            <AvatarFallback className="rounded-lg bg-primary text-primary-foreground">
              {vendor.name.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="grid gap-0.5">
            <div className="font-medium">{`${vendor.name}`}</div>
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              {vendor.mobile}
            </div>
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "rating",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Rating" />
    ),
    cell: ({ row }) => {
      const rating = row.getValue("rating") as number;
      return (
        <div className="flex items-center">
          <Badge className="btn-primary-gradient">
            <BsStarFill />
            {rating}/5
          </Badge>
        </div>
      );
    },
  },
  {
    accessorKey: "comment",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Comment" />
    ),
    cell: ({ row }) => {
      const comment = row.getValue("comment") as string;
      return <div className="max-w-xs truncate text-sm">{comment || "-"}</div>;
    },
  },
  {
    accessorKey: "created_at",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Created At" />
    ),
    cell: ({ row }) => {
      const timestamp = row.getValue<number>("created_at");
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
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const review = row.original;

      const handleHideUnhide = async () => {
        try {
          await ReviewService.hide(review.id);
          // Update the row data to reflect the change
          row.toggleSelected(false);
          toast.success(
            `Review ${review.hidden ? "unhidden" : "hidden"} successfully`
          );

          // Use the passed refetch function to refresh the data
          refetch();
        } catch (error) {
          toast.error("Failed to update review visibility");
        }
      };

      return review.hidden ? (
        <div>
          <Badge className="rounded bg-red-500">Hidden</Badge>
        </div>
      ) : (
        <Button
          variant="outline"
          size="sm"
          onClick={handleHideUnhide}
          title={review.hidden ? "Unhide review" : "Hide review"}
        >
          <EyeOff className="h-4 w-4" /> Hide
        </Button>
      );
    },
  },
];

// Keep the original export for backward compatibility
export const columns: ColumnDef<Review>[] = getColumns(() => {});
