import { createTooltipFormatter } from "@/components/chart/chartFormatter";
import DonutChart, {
  type DonutChartDatum
} from "@/components/chart/DonutChart";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import type { ChartConfig } from "@/components/ui/chart";
import { useCurrency } from "@/hooks/useCurrency";

type PlannedBudgetProps = {
  planned: number;
  remaining: number;
  coverage: number;
  plannedBudgetPieData: DonutChartDatum[];
};

const plannedBudgetDonutConfig = {
  consumed: {
    label: "Consumed",
    color: "var(--chart-3)"
  },
  remaining: {
    label: "Remaining",
    color: "var(--chart-2)"
  }
} satisfies ChartConfig;

const PlannedBudget = ({
  planned,
  remaining,
  coverage,
  plannedBudgetPieData
}: PlannedBudgetProps) => {
  const { format } = useCurrency();
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm font-medium text-muted-foreground">
          Planned Budget
        </CardTitle>
        <CardDescription className="text-3xl font-semibold text-foreground">
          {format(planned)}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <span>Remaining</span>
          <span className="font-semibold text-foreground">
            {format(remaining)}
          </span>
        </div>
        <div className="h-2 rounded-full bg-muted">
          <div
            className="h-full rounded-full bg-primary transition-all"
            style={{ width: `${coverage}%` }}
          />
        </div>
        {/* Donut chart for planned budget */}
        <DonutChart
          data={plannedBudgetPieData}
          config={plannedBudgetDonutConfig}
          className="min-h-[180px]"
          tooltipFormatter={createTooltipFormatter(
            plannedBudgetDonutConfig,
            format
          )}
        />
        <p className="text-xs text-muted-foreground">
          {coverage}% of your planned budget is already allocated.
        </p>
      </CardContent>
    </Card>
  );
};

export default PlannedBudget;
