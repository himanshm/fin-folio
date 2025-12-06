import { categoryDriftData } from "@/dummy-data";
import type { BudgetOverview } from "@/types";
import BudgetBurnRate from "../BudgetBurnRate";
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
      <BudgetBurnRate
        planned={budget.budgetAmount}
        consumed={budget.consumedAmount}
      />
    </section>
  );
};

export default BudgetAnalytics;
