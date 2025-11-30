import { useCurrency } from "@/hooks/useCurrency";
import { getPercent } from "@/lib/utils";
import type { BudgetItem } from "@/types";
import type { BudgetCategoryType } from "@/types/budget.types";
import { createTooltipFormatter } from "../chart/chartFormatter";
import type { DonutChartDatum } from "../chart/DonutChart";
import DonutChart from "../chart/DonutChart";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "../ui/card";
import type { ChartConfig } from "../ui/chart";

const spendingChartConfig = {
  needs: {
    label: "Needs",
    color: "var(--chart-3)"
  },
  wants: {
    label: "Wants",
    color: "var(--chart-4)"
  },
  savings: {
    label: "Savings",
    color: "var(--chart-2)"
  },
  debt: {
    label: "Debt",
    color: "var(--chart-5)"
  },
  investment: {
    label: "Investment",
    color: "var(--chart-1)"
  }
} satisfies ChartConfig;

type CategorySpendsProps = {
  items: BudgetItem[];
  totalConsumed: number;
};

const CategorySpends = ({ items, totalConsumed }: CategorySpendsProps) => {
  const { format } = useCurrency();

  const groupedByType = items.reduce<Record<BudgetCategoryType, number>>(
    (acc, item) => {
      acc[item.categoryType] += item.consumedAmount;
      return acc;
    },
    {
      needs: 0,
      wants: 0,
      savings: 0,
      debt: 0,
      investment: 0
    }
  );

  const donutSegments = (
    Object.entries(groupedByType) as Array<[BudgetCategoryType, number]>
  ).map(([type, value]) => ({
    type,
    value,
    percent: getPercent(value, totalConsumed)
  }));

  const spendingChartData: DonutChartDatum[] = donutSegments.map(segment => ({
    name: segment.type,
    value: segment.value
  }));

  return (
    <Card>
      <CardHeader className="border-b">
        <CardTitle>Category Spends</CardTitle>
        <CardDescription>
          Based on linked transactions tied to each budget item.
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-6 pt-6 md:grid-cols-[320px_1fr]">
        <DonutChart
          data={spendingChartData}
          config={spendingChartConfig}
          className="min-h-[280px]"
          tooltipFormatter={createTooltipFormatter(spendingChartConfig, format)}
        />

        <div className="flex flex-col gap-4">
          {donutSegments.map(segment => (
            <div
              key={segment.type}
              className="flex items-center justify-between rounded-lg border px-3 py-2"
            >
              <div className="flex items-center gap-3">
                <span
                  className="size-3 rounded-full"
                  style={{
                    backgroundColor: spendingChartConfig[segment.type].color
                  }}
                />
                <div>
                  <p className="text-sm font-semibold capitalize">
                    {segment.type}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {segment.percent}% of total spending
                  </p>
                </div>
              </div>
              <span className="text-sm font-semibold">
                {format(groupedByType[segment.type])}
              </span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default CategorySpends;
