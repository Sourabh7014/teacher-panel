"use client";

import SettingsList from "@/features/settings/components/list";

export default function SettingsPage() {
  return (
    <>
      <div className="mb-2 flex flex-wrap items-center justify-between space-y-2">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Settings</h2>
          <p className="text-muted-foreground">Manage your settings here.</p>
        </div>
      </div>
      <SettingsList />
    </>
  );
}
