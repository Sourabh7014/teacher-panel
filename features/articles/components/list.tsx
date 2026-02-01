"use client";

import { DataTable } from "@/components/data-table/data-table";
import { DataTableToolbar } from "@/components/data-table/data-table-toolbar";
import { useDataTable } from "@/hooks/use-data-table";
import { useCallback, useState } from "react";
import useDebounce from "@/hooks/use-debounce";
import { useMemo, useEffect } from "react";
import { DataTableSkeleton } from "@/components/data-table/data-table-skeleton";
import { getColumns } from "./columns";
import { Article } from "../model";
import articleService from "../api.service";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function ArticleList() {
  const [data, setData] = useState<Article[]>([]);
  const [pageCount, setPageCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [updated, setUpdated] = useState(false);

  const refetch = useCallback(() => {
    fetchArticles();
  }, []);

  const columns = useMemo(() => getColumns(refetch), [refetch]);

  const { table } = useDataTable({
    data,
    columns,
    pageCount,
    manual: true,
    enableRowSelection: true,
    initialState: {
      pagination: { pageIndex: 0, pageSize: 10 },
      sorting: [{ id: "created_at", desc: true }],
      columnPinning: { right: ["actions"] },
    },
    getRowId: (row) => row.id,
  });

  const router = useRouter();

  const onCreate = () => {
    router.push("/blogs/articles/create");
  };

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

  const fetchArticles = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await articleService.list(queryParams);
      setData((response?.articles as unknown as Article[]) ?? []);
      if (response?.meta) {
        setPageCount(response.meta.total_pages);
      }
    } catch (error) {
      console.error("Failed to fetch articles:", error);
    } finally {
      setIsLoading(false);
    }
  }, [queryParams]);

  useEffect(() => {
    let isMounted = true;

    if (isMounted) {
      fetchArticles();
    }

    return () => {
      isMounted = false;
    };
  }, [fetchArticles, updated]);

  if (isLoading && data.length === 0) {
    return <DataTableSkeleton columnCount={columns.length} />;
  }

  return (
    <div className="w-full">
      <div className="mb-2 flex flex-wrap items-center justify-between space-y-2">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Articles</h2>
          <p className="text-muted-foreground">Manage article posts.</p>
        </div>
        <Button className="btn-primary-gradient" onClick={onCreate}>
          Create Article
        </Button>
      </div>
      <DataTable table={table} className="w-full" isLoading={isLoading}>
        <DataTableToolbar table={table} />
      </DataTable>
    </div>
  );
}
