"use client";

import CategoryList from "@/features/reports/components/categories/list";
import { Button } from "@/components/ui/button";
import { MailPlus } from "lucide-react";
import { useModal } from "@/hooks/use-modal";
import { useState } from "react";
import CreateCategory from "@/features/reports/components/categories/create";

export default function ReportCategoryPage() {
  const { openModal } = useModal();
  const [updated, setUpdated] = useState<boolean>(false);

  const handleCreateCategory = async () => {
    openModal(CreateCategory, {}, { size: "sm" }, (result) => {
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
          <h2 className="text-2xl font-bold tracking-tight">
            Report Categories
          </h2>
          <p className="text-muted-foreground">Check all report categories.</p>
        </div>
        <div className="flex gap-2">
          <Button
            className="space-x-1 btn-primary-gradient"
            onClick={handleCreateCategory}
          >
            <span>Create Category</span> <MailPlus size={18} />
          </Button>
        </div>
      </div>
      <CategoryList updated={updated} />
    </>
  );
}
