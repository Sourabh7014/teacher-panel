"use client";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { cookieService } from "@/lib/cookie";
import profileService from "@/features/profile/api.service";
import { toast } from "sonner";

const sidebarNavItems = [
  {
    title: "Profile",
    href: "/profile/basic",
  },
  {
    title: "Password",
    href: "/profile/change-password",
  },
  // {
  //   title: "Notifications",
  //   href: "/profile/settings",
  //   // },
  // {
  //   title: "Sessions",
  //   href: "/profile/sessions",
  // },
];

export default function ProfileLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();
  const [user, setUser] = useState<{ username?: string; email?: string }>({
    username: "",
    email: "",
  });

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        // First try to get from cookie
        const userCookie = cookieService.getCookie("user");
        if (userCookie) {
          const userData = JSON.parse(userCookie);
          setUser({
            username: userData.username || "",
            email: userData.email || "",
          });
          return;
        }

        // If not in cookie, fetch from API
        const profileData: any = await profileService.getProfile();
        if (profileData) {
          setUser({
            username: profileData.username || "",
            email: profileData.email || "",
          });
        }
      } catch (error) {
        console.error("Failed to fetch user profile:", error);
        toast.error("Failed to load user profile");
      }
    };

    fetchUserProfile();
  }, []);

  // Generate avatar fallback from username
  const getAvatarFallback = () => {
    if (!user.username) return "U";
    const names = user.username.split(" ");
    if (names.length === 1) return names[0].charAt(0).toUpperCase();
    return (
      names[0].charAt(0).toUpperCase() +
      names[names.length - 1].charAt(0).toUpperCase()
    );
  };

  return (
    <div className="container-fluid mx-auto py-10">
      <div className="flex items-center gap-4 mb-8">
        <Avatar className="h-20 w-20">
          <AvatarFallback className="text-3xl">
            {getAvatarFallback()}
          </AvatarFallback>
        </Avatar>
        <div>
          <h1 className="text-3xl font-bold">{user.username || "User"}</h1>
          <p className="text-muted-foreground">
            {user.email || "user@example.com"}
          </p>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-5 gap-10">
        <aside className="md:col-span-1">
          <nav className="flex flex-col space-y-1">
            {sidebarNavItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  buttonVariants({ variant: "ghost" }),
                  pathname === item.href
                    ? "bg-muted hover:bg-muted"
                    : "hover:bg-transparent hover:underline",
                  "justify-start",
                )}
              >
                {item.title}
              </Link>
            ))}
          </nav>
        </aside>
        <main className="md:col-span-4">{children}</main>
      </div>
    </div>
  );
}
