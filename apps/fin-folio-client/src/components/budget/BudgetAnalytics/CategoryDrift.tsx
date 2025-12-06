import type { BarComparisonChartDatum } from "@/components/chart/BarComparisonChart";
import BarComparisonChart from "@/components/chart/BarComparisonChart";
import { createTooltipFormatter } from "@/components/chart/chartFormatter";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import type { ChartConfig } from "@/components/ui/chart";
import { useCurrency } from "@/hooks/useCurrency";

type CategoryDriftPoint = {
  category: string;
  previous: number; // last month
  current: number; // this month
};

const comparisonChartConfig = {
  previous: {
    label: "Last month",
    color: "var(--chart-3)"
  },
  current: {
    label: "This month",
    color: "var(--chart-2)"
  }
} satisfies ChartConfig;

type CategoryDriftProps = {
  chartData: CategoryDriftPoint[];
};

const CategoryDrift = ({ chartData }: CategoryDriftProps) => {
  const { format } = useCurrency();

  const comparisonChartData: BarComparisonChartDatum[] = chartData.map(
    point => ({
      category: point.category,
      previous: point.previous,
      current: point.current
    })
  );
  return (
    <Card>
      <CardHeader className="border-b">
        <CardTitle>Category Spend Drift</CardTitle>
        <CardDescription>
          How this month&apos;s spending compares to last month by category
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-6 space-y-10">
        <BarComparisonChart
          data={comparisonChartData}
          config={comparisonChartConfig}
          xKey="category"
          seriesKeys={["previous", "current"]}
          className="min-h-[280px]"
          tooltipFormatter={createTooltipFormatter(
            comparisonChartConfig,
            format
          )}
        />
      </CardContent>
    </Card>
  );
};

export default CategoryDrift;
