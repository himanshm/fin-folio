import BaseLineChart from "@/components/chart/BaseLineChart";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { type ChartConfig } from "@/components/ui/chart";
import { useCurrency } from "@/hooks/useCurrency";

type BurnRatePoint = {
  day: string;
  planned: number;
  actual: number;
};

const burnRateChartConfig = {
  planned: {
    label: "Planned pace",
    color: "var(--chart-1)"
  },
  actual: {
    label: "Actual spending",
    color: "var(--chart-2)"
  }
} satisfies ChartConfig;

type BurnRateProps = {
  planned: number;
  consumed: number;
};

const BudgetBurnRate = ({ planned, consumed }: BurnRateProps) => {
  const { format } = useCurrency();

  // ---- MOCK BURN-RATE DATA (cumulative per day) ----
  const burnRateData: BurnRatePoint[] = [
    { day: "1", planned: planned * 0.05, actual: consumed * 0.04 },
    { day: "5", planned: planned * 0.2, actual: consumed * 0.18 },
    { day: "10", planned: planned * 0.35, actual: consumed * 0.4 },
    { day: "15", planned: planned * 0.5, actual: consumed * 0.55 },
    { day: "20", planned: planned * 0.7, actual: consumed * 0.75 },
    { day: "25", planned: planned * 0.85, actual: consumed * 0.9 },
    { day: "30", planned: planned, actual: consumed }
  ];

  return (
    <Card>
      <CardHeader className="border-b">
        <CardTitle>Burn rate this month</CardTitle>
        <CardDescription>
          Cumulative spending compared to your planned pace across the month.
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-6">
        <BaseLineChart<BurnRatePoint>
          data={burnRateData}
          chartConfig={burnRateChartConfig}
          xKey="day"
          className="min-h-[280px]"
          valueFormatter={value => format(value)}
          lines={[
            { key: "planned", colorVar: "var(--color-planned)" },
            { key: "actual", colorVar: "var(--color-actual)", dashed: true }
          ]}
        />
      </CardContent>
    </Card>
  );
};
export default BudgetBurnRate;
