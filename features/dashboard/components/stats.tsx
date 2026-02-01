import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Trophy,
  AlertCircle,
  AlertTriangle,
  MessageSquare,
  Users,
  LogIn,
  Camera,
  Store,
} from "lucide-react";
import { useEffect, useState } from "react";
import dashboardService from "../api.service";

export function Stats() {
  const [isLoading, setIsLoading] = useState(true);

  // Stats data with trend indicators
  const [stats, setStats] = useState([
    {
      icon: Trophy,
      key: "vouchers",
      label: "Pending Rewards",
      value: 0,
      color: "bg-gradient-to-br from-purple-500 to-purple-600",
      lightColor: "bg-purple-50",
      textColor: "text-purple-600",
    },
    {
      icon: AlertCircle,
      key: "posts",
      label: "Reported Posts",
      value: 0,
      color: "bg-gradient-to-br from-blue-500 to-blue-600",
      lightColor: "bg-blue-50",
      textColor: "text-blue-600",
    },
    {
      icon: AlertTriangle,
      key: "reviews",
      label: "Reported Reviews",
      value: 0,
      color: "bg-gradient-to-br from-green-500 to-green-600",
      lightColor: "bg-green-50",
      textColor: "text-green-600",
    },
    {
      icon: MessageSquare,
      key: "feedbacks",
      label: "Pending Feedback",
      value: 0,
      color: "bg-gradient-to-br from-pink-500 to-pink-600",
      lightColor: "bg-pink-50",
      textColor: "text-pink-600",
    },
  ]);

  // Quick stats for overview
  const [overflow, setOverflow] = useState([
    {
      label: "Total Users",
      key: "users",
      value: 0,
      icon: Users,
      color: "bg-blue-600",
    },
    {
      label: "Total Check-ins",
      key: "check_ins",
      value: 0,
      icon: LogIn,
      color: "bg-green-600",
    },
    {
      label: "Total Posts",
      key: "posts",
      value: 0,
      icon: Camera,
      color: "bg-purple-600",
    },
    {
      label: "Total Vendors",
      key: "vendors",
      value: 0,
      icon: Store,
      color: "bg-orange-600",
    },
  ]);

  // call apis here
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      await dashboardService
        .getStats()
        .then((res: any) => {
          setStats((prevStats) =>
            prevStats.map((stat) => ({
              ...stat,
              value: res.stats[stat.key] || 0,
            }))
          );
          setOverflow((prevOverflow) =>
            prevOverflow.map((stat) => ({
              ...stat,
              value: res.overview[stat.key] || 0,
            }))
          );
          setIsLoading(false);
        })
        .catch(() => {
          setIsLoading(false);
        });
    };
    fetchData();
  }, []);

  return (
    <>
      {/* Action Items */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {isLoading
          ? // Skeleton loaders for stats cards
            Array(4)
              .fill(0)
              .map((_, index) => (
                <Card
                  key={`skeleton-${index}`}
                  className="shadow-sm border-0 overflow-hidden"
                >
                  <CardContent className="p-0">
                    <div className="flex items-start justify-between p-6">
                      <div className="flex-1 space-y-3">
                        <Skeleton className="h-4 w-24" />
                        <Skeleton className="h-8 w-16" />
                      </div>
                      <Skeleton className="h-11 w-11 rounded-xl" />
                    </div>
                    <div className="bg-muted/50 px-6 py-2">
                      <Skeleton className="h-4 w-24" />
                    </div>
                  </CardContent>
                </Card>
              ))
          : stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <Card
                  key={index}
                  className="shadow-sm hover:shadow-md transition-shadow border-0 overflow-hidden"
                >
                  <CardContent className="p-0">
                    <div className="flex items-start justify-between p-6">
                      <div className="flex-1">
                        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                          {stat.label}
                        </p>
                        <div className="flex items-baseline gap-2">
                          <p className="text-3xl font-bold text-foreground">
                            {stat.value}
                          </p>
                        </div>
                      </div>
                      <div className={`${stat.color} p-3 rounded-xl shadow-lg`}>
                        <Icon className="w-5 h-5 text-white" />
                      </div>
                    </div>
                    <div className={`${stat.lightColor} px-6 py-2`}>
                      <p className={`text-xs font-medium ${stat.textColor}`}>
                        {stat.value > 0 ? "Requires attention" : "All clear"}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
      </div>

      {/* Quick Overview Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
        {isLoading
          ? // Skeleton loaders for overview stats
            Array(4)
              .fill(0)
              .map((_, index) => (
                <div
                  key={`overview-skeleton-${index}`}
                  className="flex items-center p-4 bg-muted/50 rounded-lg"
                >
                  <Skeleton className="h-14 w-14 rounded-xl mr-4" />
                  <div className="space-y-2">
                    <Skeleton className="h-7 w-16" />
                    <Skeleton className="h-4 w-24" />
                  </div>
                </div>
              ))
          : overflow.map((stat, idx) => {
              const Icon = stat.icon;
              return (
                <div
                  key={idx}
                  className="flex items-center p-4 bg-muted/50 rounded-lg"
                >
                  <div
                    className={`${stat.color} p-3 rounded-xl shadow-lg mr-4`}
                  >
                    <Icon className={`w-8 h-8 text-white`} />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-foreground">
                      {stat.value}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {stat.label}
                    </p>
                  </div>
                </div>
              );
            })}
      </div>
    </>
  );
}
