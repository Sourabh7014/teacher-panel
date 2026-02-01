"use client";
import { useEffect, useState } from "react";
import { DateTime } from "luxon";

import { RefreshCw, CalendarIcon } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { DateRange } from "react-day-picker";
import { Calendar } from "@/components/ui/calendar";
import { Stats } from "./stats";
import { UserGrowthChart } from "./user";
import { CheckInChart } from "./check-ins";
import { PostChart } from "./posts";
import { VendorChart } from "./vendors";
import dashboardService from "../api.service";
import { TopStats } from "./top-stats";

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

const AdminDashboard = () => {
  const [range, setRange] = useState<DateRange | undefined>({
    from: DateTime.now().minus({ days: 7 }).toJSDate(),
    to: DateTime.now().toJSDate(),
  });

  const [startDate, setStartDate] = useState(
    DateTime.now().minus({ days: 7 }).toFormat("yyyy-MM-dd")
  );
  const [endDate, setEndDate] = useState(
    DateTime.now().endOf("month").toFormat("yyyy-MM-dd")
  );

  const [topStats, setTopStats] = useState<TopStatsProps>({
    vendors: [],
    users: [],
  });
  useEffect(() => {
    const fetchData = async () => {
      await dashboardService
        .getTopStats({ from: startDate, to: endDate })
        .then((res: any) => {
          setTopStats(res.stats);
        });
    };
    fetchData();
  }, [startDate, endDate]);

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto py-6 space-y-6">
        <Stats />
      </div>

      {/* Header */}
      <div className="bg-card border-b rounded-lg sticky top-0 z-10 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-foreground">
              Analytical Overview
            </h1>
            <div className="flex items-center gap-3">
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline">
                    <CalendarIcon />
                    {range?.from && range?.to
                      ? `${range.from.toLocaleDateString()} - ${range.to.toLocaleDateString()}`
                      : "January 2025"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent
                  className="w-auto overflow-hidden p-0"
                  align="end"
                >
                  <Calendar
                    className="w-full"
                    mode="range"
                    defaultMonth={range?.from}
                    selected={range}
                    onSelect={setRange}
                    startMonth={range?.from}
                    fixedWeeks
                    showOutsideDays
                  />
                </PopoverContent>
              </Popover>
              <button
                className="bg-primary text-primary-foreground px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary/90 transition-all flex items-center gap-2 shadow-sm hover:shadow"
                onClick={() => {
                  setRange({
                    from: DateTime.now().startOf("month").toJSDate(),
                    to: DateTime.now().endOf("month").toJSDate(),
                  });
                  if (range?.from) {
                    setStartDate(
                      DateTime.fromJSDate(range.from).toFormat("yyyy-MM-dd")
                    );
                    setEndDate(
                      DateTime.fromJSDate(range.to || range.from).toFormat(
                        "yyyy-MM-dd"
                      )
                    );
                  }
                }}
              >
                <RefreshCw className="w-4 h-4" />
                Refresh
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto py-6 space-y-6">
        <TopStats vendors={topStats.vendors} users={topStats.users} />

        <UserGrowthChart from={startDate} to={endDate} />

        <CheckInChart from={startDate} to={endDate} />

        <PostChart from={startDate} to={endDate} />

        <VendorChart from={startDate} to={endDate} />
      </div>
    </div>
  );
};

export default AdminDashboard;
