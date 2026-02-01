"use client";

import { Button } from "@/components/ui/button";
import { MailPlus } from "lucide-react";
import AdminList from "@/features/admins/components/list";
import { useModal } from "@/hooks/use-modal";
import CreateUser from "@/features/admins/components/create";
import { useState } from "react";

export default function AdminsPage() {
  const { openModal } = useModal();
  const [updated, setUpdated] = useState<boolean>(false);

  const handleCreateAdmin = async () => {
    openModal(CreateUser, {}, { size: "sm" }, (result) => {
      console.log(result);
      if (result) {
        setUpdated(true);
      }
    });
  };

  return (
    <>
      <div className="mb-2 flex flex-wrap items-center justify-between space-y-2">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Admin Users</h2>
          <p className="text-muted-foreground">Manage your admins here.</p>
        </div>
        <div className="flex gap-2">
          <Button
            className="space-x-1 btn-primary-gradient"
            onClick={handleCreateAdmin}
          >
            <span>Create Admin</span> <MailPlus size={18} />
          </Button>
        </div>
      </div>
      <AdminList updated={updated} />
    </>
  );
}
