"use client";

import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, TooltipProps } from "recharts";
import { formatCurrency } from "@/lib/utils";
import type { FundingTrendPoint } from "@/types";

interface FundingTrendsChartProps {
  data: FundingTrendPoint[];
}

const CustomTooltip: React.FC<TooltipProps<number, string>> = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-md border bg-popover px-2.5 py-1.5 text-xs shadow-sm">
      <p className="font-medium">{label}</p>
      <p className="text-muted-foreground">{formatCurrency(payload[0].value as number)}</p>
    </div>
  );
};

export function FundingTrendsChart({ data }: FundingTrendsChartProps) {
  const maxAmount = Math.max(...data.map((d) => d.amount), 1);
  return (
    <ResponsiveContainer width="100%" height={200}>
      <LineChart data={data} margin={{ top: 5, right: 10, left: 0, bottom: 20 }}>
        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
        <XAxis
          dataKey="date"
          tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }}
          tickLine={false}
          axisLine={false}
          interval="preserveEnd"
          tickMargin={6}
        />
        <YAxis
          hide
          domain={[0, maxAmount * 1.1]}
        />
        <Tooltip content={<CustomTooltip />} />
        <Line
          type="monotone"
          dataKey="amount"
          stroke="hsl(var(--primary))"
          strokeWidth={2}
          dot={{ r: 3, fill: "hsl(var(--primary))" }}
          activeDot={{ r: 5 }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
