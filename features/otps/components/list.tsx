"use client";

import { DataTable } from "@/components/data-table/data-table";
import { DataTableToolbar } from "@/components/data-table/data-table-toolbar";
import { useDataTable } from "@/hooks/use-data-table";
import otpService from "../api.service";
import { columns } from "./columns";
import { DataTableSkeleton } from "@/components/data-table/data-table-skeleton";
import { useEffect, useMemo, useState } from "react";
import useDebounce from "@/hooks/use-debounce";
import { Otp } from "../model";

export default function OtpList() {
  const [data, setData] = useState<Otp[]>([]);
  const [pageCount, setPageCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  const { table } = useDataTable({
    data,
    columns,
    pageCount,
    manual: true, // Enable manual mode for server-side operations
    initialState: {
      pagination: { pageIndex: 0, pageSize: 10 },
      sorting: [{ id: "created_at", desc: true }],
      columnPinning: { right: ["actions"] },
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

    if (globalFilter) params.search = globalFilter;

    debouncedColumnFilters.forEach((filter: any) => {
      if (Array.isArray(filter.value)) {
        params[filter.id] = filter.value.join(",");
      } else {
        params[filter.id] = filter.value;
      }
    });

    return params;
  }, [pagination, sorting, debouncedColumnFilters, debouncedGlobalFilter]);

  useEffect(() => {
    let isMounted = true;

    const fetchUsers = async () => {
      try {
        setIsLoading(true);
        const response = await otpService.list(queryParams);
        if (isMounted) {
          setData(response?.otps ?? []);
          if (response?.meta) {
            setPageCount(response.meta.total_pages);
          }
        }
      } catch (error) {
        console.error("Failed to fetch users:", error);
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    fetchUsers();

    return () => {
      isMounted = false;
    };
  }, [queryParams]);

  if (isLoading && data.length === 0) {
    return <DataTableSkeleton columnCount={columns.length} />;
  }

  return (
    <div className="w-full">
      <DataTable table={table} className="w-full" isLoading={isLoading}>
        <DataTableToolbar table={table} />
      </DataTable>
    </div>
  );
}
