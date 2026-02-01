"use client";

import { DataTable } from "@/components/data-table/data-table";
import { DataTableToolbar } from "@/components/data-table/data-table-toolbar";
import { useDataTable } from "@/hooks/use-data-table";
import { useCallback, useState } from "react";
import useDebounce from "@/hooks/use-debounce";
import { useMemo, useEffect } from "react";
import { DataTableSkeleton } from "@/components/data-table/data-table-skeleton";
import { getColumns } from "./columns";
import feedbackService from "../api.service";

// Import the Feedback interface we defined in columns.tsx
import type { Feedback } from "../model";

export default function FeedbackList() {
  const [data, setData] = useState<Feedback[]>([]);
  const [pageCount, setPageCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  const columns = useMemo(() => getColumns(), []);

  const { table } = useDataTable({
    data,
    columns,
    pageCount,
    manual: true, // Enable manual mode for server-side operations
    initialState: {
      pagination: { pageIndex: 0, pageSize: 10 },
      sorting: [{ id: "created_at", desc: true }],
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

  const fetchFeedbacks = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await feedbackService.list(queryParams);
      setData(response?.feedbacks ?? []);
      if (response?.meta) {
        setPageCount(response.meta.total_pages);
      }
    } catch (error) {
      console.error("Failed to fetch feedbacks:", error);
    } finally {
      setIsLoading(false);
    }
  }, [queryParams]);

  useEffect(() => {
    let isMounted = true;

    if (isMounted) {
      fetchFeedbacks();
    }

    return () => {
      isMounted = false;
    };
  }, [fetchFeedbacks]);

  return (
    <div className="flex flex-col gap-2.5">
      <DataTableToolbar table={table} />
      {isLoading ? (
        <DataTableSkeleton columnCount={columns.length} />
      ) : (
        <DataTable table={table} isLoading={isLoading} />
      )}
    </div>
  );
}
