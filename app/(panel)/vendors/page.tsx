"use client";

import { Button } from "@/components/ui/button";
import { MailPlus } from "lucide-react";
import VendorList from "@/features/vendors/components/list";
import Link from "next/link";

export default function VendorsPage() {
  return (
    <>
      <div className="mb-2 flex flex-wrap items-center justify-between space-y-2">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Vendor List</h2>
          <p className="text-muted-foreground">Manage your vendors here.</p>
        </div>
        <div className="flex gap-2">
          <Link href="/vendors/create">
            <Button className="space-x-1 btn-primary-gradient">
              <span>Create Vendor</span> <MailPlus size={18} />
            </Button>
          </Link>
        </div>
      </div>

      <VendorList />
    </>
  );
}
