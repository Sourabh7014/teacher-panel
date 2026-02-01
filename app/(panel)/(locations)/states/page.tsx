"use client";

import StateList from "@/features/locations/components/state/list";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

export default function StatePage() {
  // Create a ref to access the StateList component's methods
  return (
    <>
      <div className="mb-2 flex flex-wrap items-center justify-between space-y-2">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">States</h2>
          <p className="text-muted-foreground">Check all states.</p>
        </div>
        <div>
          <Button
            className="btn-primary-gradient"
            onClick={() => {
              // Dispatch a custom event to open the create dialog
              window.dispatchEvent(new CustomEvent("openCreateStateDialog"));
            }}
          >
            <Plus className="mr-2 h-4 w-4" />
            Add State
          </Button>
        </div>
      </div>
      <StateList />
    </>
  );
}
