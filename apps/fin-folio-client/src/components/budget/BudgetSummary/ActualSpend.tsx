import BarComparisonChart, {
  type BarComparisonChartDatum
} from "@/components/chart/BarComparisonChart";
import { createTooltipFormatter } from "@/components/chart/chartFormatter";
import MetricComparisonBar from "@/components/chart/MetricComparisonBar";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import type { ChartConfig } from "@/components/ui/chart";
import { useCurrency } from "@/hooks/useCurrency";
import { ArrowUpRight, Minus, TriangleAlert } from "lucide-react";

type ActualSpendProps = {
  planned: number;
  consumed: number;
  chartData: BarComparisonChartDatum[];
  onBudget: boolean;
  overBudget: boolean;
};

const planVsActualChartConfig = {
  planned: {
    label: "Planned",
    color: "var(--chart-1)"
  },
  consumed: {
    label: "Consumed",
    color: "var(--chart-2)"
  }
} satisfies ChartConfig;

const ActualSpend = ({
  planned,
  consumed,
  chartData,
  onBudget,
  overBudget
}: ActualSpendProps) => {
  const { format } = useCurrency();
  const renderBudgetStatus = () => {
    if (overBudget) {
      return (
        <>
          <TriangleAlert className="size-4 text-rose-500" />
          <span className="font-semibold text-rose-500">
            You are over budget this month.
          </span>
        </>
      );
    }

    if (onBudget) {
      return (
        <>
          <Minus className="size-4 text-amber-500" />
          <span className="font-semibold text-amber-500">
            You've exactly hit your planned budget.
          </span>
        </>
      );
    }

    return (
      <>
        <ArrowUpRight className="size-4 text-emerald-500" />
        <span className="font-semibold text-emerald-500">
          You're tracking under budget for the month.
        </span>
      </>
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm font-medium text-muted-foreground">
          Actual Spending
        </CardTitle>
        <CardDescription className="text-3xl font-semibold text-foreground">
          {format(consumed)}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <MetricComparisonBar
          leftLabel="Planned"
          rightLabel="Consumed"
          leftValue={planned}
          rightValue={consumed}
          maxValue={planned}
        />
        <BarComparisonChart
          data={chartData}
          config={planVsActualChartConfig}
          xKey="label"
          seriesKeys={["planned", "consumed"]}
          className="min-h-40"
          tooltipFormatter={createTooltipFormatter(
            planVsActualChartConfig,
            format
          )}
        />
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          {renderBudgetStatus()}
        </div>
      </CardContent>
    </Card>
  );
};

export default ActualSpend;
