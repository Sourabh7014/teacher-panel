"use client";

import { useEffect, useState } from "react";
import dashboardService from "../api.service";
import { ChartCard } from "./card";
import { DashboardChart } from "./chart";
import { ChartDataPoint } from "../model";
import { Loader2 } from "lucide-react";

export function VendorChart({ from, to }: { from: string; to: string }) {
  const [totalStats, setTotalStats] = useState<ChartDataPoint[]>([]);
  const [dailyStats, setDailyStats] = useState<ChartDataPoint[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      await dashboardService
        .getVendorStats({ from, to })
        .then((res: any) => {
          const stats = res.stats;
          const _totalStats: ChartDataPoint[] = [];
          const _dailyStats: ChartDataPoint[] = [];
          stats.date.forEach((date: string, index: number) => {
            _totalStats.push({ date, primary: stats.total[index] || 0 });
            _dailyStats.push({
              date,
              primary: stats.daily[index] || 0,
            });
          });
          setTotalStats(_totalStats);
          setDailyStats(_dailyStats);
        })
        .finally(() => {
          setLoading(false);
        });
    };
    fetchData();
  }, [from, to]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <ChartCard
        title="Vendor Growth"
        description="Cumulative count of all vendors"
      >
        {loading ? (
          <div className="h-[300px] flex flex-col items-center justify-center">
            <Loader2 className="animate-spin h-8 w-8 text-indigo-600" />
            <div className="animate-pulse text-gray-500 ml-2 mt-2">
              Loading data...
            </div>
          </div>
        ) : (
          <DashboardChart data={totalStats} color="#6366f1" label="Vendors" />
        )}
      </ChartCard>

      <ChartCard
        title="New Vendors"
        description="Daily count of new vendor registrations"
      >
        {loading ? (
          <div className="h-[300px] flex flex-col items-center justify-center">
            <Loader2 className="animate-spin h-8 w-8 text-indigo-600" />
            <div className="animate-pulse text-gray-500 ml-2 mt-2">
              Loading data...
            </div>
          </div>
        ) : (
          <DashboardChart
            data={dailyStats}
            color="#f17863ff"
            type="bar"
            label="Vendors"
          />
        )}
      </ChartCard>
    </div>
  );
}
