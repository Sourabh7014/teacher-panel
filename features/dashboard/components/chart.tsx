import React from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";
import { ChartDataPoint } from "../model";

interface ChartProps {
  data: ChartDataPoint[];
  color: string;
  secondaryColor?: string;
  label: string;
  secondaryLabel?: string;
  type?: "area" | "bar";
  height?: number;
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-slate-900 border border-slate-700 p-3 rounded-lg shadow-xl z-50">
        <p className="text-slate-200 text-sm font-medium mb-2">{label}</p>
        {payload.map((entry: any, index: number) => (
          <div key={index} className="flex items-center gap-2 text-sm">
            <div
              className="w-2 h-2 rounded-full"
              style={{ backgroundColor: entry.color }}
            />
            <span className="text-slate-400 capitalize">{entry.name}:</span>
            <span className="text-slate-100 font-mono font-medium">
              {entry.value.toLocaleString()}
            </span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

export const DashboardChart: React.FC<ChartProps> = ({
  data,
  color,
  secondaryColor,
  label,
  secondaryLabel,
  type = "area",
  height = 300,
}) => {
  if (type === "bar") {
    return (
      <div style={{ height }} className="w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              vertical={false}
              stroke="#1e293b"
            />
            <XAxis
              dataKey="date"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: "#94a3b8" }}
              dy={10}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: "#94a3b8" }}
            />
            <Tooltip
              content={<CustomTooltip />}
              cursor={{ fill: "#1e293b", opacity: 0.4 }}
            />
            <Bar
              dataKey="primary"
              name={label}
              fill={color}
              radius={[4, 4, 0, 0]}
              barSize={20}
              fillOpacity={0.9}
            />
            {secondaryColor && secondaryLabel && (
              <Bar
                dataKey="secondary"
                name={secondaryLabel}
                fill={secondaryColor}
                radius={[4, 4, 0, 0]}
                barSize={20}
                fillOpacity={0.9}
              />
            )}
          </BarChart>
        </ResponsiveContainer>
      </div>
    );
  }

  return (
    <div style={{ height }} className="w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={data}
          margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
        >
          <defs>
            <linearGradient
              id={`color${color.replace("#", "")}`}
              x1="0"
              y1="0"
              x2="0"
              y2="1"
            >
              <stop offset="5%" stopColor={color} stopOpacity={0.3} />
              <stop offset="95%" stopColor={color} stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid
            strokeDasharray="3 3"
            vertical={false}
            stroke="#1e293b"
          />
          <XAxis
            dataKey="date"
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 12, fill: "#94a3b8" }}
            dy={10}
          />
          <YAxis
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 12, fill: "#94a3b8" }}
          />
          <Tooltip
            content={<CustomTooltip />}
            cursor={{ stroke: "#334155", strokeWidth: 1 }}
          />
          <Area
            type="monotone"
            dataKey="primary"
            name={label}
            stroke={color}
            fillOpacity={1}
            fill={`url(#color${color.replace("#", "")})`}
            strokeWidth={2}
          />
          {secondaryColor && secondaryLabel && (
            <Area
              type="monotone"
              dataKey="secondary"
              name={secondaryLabel}
              stroke={secondaryColor}
              fillOpacity={1}
              fill={`url(#color${secondaryColor.replace("#", "")})`}
              strokeWidth={2}
            />
          )}
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};
