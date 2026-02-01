"use client";

import * as React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AuthenticationSettings } from "./authentication";
import { ContentSettings } from "./content";
import { GeneralSettings } from "./general";
import { NotificationSettings } from "./notifications";
import { UserSettings } from "./users";

const modules = [
  { id: "general", label: "General" },
  { id: "authentication", label: "Authentication" },
  { id: "content", label: "Content" },
  { id: "users", label: "Users" },
  { id: "notifications", label: "Notifications" },
];

export default function SettingsList() {
  return (
    <Tabs
      defaultValue="general"
      className="grid grid-cols-1 gap-6 md:grid-cols-5"
    >
      <TabsList className="flex-col items-stretch space-y-1 md:col-span-1 h-fit bg-transparent w-full">
        {modules.map((module) => (
          <TabsTrigger
            key={module.id}
            value={module.id}
            className="justify-start rounded-md px-4 py-2 hover:bg-muted cursor-pointer data-[state=active]:bg-muted data-[state=active]:shadow-none"
          >
            {module.label}
          </TabsTrigger>
        ))}
      </TabsList>
      <TabsContent value="general" className="md:col-span-4 mt-0">
        <GeneralSettings />
      </TabsContent>
      <TabsContent value="authentication" className="md:col-span-4 mt-0">
        <AuthenticationSettings />
      </TabsContent>
      <TabsContent value="content" className="md:col-span-4 mt-0">
        <ContentSettings />
      </TabsContent>
      <TabsContent value="users" className="md:col-span-4 mt-0">
        <UserSettings />
      </TabsContent>
      <TabsContent value="notifications" className="md:col-span-4 mt-0">
        <NotificationSettings />
      </TabsContent>
    </Tabs>
  );
}
