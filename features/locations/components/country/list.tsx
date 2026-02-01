"use client";

import { DataTable } from "@/components/data-table/data-table";
import { DataTableToolbar } from "@/components/data-table/data-table-toolbar";
import { useDataTable } from "@/hooks/use-data-table";
import type { Country } from "../../model";
import { useCallback, useState } from "react";
import useDebounce from "@/hooks/use-debounce";
import { useMemo, useEffect } from "react";
import locationService from "../../api.service";
import { DataTableSkeleton } from "@/components/data-table/data-table-skeleton";
import { getColumns } from "./columns";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { CreateCountryDialog } from "./create";

export default function CountryList() {
  const [data, setData] = useState<Country[]>([]);
  const [pageCount, setPageCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState<Country | null>(null);

  const refetch = useCallback(() => {
    fetchCountries();
  }, []);

  const handleEdit = useCallback((country: Country) => {
    setSelectedCountry(country);
    setIsCreateDialogOpen(true);
  }, []);

  const columns = useMemo(
    () => getColumns(refetch, handleEdit),
    [refetch, handleEdit]
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

  const fetchCountries = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await locationService.getCountries(queryParams);
      setData(response?.countries ?? []);
      if (response?.meta) {
        setPageCount(response.meta.total_pages);
      }
    } catch (error) {
      console.error("Failed to fetch countries:", error);
    } finally {
      setIsLoading(false);
    }
  }, [queryParams]);

  useEffect(() => {
    let isMounted = true;

    if (isMounted) {
      fetchCountries();
    }

    return () => {
      isMounted = false;
    };
  }, [fetchCountries]);

  if (isLoading && data.length === 0) {
    return <DataTableSkeleton columnCount={columns.length} />;
  }

  return (
    <div className="w-full">
      <div className="flex justify-end mb-4">
        <Button
          onClick={() => {
            setSelectedCountry(null);
            setIsCreateDialogOpen(true);
          }}
          className="btn-primary-gradient"
        >
          <Plus className="mr-2 h-4 w-4" />
          Add Country
        </Button>
      </div>
      <DataTable table={table} className="w-full" isLoading={isLoading}>
        <DataTableToolbar table={table} />
      </DataTable>
      <CreateCountryDialog
        open={isCreateDialogOpen}
        onOpenChange={(open) => {
          setIsCreateDialogOpen(open);
          // Only clear selection when dialog is actually closing
          if (!open) {
            // Use a slightly longer delay to ensure the dialog closing animation completes
            // before clearing the country data
            setTimeout(() => {
              setSelectedCountry(null);
            }, 300);
          }
        }}
        onSuccess={refetch}
        country={selectedCountry}
      />
    </div>
  );
}
