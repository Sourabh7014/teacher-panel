"use client";

import { ArrowLeft, Mail, MessageSquare, Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import CampaignForm from "./form";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function CreateCampaign() {
  const [selectedCampaignType, setSelectedCampaignType] = useState<
    string | null
  >(null);

  const handleCardClick = (type: string) => {
    setSelectedCampaignType(type);
  };

  const router = useRouter();

  const handleBack = () => {
    if (selectedCampaignType) {
      setSelectedCampaignType(null);
    } else {
      router.push("/campaigns");
    }
  };

  if (selectedCampaignType) {
    return (
      <CampaignForm campaignType={selectedCampaignType} onBack={handleBack} />
    );
  }

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="mx-auto w-full max-w-4xl px-4 md:px-0 mb-8">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            className="text-white/70 hover:text-white"
            onClick={handleBack}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-2xl font-semibold text-white">Create Campaign</h1>
        </div>
      </div>

      {/* Campaign Type Cards */}
      <div className="mx-auto w-full max-w-4xl px-4 md:px-0">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <CampaignTypeCard
            icon={Mail}
            title="Email Campaign"
            description="Reach your audience directly in their inboxes with personalized messages, newsletters, and promotional offers."
            iconColor="text-[#1f57ff]"
            bgColor="bg-[#121212]"
            onClick={() => handleCardClick("Email")}
          />
          <CampaignTypeCard
            icon={MessageSquare}
            title="SMS Campaign"
            description="Send concise, timely updates and promotions directly to mobile phones for high engagement rates."
            iconColor="text-[#3fb2ff]"
            bgColor="bg-[#121212]"
            onClick={() => handleCardClick("SMS")}
          />
          <CampaignTypeCard
            icon={Bell}
            title="App Notification"
            description="Engage users within your app with push notifications, in-app messages, and alerts to drive actions."
            iconColor="text-[#a78bfa]"
            bgColor="bg-[#121212]"
            onClick={() => handleCardClick("App Notification")}
          />
        </div>
      </div>
    </div>
  );
}

interface CampaignTypeCardProps {
  icon: any; // Lucide icon component
  title: string;
  description: string;
  iconColor: string;
  bgColor: string;
  onClick: () => void;
}

function CampaignTypeCard({
  icon: Icon,
  title,
  description,
  iconColor,
  bgColor,
  onClick,
}: CampaignTypeCardProps) {
  return (
    <div
      className={`rounded-[10px] border border-white/10 ${bgColor} p-6 text-center shadow-[0_25px_80px_rgba(0,0,0,0.85)] cursor-pointer hover:border-white/40 transition-colors`}
      onClick={onClick}
    >
      <div
        className={`mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full ${iconColor} bg-white/5`}
      >
        <Icon className="h-6 w-6" />
      </div>
      <h3 className="text-lg font-semibold text-white mb-2">{title}</h3>
      <p className="text-sm text-white/70">{description}</p>
    </div>
  );
}
