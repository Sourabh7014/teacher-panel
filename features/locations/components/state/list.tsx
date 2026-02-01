"use client";

import { DataTable } from "@/components/data-table/data-table";
import { DataTableToolbar } from "@/components/data-table/data-table-toolbar";
import { useDataTable } from "@/hooks/use-data-table";
import type { State, Country } from "../../model";
import { useCallback, useState, useEffect } from "react";
import useDebounce from "@/hooks/use-debounce";
import { useMemo } from "react";
import locationService from "../../api.service";
import { DataTableSkeleton } from "@/components/data-table/data-table-skeleton";
import { getColumns } from "./columns";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { CreateStateDialog } from "./create";
import { useConfirm } from "@/hooks/use-confirm";
import { toast } from "sonner";

export default function StateList() {
  const [data, setData] = useState<State[]>([]);
  const [pageCount, setPageCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [editingState, setEditingState] = useState<State | null>(null);
  const confirm = useConfirm();

  const refetch = useCallback(() => {
    fetchStates();
  }, []);

  const columns = useMemo(() => getColumns(refetch), [refetch]);

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

  const fetchStates = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await locationService.getStates(queryParams);
      setData(response?.states ?? []);
      if (response?.meta) {
        setPageCount(response.meta.total_pages);
      }
    } catch (error) {
      console.error("Failed to fetch states:", error);
    } finally {
      setIsLoading(false);
    }
  }, [queryParams]);

  useEffect(() => {
    let isMounted = true;

    if (isMounted) {
      fetchStates();
    }

    return () => {
      isMounted = false;
    };
  }, [fetchStates]);

  // Handle edit and delete events
  useEffect(() => {
    const handleOpenCreateStateDialog = () => {
      setIsCreateDialogOpen(true);
    };

    const handleEditState = (event: Event) => {
      const customEvent = event as CustomEvent;
      setEditingState(customEvent.detail);
      setIsCreateDialogOpen(true);
    };

    const handleDeleteState = (event: Event) => {
      const customEvent = event as CustomEvent;
      const state = customEvent.detail;

      confirm({
        title: "Delete State",
        description: `Are you sure you want to delete ${state.name}? This action cannot be undone.`,
        onConfirm: async () => {
          try {
            await locationService.deleteState(state.id);
            toast.success("State deleted successfully");
            refetch();
          } catch (error) {
            console.error("Failed to delete state:", error);
            toast.error("Failed to delete state");
          }
        },
      });
    };

    window.addEventListener(
      "openCreateStateDialog",
      handleOpenCreateStateDialog
    );
    window.addEventListener("editState", handleEditState as EventListener);
    window.addEventListener("deleteState", handleDeleteState as EventListener);

    return () => {
      window.removeEventListener(
        "openCreateStateDialog",
        handleOpenCreateStateDialog
      );
      window.removeEventListener("editState", handleEditState as EventListener);
      window.removeEventListener(
        "deleteState",
        handleDeleteState as EventListener
      );
    };
  }, [confirm, refetch]);

  const handleCreateSuccess = () => {
    refetch();
    setIsCreateDialogOpen(false);
    setEditingState(null);
  };

  const handleDialogOpenChange = (open: boolean) => {
    setIsCreateDialogOpen(open);
    if (!open) {
      setEditingState(null);
    }
  };

  if (isLoading && data.length === 0) {
    return <DataTableSkeleton columnCount={columns.length} />;
  }

  return (
    <div className="w-full">
      <DataTable table={table} className="w-full" isLoading={isLoading}>
        <DataTableToolbar table={table} />
      </DataTable>
      <CreateStateDialog
        open={isCreateDialogOpen}
        onOpenChange={handleDialogOpenChange}
        onSuccess={handleCreateSuccess}
        state={editingState}
      />
    </div>
  );
}
