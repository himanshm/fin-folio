import BudgetAnalytics from "@/components/budget/BudgetAnalytics";
import BudgetItems from "@/components/budget/BudgetItems";
import BudgetSummary from "@/components/budget/BudgetSummary";
import { Button } from "@/components/ui/button";
import { budgetData } from "@/dummy-data";

const Budgets = () => {
  const handleCreateBudget = () => {
    // TODO: hook up modal / navigation
    // console.log("Create Budget clicked");
  };

  const handleCreateBudgetItem = () => {
    // TODO: hook up modal for adding budget item
    // console.log("Add Budget Item clicked");
  };

  return (
    <div className="space-y-6">
      <header className="flex items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight pb-1">
            Budgets
          </h1>
          <p className="text-sm text-muted-foreground">
            Overview for the current month.
          </p>
        </div>
        <Button
          size="sm"
          onClick={handleCreateBudget}
          className="cursor-pointer"
        >
          Create Budget
        </Button>
      </header>
      <BudgetSummary budget={budgetData} />
      <BudgetAnalytics budget={budgetData} />
      <BudgetItems
        items={budgetData.items}
        onCreateNewItem={handleCreateBudgetItem}
      />
    </div>
  );
};

export default Budgets;
