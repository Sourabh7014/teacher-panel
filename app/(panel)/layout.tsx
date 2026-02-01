import { AppSidebar } from "@/components/sidebar/app-sidebar";
import Header from "@/components/sidebar/header";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "5 O'Clock - Admin",
  description: "An Admin Panel for 5 O'Clock to manage all the things",
};

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <Header />
        <main className="max-w-7xl mx-auto w-full px-4 py-6">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  );
}
