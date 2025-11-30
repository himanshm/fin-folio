import { cn } from "@/lib/utils";
import type { ReactNode } from "react";
import { Cell, Pie, PieChart } from "recharts";
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig
} from "../ui/chart";

export type DonutChartDatum = {
  name: string;
  value: number;
  fill?: string;
};

type DonutChartProps = {
  data: DonutChartDatum[];
  config: ChartConfig;
  className?: string;
  /**
   * Optional formatter for tooltip values.
   * (value, name) => ReactNode
   */
  tooltipFormatter?: (value: number, name: string) => ReactNode;
};

const DonutChart = ({
  data,
  config,
  className,
  tooltipFormatter
}: DonutChartProps) => {
  return (
    <ChartContainer config={config} className={cn("w-full", className)}>
      <PieChart>
        <Pie
          data={data}
          dataKey="value"
          nameKey="name"
          innerRadius={60}
          strokeWidth={8}
        >
          {data.map(entry => (
            <Cell
              key={entry.name}
              fill={entry.fill ?? `var(--color-${entry.name})`}
            />
          ))}
        </Pie>
        <ChartTooltip
          content={
            <ChartTooltipContent
              nameKey="name"
              formatter={(rawValue, rawName) => {
                const numericValue = Number(rawValue);
                const name = String(rawName);
                if (tooltipFormatter) {
                  return tooltipFormatter(numericValue, name);
                }
                return (
                  <div className="flex items-center justify-between gap-6">
                    <span className="capitalize text-muted-foreground">
                      {name}
                    </span>
                    <span className="font-mono font-medium text-foreground">
                      {numericValue}
                    </span>
                  </div>
                );
              }}
            />
          }
        />
        <ChartLegend
          content={
            <ChartLegendContent
              className="flex-wrap text-center"
              nameKey="name"
            />
          }
        />
      </PieChart>
    </ChartContainer>
  );
};

export default DonutChart;
