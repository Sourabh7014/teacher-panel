"use client";

import CountryList from "@/features/locations/components/country/list";

export default function CountryPage() {
  return (
    <>
      <div className="mb-2 flex flex-wrap items-center justify-between space-y-2">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Countries</h2>
          <p className="text-muted-foreground">Check all countries.</p>
        </div>
      </div>
      <CountryList />
    </>
  );
}
