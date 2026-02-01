"use client";

import { Button } from "@/components/ui/button";
import { ArrowLeft, Plus } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import CampaignsList from "@/features/campaigns/components/list";

export default function CampaignsPage() {
  const router = useRouter();

  const handleCreateCampaignClick = () => {
    router.push("/campaigns/create");
  };

  return (
    <div className="mx-auto w-full max-w-4xl space-y-6 px-4 pb-14 pt-6 md:px-0">
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <Link
            href="/users"
            className="flex items-center text-sm text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Link>
          <h1 className="text-3xl font-bold tracking-tight text-white">
            Campaigns
          </h1>
          <p className="text-sm text-muted-foreground">
            Manage and track your marketing campaigns
          </p>
        </div>
        <Button
          className="flex items-center gap-2 rounded-10 px-5 py-2 text-sm font-semibold"
          onClick={handleCreateCampaignClick}
        >
          <Plus className="h-4 w-4" />
          Create Campaign
        </Button>
      </div>
      <CampaignsList />
    </div>
  );
}
