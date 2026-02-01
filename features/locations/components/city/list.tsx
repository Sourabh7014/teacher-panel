"use client";

import { DataTable } from "@/components/data-table/data-table";
import { DataTableToolbar } from "@/components/data-table/data-table-toolbar";
import { useDataTable } from "@/hooks/use-data-table";
import type { City } from "../../model";
import { useCallback, useState } from "react";
import useDebounce from "@/hooks/use-debounce";
import { useMemo, useEffect } from "react";
import locationService from "../../api.service";
import { DataTableSkeleton } from "@/components/data-table/data-table-skeleton";
import { getColumns } from "./columns";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { CreateCityDialog } from "./create";
import { useConfirm } from "@/hooks/use-confirm";
import { toast } from "sonner";

export default function CityList() {
  const [data, setData] = useState<City[]>([]);
  const [pageCount, setPageCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [editingCity, setEditingCity] = useState<City | null>(null);

  const confirm = useConfirm();

  const refetch = useCallback(() => {
    fetchCities();
  }, []);

  // Add edit and delete actions to columns
  const columns = useMemo(() => {
    const baseColumns = getColumns(refetch);

    // Add action column at the end
    return [
      ...baseColumns,
      {
        id: "actions",
        header: "Actions",
        cell: ({ row }: { row: any }) => {
          const city = row.original as City;

          return (
            <div className="flex space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setEditingCity(city);
                  setShowCreateDialog(true);
                }}
              >
                Edit
              </Button>
              <Button
                variant="destructive"
                size="sm"
                onClick={async () => {
                  const result = await confirm({
                    title: "Delete City",
                    description: `Are you sure you want to delete ${city.name}? This action cannot be undone.`,
                  });

                  if (result) {
                    try {
                      await locationService.deleteCity(city.id);
                      toast.success("City deleted successfully");
                      refetch();
                    } catch (error) {
                      console.error("Failed to delete city:", error);
                      toast.error("Failed to delete city");
                    }
                  }
                }}
              >
                Delete
              </Button>
            </div>
          );
        },
      },
    ];
  }, [refetch]);

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

  const fetchCities = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await locationService.getCities(queryParams);
      setData(response?.cities ?? []);
      if (response?.meta) {
        setPageCount(response.meta.total_pages);
      }
    } catch (error) {
      console.error("Failed to fetch cities:", error);
    } finally {
      setIsLoading(false);
    }
  }, [queryParams]);

  useEffect(() => {
    let isMounted = true;

    if (isMounted) {
      fetchCities();
    }

    return () => {
      isMounted = false;
    };
  }, [fetchCities]);

  const handleCreateSuccess = () => {
    refetch();
    setShowCreateDialog(false);
    setEditingCity(null);
  };

  if (isLoading && data.length === 0) {
    return <DataTableSkeleton columnCount={columns.length} />;
  }

  return (
    <div className="w-full">
      {/* Add the Create City button */}
      <div className="mb-4 flex justify-end">
        <Button
          onClick={() => setShowCreateDialog(true)}
          className="btn-primary-gradient"
        >
          <Plus className="mr-2 h-4 w-4" />
          Add City
        </Button>
      </div>

      <DataTable table={table} className="w-full" isLoading={isLoading}>
        <DataTableToolbar table={table} />
      </DataTable>

      {/* Create/Edit City Dialog */}
      <CreateCityDialog
        open={showCreateDialog}
        onOpenChange={(open) => {
          setShowCreateDialog(open);
          if (!open) setEditingCity(null);
        }}
        onSuccess={handleCreateSuccess}
        city={editingCity}
      />
    </div>
  );
}
