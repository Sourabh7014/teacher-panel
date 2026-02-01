import { ChartCard } from "./card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

interface Vendor {
  id: string;
  name: string;
  logo: string;
  count: number;
}

interface User {
  id: string;
  first_name: string;
  last_name: string;
  username: string;
  avatar: string | null;
  total_earned: number;
}

interface TopStatsProps {
  vendors: Vendor[];
  users: User[];
}

export function TopStats({ vendors, users }: TopStatsProps) {
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <ChartCard
        title="Top Point Earners"
        description="Top Point Earners in selected period"
      >
        <div className="space-y-4">
          {users.length > 0 ? (
            users.map((user) => (
              <div
                key={user.id}
                className="flex items-center justify-between p-3 hover:bg-zinc-800/50 rounded-lg transition-colors"
              >
                <div className="flex items-center gap-3">
                  <Avatar className="h-10 w-10">
                    {user.avatar ? (
                      <AvatarImage src={user.avatar} alt={user.username} />
                    ) : (
                      <AvatarFallback className="bg-primary/10 text-primary">
                        {getInitials(`${user.first_name} ${user.last_name}`)}
                      </AvatarFallback>
                    )}
                  </Avatar>
                  <div>
                    <p className="font-medium text-sm">
                      {user.first_name} {user.last_name}
                    </p>
                    <p className="text-xs text-zinc-400">@{user.username}</p>
                  </div>
                </div>
                <Badge
                  variant="outline"
                  className="bg-primary/10 text-primary border-primary/20"
                >
                  {user.total_earned} pts
                </Badge>
              </div>
            ))
          ) : (
            <p className="text-sm text-zinc-400 text-center py-4">
              No users found
            </p>
          )}
        </div>
      </ChartCard>

      <ChartCard
        title="Top Checked In Vendors"
        description="Top Checked In Vendors in selected period"
      >
        <div className="space-y-4">
          {vendors.length > 0 ? (
            vendors.map((vendor) => (
              <div
                key={vendor.id}
                className="flex items-center justify-between p-3 hover:bg-zinc-800/50 rounded-lg transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg bg-zinc-800 flex items-center justify-center">
                    <span className="text-sm font-medium text-zinc-300">
                      {vendor.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")
                        .toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <p className="font-medium text-sm">{vendor.name}</p>
                    <p className="text-xs text-zinc-400">
                      {vendor.count} check-ins
                    </p>
                  </div>
                </div>
                <Badge variant="outline" className="border-zinc-700">
                  #{vendor.count}
                </Badge>
              </div>
            ))
          ) : (
            <p className="text-sm text-zinc-400 text-center py-4">
              No vendors found
            </p>
          )}
        </div>
      </ChartCard>
    </div>
  );
}
