"use client";

import * as React from "react";
import Image from "next/image";

import { NavGroup } from "@/components/sidebar/nav-group";
import { NavUser } from "@/components/sidebar/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenuButton,
} from "@/components/ui/sidebar";
import { cookieService } from "@/lib/cookie";
import { navData } from "@/lib/nav-items";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const [user, setUser] = React.useState<any>(null);

  React.useEffect(() => {
    const user = cookieService.getCookie("user");
    if (user) {
      setUser(JSON.parse(user));
    }
  }, []);

  return (
    <Sidebar collapsible="icon" {...props}>
      <div className="flex h-full flex-col">
        <SidebarHeader>
          <SidebarMenuButton size="lg" className="w-full justify-start">
            <div className="relative h-8 w-8">
              <Image
                src="/logo-icon.png"
                alt="5 O'Clock Logo"
                fill
                className="object-contain"
                sizes="32px"
              />
            </div>
            <div className="grid flex-1 text-left text-sm leading-tight">
              <span className="truncate font-medium">5 O&apos;Clock</span>
              <span className="truncate text-xs">Admin Panel</span>
            </div>
          </SidebarMenuButton>
        </SidebarHeader>
        <SidebarContent>
          <nav className="flex flex-1 flex-col space-y-4">
            {navData.navGroups.map((group) => (
              <NavGroup key={group.title} {...group} />
            ))}
          </nav>
        </SidebarContent>
        <SidebarFooter>
          <NavUser user={user} />
        </SidebarFooter>
      </div>
    </Sidebar>
  );
}
