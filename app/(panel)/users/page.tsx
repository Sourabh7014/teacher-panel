import UserList from "@/features/users/components/list";
import { Button } from "@/components/ui/button";
import { Megaphone } from "lucide-react";
import Link from "next/link";

export default function UsersPage() {
  return (
    <>
      <div className="mb-2 flex flex-wrap items-center justify-between space-y-2">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">User List</h2>
          <p className="text-muted-foreground">Manage your users here.</p>
        </div>
        <Link href="/campaigns">
          <Button variant="outline" size="sm" className="h-8">
            <Megaphone className="mr-2 h-4 w-4" />
            Campaigns
          </Button>
        </Link>
      </div>
      <UserList />
    </>
  );
}
