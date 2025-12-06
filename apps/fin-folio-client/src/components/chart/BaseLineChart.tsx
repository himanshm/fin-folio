import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig
} from "@/components/ui/chart";
import { cn } from "@/lib/utils";
import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts";
import { createTooltipFormatter } from "./chartFormatter";

type LineDefinition<TDatum extends Record<string, unknown>> = {
  key: keyof TDatum & string;
  colorVar: string;
  strokeWidth?: number;
  dashed?: boolean;
};

type BaseLineChartProps<TDatum extends Record<string, unknown>> = {
  data: TDatum[];
  chartConfig: ChartConfig;
  xKey: keyof TDatum & string;
  lines: LineDefinition<TDatum>[];
  className?: string;
  valueFormatter?: (value: number) => string;
  labelResolver?: (name: string) => string;
};

const BaseLineChart = <TDatum extends Record<string, unknown>>({
  data,
  chartConfig,
  xKey,
  lines,
  valueFormatter,
  className,
  labelResolver
}: BaseLineChartProps<TDatum>) => {
  const formatter = createTooltipFormatter(
    chartConfig,
    (value: number) => (valueFormatter ? valueFormatter(value) : String(value)),
    labelResolver
  );
  return (
    <ChartContainer config={chartConfig} className={cn("w-full", className)}>
      <LineChart data={data}>
        <CartesianGrid vertical={false} strokeDasharray="4 4" />
        <XAxis
          dataKey={xKey}
          axisLine={false}
          tickLine={false}
          tickMargin={8}
        />
        <YAxis hide />
        <ChartTooltip
          cursor={false}
          content={<ChartTooltipContent formatter={formatter} />}
        />
        <ChartLegend
          content={
            <ChartLegendContent className="justify-start" nameKey="dataKey" />
          }
        />
        {lines.map(line => (
          <Line
            key={line.key}
            dataKey={line.key}
            type="monotone"
            stroke={line.colorVar}
            strokeWidth={line.strokeWidth ?? 3}
            strokeDasharray={line.dashed ? "6 4" : undefined}
            dot={false}
          />
        ))}
      </LineChart>
    </ChartContainer>
  );
};

export default BaseLineChart;
