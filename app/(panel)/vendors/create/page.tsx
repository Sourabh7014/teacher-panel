"use client";

import CreateVendor from "@/features/vendors/components/create";

export default function CreateVendorPage() {
  return (
    <>
      <div className="mb-2 flex flex-wrap items-center justify-between space-y-2">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Add New Vendor</h2>
          <p className="text-muted-foreground">Add new vendor here.</p>
        </div>
        <div className="flex gap-2"></div>
      </div>
      <CreateVendor />
    </>
  );
}
