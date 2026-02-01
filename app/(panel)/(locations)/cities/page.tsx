"use client";

import CityList from "@/features/locations/components/city/list";

export default function CityPage() {
  return (
    <>
      <div className="mb-2 flex flex-wrap items-center justify-between space-y-2">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Cities</h2>
          <p className="text-muted-foreground">Manage cities.</p>
        </div>
      </div>
      <CityList />
    </>
  );
}
