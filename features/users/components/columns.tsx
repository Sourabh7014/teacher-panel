"use client";

import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import type { ColumnDef } from "@tanstack/react-table";
import { CheckCircle, Mail, Phone, XCircle } from "lucide-react";
import type { User } from "../model";

// function UserActions({ row }: { row: { original: User } }) {
//   const confirm = useConfirm();
//   const user = row.original;

//   const onDelete = async () => {
//     await confirm({
//       title: "Delete User",
//       description: `Are you sure you want to delete ${user.first_name} ${user.last_name}? This action cannot be undone.`,
//       variant: "destructive",
//       confirmText: "Delete",
//       onConfirm: () => {
//         console.log(`Deleting user ${user.id}`);
//         // TODO: Implement API call to delete user
//       },
//     });
//   };

//   return (
//     <DropdownMenu>
//       <DropdownMenuTrigger asChild>
//         <Button variant="ghost" size="icon">
//           <MoreHorizontal className="h-4 w-4" />
//           <span className="sr-only">Action</span>
//         </Button>
//       </DropdownMenuTrigger>
//       <DropdownMenuContent align="end">
//         <DropdownMenuItem>
//           <Eye className="mr-2 h-4 w-4" />
//           View Details
//         </DropdownMenuItem>
//         <DropdownMenuItem>
//           <Edit className="mr-2 h-4 w-4" />
//           Edit User
//         </DropdownMenuItem>
//         <DropdownMenuSeparator />
//         <DropdownMenuItem variant="destructive" onClick={onDelete}>
//           <Trash2 className="mr-2 h-4 w-4" />
//           Delete
//         </DropdownMenuItem>
//       </DropdownMenuContent>
//     </DropdownMenu>
//   );
// }

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
      const { email, email_verified_at } = row.original;

      return (
        <>
          <div className="flex items-center gap-1">
            <Mail className="h-3 w-3" />
            {email}
            {email_verified_at ? (
              <CheckCircle className="h-3 w-3 text-green-500" />
            ) : (
              <XCircle className="h-3 w-3 text-red-500" />
            )}
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
      const { mobile, mobile_verified_at } = row.original;

      return (
        <>
          {mobile ? (
            <div className="flex items-center gap-1">
              <Phone className="h-3 w-3" />
              {"+91 " + mobile}
              {mobile_verified_at ? (
                <CheckCircle className="h-3 w-3 text-green-500" />
              ) : (
                <XCircle className="h-3 w-3 text-red-500" />
              )}
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
      <DataTableColumnHeader column={column} title="Joined At" />
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
      label: "Joined At",
      variant: "dateRange",
    },
    enableColumnFilter: true,
    size: 150,
  },
  {
    accessorKey: "last_activity_at",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Last Activity" />
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
    size: 150,
    meta: {
      label: "Last Activity",
      variant: "date",
    },
  },
  {
    id: "status",
    accessorKey: "status",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Status" />
    ),
    cell: ({ cell }) => {
      const status = cell.getValue<User["status"]>();
      const isActive = status === "ACTIVE";
      const Icon = isActive ? CheckCircle : XCircle;

      return (
        <Badge
          className={`capitalize text-white font-medium ${
            isActive ? "bg-green-800" : "bg-red-800"
          }`}
        >
          <Icon className="mr-1 h-3 w-3" />
          {status}
        </Badge>
      );
    },
    meta: {
      label: "Status",
      variant: "multiSelect",
      options: [
        { label: "Active", value: "ACTIVE", icon: CheckCircle },
        { label: "Suspended", value: "SUSPENDED", icon: XCircle },
        { label: "Deleted", value: "DELETED", icon: XCircle },
      ],
    },
    enableColumnFilter: true,
    size: 120,
  },
  // {
  //   id: "actions",
  //   cell: ({ row }) => <UserActions row={row} />,
  //   size: 48,
  //   enableHiding: false,
  //   enableSorting: false,
  // },
];
