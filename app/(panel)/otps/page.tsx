"use client";

import OtpList from "@/features/otps/components/list";

export default function OtpPage() {
  return (
    <>
      <div className="mb-2 flex flex-wrap items-center justify-between space-y-2">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">OTPs</h2>
          <p className="text-muted-foreground">Check all OTPs sent to users.</p>
        </div>
      </div>
      <OtpList />
    </>
  );
}
