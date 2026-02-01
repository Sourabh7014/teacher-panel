"use client";

import { DataTable } from "@/components/data-table/data-table";
import { DataTableSkeleton } from "@/components/data-table/data-table-skeleton";
import { DataTableToolbar } from "@/components/data-table/data-table-toolbar";
import { useDataTable } from "@/hooks/use-data-table";
import useDebounce from "@/hooks/use-debounce";
import { useCallback, useEffect, useMemo, useState } from "react";
import reviewService from "../api.service";
import type { Review } from "../model";
import { getColumns } from "./columns";

export default function ReviewList() {
  const [data, setData] = useState<Review[]>([]);
  const [pageCount, setPageCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  // Create a refetch function that calls fetchReviews
  const refetch = useCallback(() => {
    fetchReviews();
  }, []);

  // Use getColumns with the refetch function
  const columns = useMemo(() => getColumns(refetch), [refetch]);

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

  const fetchReviews = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await reviewService.list(queryParams);
      setData(response?.reviews ?? []);
      if (response?.meta) {
        setPageCount(response.meta.total_pages);
      }
    } catch (error) {
      console.error("Failed to fetch reviews:", error);
    } finally {
      setIsLoading(false);
    }
  }, [queryParams]);

  useEffect(() => {
    let isMounted = true;

    if (isMounted) {
      fetchReviews();
    }

    return () => {
      isMounted = false;
    };
  }, [fetchReviews]);

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
