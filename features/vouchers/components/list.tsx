"use client";

import { DataTable } from "@/components/data-table/data-table";
import { DataTableToolbar } from "@/components/data-table/data-table-toolbar";
import { useDataTable } from "@/hooks/use-data-table";
import type { Voucher } from "../model";
import { useCallback, useState } from "react";
import useDebounce from "@/hooks/use-debounce";
import { useMemo, useEffect } from "react";
import voucherService from "../api.service";
import { DataTableSkeleton } from "@/components/data-table/data-table-skeleton";
import { getColumns } from "./columns";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useModal } from "@/hooks/use-modal";
import { CreateVoucherDialog } from "./create";

export default function VoucherList({ vendorId }: { vendorId: string }) {
  const { openModal } = useModal();
  const [data, setData] = useState<Voucher[]>([]);
  const [pageCount, setPageCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  const refetch = useCallback(() => {
    fetchVouchers();
  }, []);

  const columns = useMemo(
    () => getColumns(refetch, vendorId),
    [refetch, vendorId]
  );

  const { table } = useDataTable({
    data,
    columns,
    pageCount,
    manual: true, // Enable manual mode for server-side operations
    initialState: {
      pagination: { pageIndex: 0, pageSize: 10 },
      sorting: [{ id: "name", desc: true }],
    },
    getRowId: (row) => row.id,
  });

  const { pagination, sorting, columnFilters, globalFilter } = table.getState();

  const debouncedColumnFilters = useDebounce(columnFilters, 300);
  const debouncedGlobalFilter = useDebounce(globalFilter, 300);

  const queryParams = useMemo<Record<string, any>>(() => {
    const params: Record<string, any> = {
      page: pagination.pageIndex + 1,
      per_page: pagination.pageSize,
      sort: sorting.map((s) => `${s.id}:${s.desc ? "desc" : "asc"}`).join(","),
    };

    if (debouncedGlobalFilter) params.search = debouncedGlobalFilter;

    debouncedColumnFilters.forEach((filter: any) => {
      if (Array.isArray(filter.value)) {
        params[filter.id] = filter.value.join(",");
      } else {
        params[filter.id] = filter.value;
      }
    });

    return params;
  }, [pagination, sorting, debouncedColumnFilters, debouncedGlobalFilter]);

  const fetchVouchers = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await voucherService.list(queryParams, vendorId);
      setData(response?.vouchers ?? []);
      if (response?.meta) {
        setPageCount(response.meta.total_pages);
      }
    } catch (error) {
      console.error("Failed to fetch vouchers:", error);
    } finally {
      setIsLoading(false);
    }
  }, [queryParams, vendorId]);

  useEffect(() => {
    let isMounted = true;

    if (isMounted) {
      fetchVouchers();
    }

    return () => {
      isMounted = false;
    };
  }, [fetchVouchers]);

  const handleCreateVoucher = async () => {
    openModal(CreateVoucherDialog, { vendorId }, { size: "sm" }, (result) => {
      if (result) {
        refetch();
      }
    });
  };

  if (isLoading && data.length === 0) {
    return <DataTableSkeleton columnCount={columns.length} />;
  }

  return (
    <div className="w-full">
      <div className="flex justify-end mb-4">
        <Button className="btn-primary-gradient" onClick={handleCreateVoucher}>
          <Plus className="mr-2 h-4 w-4" />
          Add Voucher
        </Button>
      </div>
      <DataTable table={table} className="w-full" isLoading={isLoading}>
        <DataTableToolbar table={table} />
      </DataTable>
    </div>
  );
}
