import ChartCard from "@/components/dashboard/ChartCard";
import StatCard from "@/components/dashboard/StatCard";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { useCurrency } from "@/hooks/useCurrency";
import { ArrowDownRight, ArrowUpRight } from "lucide-react";

const Dashboard = () => {
  const { format } = useCurrency();
  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Income"
          value={format(4438)}
          icon={ArrowUpRight}
          trend={{ value: 12.5, isPositive: true }}
        />
        <StatCard
          title="Expenses"
          value={format(2721)}
          icon={ArrowDownRight}
          trend={{ value: 5.2, isPositive: false }}
        />
        <StatCard
          title="Savings"
          value={format(2721)}
          icon={ArrowDownRight}
          trend={{ value: 5.2, isPositive: false }}
        />
        <StatCard
          title="Investments"
          value={format(2721)}
          icon={ArrowDownRight}
          trend={{ value: 5.2, isPositive: false }}
        />
      </div>

      {/* Charts Row */}
      <div className="grid gap-4 md:grid-cols-2">
        <ChartCard
          title="Spending"
          action={
            <Button variant="outline" size="sm">
              View All
            </Button>
          }
        >
          {/* TODO: donut chart component goes here */}
          <div className="h-[300px] flex items-center justify-center text-muted-foreground">
            Donut Chart Placeholder
          </div>
        </ChartCard>

        <ChartCard
          title="Income vs. Expenses"
          action={
            <Button variant="outline" size="sm">
              Add Transaction
            </Button>
          }
        >
          {/* Your line chart component goes here */}
          <div className="h-[300px] flex items-center justify-center text-muted-foreground">
            Line Chart Placeholder
          </div>
        </ChartCard>
      </div>

      {/* Recent Transactions */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Transactions</CardTitle>
          <CardDescription>Your latest financial activities</CardDescription>
        </CardHeader>
        <CardContent>
          {/* TODO: transactions table goes here */}
          <div className="flex items-center justify-center h-[200px] text-muted-foreground">
            Transactions Table Placeholder
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;
