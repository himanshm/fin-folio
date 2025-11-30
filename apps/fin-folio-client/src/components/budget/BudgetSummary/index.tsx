import type { DonutChartDatum } from "@/components/chart/DonutChart";
import { getPercent } from "@/lib/utils";
import type { BudgetOverview } from "@/types";
import ActualSpend from "./ActualSpend";
import IncomeExpenseSummary from "./IncomeExpenseSummary";
import PlannedBudget from "./PlannedBudget";

type BudgetSummaryProps = {
  budget: BudgetOverview;
};

const BudgetSummary = ({ budget }: BudgetSummaryProps) => {
  const plannedBudget = budget.budgetAmount;
  const consumedBudget = budget.consumedAmount;
  const budgetIncome = budget.income;
  const remainingBudget = Math.max(plannedBudget - consumedBudget, 0);
  const coverage = getPercent(consumedBudget, plannedBudget);
  const isOverBudget = consumedBudget > plannedBudget;
  const isOnBudget = consumedBudget === plannedBudget;

  const planVsActualData = [
    {
      label: "Budget",
      planned: plannedBudget,
      consumed: consumedBudget
    }
  ];

  const plannedBudgetDonutData: DonutChartDatum[] = [
    { name: "consumed", value: consumedBudget },
    { name: "remaining", value: remainingBudget }
  ];

  const incomeVsExpenseData = [
    {
      label: "This Month",
      income: budgetIncome,
      expense: consumedBudget
    }
  ];

  return (
    <section className="grid gap-4 md:grid-cols-3">
      {/* Planned Budget */}
      <PlannedBudget
        planned={plannedBudget}
        remaining={remainingBudget}
        coverage={coverage}
        plannedBudgetPieData={plannedBudgetDonutData}
      />
      {/* Actual Spending */}
      <ActualSpend
        planned={plannedBudget}
        consumed={consumedBudget}
        chartData={planVsActualData}
        onBudget={isOnBudget}
        overBudget={isOverBudget}
      />
      {/* Income vs Expenses summary */}
      <IncomeExpenseSummary
        income={budgetIncome}
        consumed={consumedBudget}
        chartData={incomeVsExpenseData}
      />
    </section>
  );
};
export default BudgetSummary;
