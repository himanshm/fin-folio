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
import { AlertCircle, Info, PiggyBank, TriangleAlert } from "lucide-react";

type IncomeExpenseSummaryProps = {
  income: number;
  consumed: number;
  chartData: BarComparisonChartDatum[];
};

const incomeVsExpenseChartConfig = {
  income: {
    label: "Income",
    color: "var(--chart-1)"
  },
  expense: {
    label: "Expense",
    color: "var(--chart-2)"
  }
} satisfies ChartConfig;

const IncomeExpenseSummary = ({
  income,
  consumed,
  chartData
}: IncomeExpenseSummaryProps) => {
  const { format } = useCurrency();
  const remainingIncome = Math.max(income - consumed, 0);
  const overAmount = consumed - income;

  const renderIncomeSummary = () => {
    if (income <= 0) {
      return (
        <p className="flex items-center gap-2 text-xs text-muted-foreground">
          <Info className="size-3.5 text-muted-foreground" />
          <span>Add income to see how your expenses compare.</span>
        </p>
      );
    }

    if (consumed <= 0) {
      return (
        <p className="flex items-center gap-2 text-xs text-muted-foreground">
          <Info className="size-3.5 text-muted-foreground" />
          <span>
            You haven&apos;t recorded any expenses against this income yet.
          </span>
        </p>
      );
    }

    if (consumed < income) {
      return (
        <p className="flex items-center gap-2 text-xs text-emerald-600">
          <PiggyBank className="size-3.5 text-emerald-500" />
          <span>
            You are keeping {format(remainingIncome)} after expenses this month.
          </span>
        </p>
      );
    }

    if (consumed === income) {
      return (
        <p className="flex items-center gap-2 text-xs text-amber-600">
          <AlertCircle className="size-3.5 text-amber-500" />
          <span>
            You&apos;ve used 100% of your income on expenses this month.
          </span>
        </p>
      );
    }

    return (
      <p className="flex items-center gap-2 text-xs text-rose-600">
        <TriangleAlert className="size-3.5 text-rose-500" />
        <span>
          You are over your income by {format(overAmount)} this month.
        </span>
      </p>
    );
  };
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm font-medium text-muted-foreground">
          Income vs Expenses
        </CardTitle>
        <CardDescription className="text-3xl font-semibold text-foreground">
          {format(remainingIncome)}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <MetricComparisonBar
          leftLabel="Income"
          rightLabel="Expense"
          leftValue={income}
          rightValue={consumed}
          maxValue={income}
        />
        <BarComparisonChart
          data={chartData}
          config={incomeVsExpenseChartConfig}
          xKey="label"
          seriesKeys={["income", "expense"]}
          className="min-h-40"
          tooltipFormatter={createTooltipFormatter(
            incomeVsExpenseChartConfig,
            format
          )}
        />
        {renderIncomeSummary()}
      </CardContent>
    </Card>
  );
};

export default IncomeExpenseSummary;
