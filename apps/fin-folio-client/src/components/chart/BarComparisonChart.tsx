import { cn } from "@/lib/utils";
import type { ReactNode } from "react";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig
} from "../ui/chart";
import { createTooltipFormatter } from "./chartFormatter";

export type BarComparisonChartDatum = Record<string, string | number>;

type BarComparisonChartProps = {
  data: BarComparisonChartDatum[];
  config: ChartConfig;
  className?: string;
  xKey: string;
  /**
   * Keys in data that represent the bar series.
   * These should line up with keys in `config`.
   */
  seriesKeys: string[];
  /**
   * Optional formatter for tooltip values.
   * (value, name) => ReactNode
   */
  tooltipFormatter?: (value: number, name: string) => ReactNode;
  /**
   * Bar width in px.
   */
  barSize?: number;
};

const BarComparisonChart = ({
  data,
  config,
  className,
  xKey,
  seriesKeys,
  tooltipFormatter,
  barSize = 36
}: BarComparisonChartProps) => {
  const defaultFormatter = createTooltipFormatter(config, value =>
    String(value)
  );
  return (
    <ChartContainer config={config} className={cn("w-full", className)}>
      <BarChart data={data} barSize={barSize}>
        <CartesianGrid vertical={false} strokeDasharray="4 4" />
        <XAxis
          dataKey={xKey}
          axisLine={false}
          tickLine={false}
          tickMargin={10}
        />
        <YAxis hide />
        <ChartTooltip
          cursor={false}
          content={
            <ChartTooltipContent
              nameKey="dataKey"
              formatter={(rawValue, rawName) => {
                if (tooltipFormatter) {
                  const numericValue = Number(rawValue);
                  const name = String(rawName);
                  return tooltipFormatter(numericValue, name);
                }
                return defaultFormatter(rawValue, rawName);
              }}
            />
          }
        />
        <ChartLegend
          content={
            <ChartLegendContent className="justify-start" nameKey="dataKey" />
          }
        />
        {seriesKeys.map(seriesKey => (
          <Bar
            key={seriesKey}
            dataKey={seriesKey}
            radius={6}
            fill={`var(--color-${seriesKey})`}
          />
        ))}
      </BarChart>
    </ChartContainer>
  );
};

export default BarComparisonChart;
