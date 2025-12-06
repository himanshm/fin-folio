import { categoryDriftData } from "@/dummy-data";
import type { BudgetOverview } from "@/types";
import CategoryDrift from "./CategoryDrift";
import CategorySpends from "./CategorySpends";

type BudgetAnalyticsProps = {
  budget: BudgetOverview;
};

const BudgetAnalytics = ({ budget }: BudgetAnalyticsProps) => {
  return (
    <section className="grid gap-6 grid-cols-1 md:grid-cols-2">
      <CategorySpends
        items={budget.items}
        totalConsumed={budget.consumedAmount}
      />
      <CategoryDrift chartData={categoryDriftData} />
    </section>
  );
};

export default BudgetAnalytics;
