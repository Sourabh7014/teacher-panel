"use client";

import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { ColumnDef } from "@tanstack/react-table";
import { FormattedAddress } from "./address";
import { Ban, CheckCircle, Clock, Eye, XCircle } from "lucide-react";
import { Vendor, VendorStatus } from "../model";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useConfirm } from "@/hooks/use-confirm";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import Link from "next/link";
import EditVendorHours from "./edit-hours";
import { useModal } from "@/hooks/use-modal";
import vendorService from "../api.service";

export const getColumns = (refetch: () => void): ColumnDef<Vendor>[] => [
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
    accessorKey: "name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Name" />
    ),
    cell: ({ row }) => {
      const name = String(row.getValue("name"));
      const logo = row.original.logo;
      return (
        <div className="flex items-center gap-2">
          <Avatar className="h-8 w-8">
            {logo && <AvatarImage src={logo} alt={name} />}
            <AvatarFallback className="rounded-lg bg-primary text-primary-foreground">
              {name.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="grid gap-0.5">
            <div className="font-medium">{name}</div>
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              {row.original.mobile}
            </div>
          </div>
        </div>
      );
    },
  },

  {
    accessorKey: "address",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Address" />
    ),
    cell: ({ row }) => {
      const address: FormattedAddress = row.getValue("address");
      return (
        <div className="max-w-300 text-wrap">{address.address ?? "NA"}</div>
      );
    },
  },
  {
    accessorKey: "serves_breakfast",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Breakfast/Brunch" />
    ),
    cell: ({ row }) => {
      const servesBreakfast = row.getValue("serves_breakfast");
      return <div>{servesBreakfast ? "Yes" : "No"}</div>;
    },
  },
  {
    id: "status",
    accessorKey: "status",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Status" />
    ),
    cell: ({ cell }) => {
      const status = cell.getValue<Vendor["status"]>();
      const isActive = status === VendorStatus.APPROVED;
      const isPending = status === VendorStatus.PENDING;
      const Icon = isActive ? CheckCircle : isPending ? Clock : XCircle;

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
        { label: "Pending", value: VendorStatus.PENDING, icon: Clock },
        { label: "Approved", value: VendorStatus.APPROVED, icon: CheckCircle },
        { label: "Rejected", value: VendorStatus.REJECTED, icon: XCircle },
        {
          label: "Deactivated",
          value: VendorStatus.DEACTIVATED,
          icon: XCircle,
        },
      ],
    },
    enableColumnFilter: true,
    size: 120,
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
    cell: ({ row }) => <VendorActions row={row} refetch={refetch} />,
    size: 48,
    enableHiding: false,
    enableSorting: false,
  },
];

function VendorActions({
  row,
  refetch,
}: {
  row: { original: Vendor };
  refetch: () => void;
}) {
  const confirm = useConfirm();
  const { openModal } = useModal();
  const vendor = row.original;

  const onStatus = async (status: string) => {
    let title = "";
    if (status === VendorStatus.APPROVED) {
      title = "Approve";
    } else if (status === VendorStatus.REJECTED) {
      title = "Reject";
    } else if (status === VendorStatus.DEACTIVATED) {
      title = "Deactivate";
    }
    await confirm({
      title: title,
      description: `Are you sure you want to ${title} ${vendor.name}? This action cannot be undone.`,
      variant: "destructive",
      confirmText: "Change",
      onConfirm: async () => {
        try {
          await vendorService.updateStatus(vendor.id, { status });

          refetch();
        } catch (error) {
          console.error(error);
        }
      },
    });
  };

  return (
    <div className="flex justify-end items-center gap-2">
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Link href={`/vendors/${vendor.id}`}>
              <Button
                variant="outline"
                className="h-8 w-8 cursor-pointer"
                size="icon"
              >
                <Eye className="h-4 w-4" />
                <span className="sr-only">View</span>
              </Button>
            </Link>
          </TooltipTrigger>
          <TooltipContent side="top">
            <p>View</p>
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="outline"
              className="h-8 w-8 cursor-pointer"
              size="icon"
              onClick={() => {
                openModal(
                  EditVendorHours,
                  { vendorId: vendor.id, hours: null },
                  { size: "md" },
                  () => {}
                );
              }}
            >
              <Clock className="h-4 w-4" />
              <span className="sr-only">Operating Hours</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent side="top">
            <p>Operating Hours</p>
          </TooltipContent>
        </Tooltip>

        {vendor.status === VendorStatus.APPROVED && (
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                className="h-8 w-8 cursor-pointer border-red-500/50 bg-red-500/50 hover:bg-red-500/90 hover:text-white"
                size="icon"
                onClick={() => onStatus(VendorStatus.DEACTIVATED)}
              >
                <Ban className="h-4 w-4" />
                <span className="sr-only">Deactivate</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent side="top">
              <p>Deactivate</p>
            </TooltipContent>
          </Tooltip>
        )}

        {vendor.status === VendorStatus.PENDING && (
          <>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  className="h-8 w-8 cursor-pointer border-green-500/50 bg-green-500/50 hover:bg-green-500/90 hover:text-white"
                  size="icon"
                  onClick={() => onStatus(VendorStatus.APPROVED)}
                >
                  <CheckCircle className="h-4 w-4" />
                  <span className="sr-only">Approve</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent side="top">
                <p>Approve</p>
              </TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  className="h-8 w-8 cursor-pointer border-red-500/50 bg-red-500/50 hover:bg-red-500/90 hover:text-white"
                  size="icon"
                  onClick={() => onStatus(VendorStatus.REJECTED)}
                >
                  <XCircle className="h-4 w-4" />
                  <span className="sr-only">Reject</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent side="top">
                <p>Reject</p>
              </TooltipContent>
            </Tooltip>
          </>
        )}

        {vendor.status === VendorStatus.DEACTIVATED && (
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                className="h-8 w-8 cursor-pointer border-green-500/50 bg-green-500/50 hover:bg-green-500/90 hover:text-white"
                size="icon"
                onClick={() => onStatus(VendorStatus.APPROVED)}
              >
                <CheckCircle className="h-4 w-4" />
                <span className="sr-only">Activate Again</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent side="top">
              <p>Activate Again</p>
            </TooltipContent>
          </Tooltip>
        )}
      </TooltipProvider>
    </div>
  );
}
