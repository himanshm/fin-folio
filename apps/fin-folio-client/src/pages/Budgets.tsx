import BudgetAnalytics from "@/components/budget/BudgetAnalytics";
import BudgetSummary from "@/components/budget/BudgetSummary";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { budgetData } from "@/dummy-data";
import { useCurrency } from "@/hooks/useCurrency";
import { cn } from "@/lib/utils";
import { AlertTriangle, ArrowDownRight } from "lucide-react";

const getPercent = (part: number, total: number) => {
  if (total <= 0) return 0;
  return Math.min(100, Math.round((part / total) * 100));
};

const Budgets = () => {
  const { format } = useCurrency();

  return (
    <div className="space-y-6">
      <BudgetSummary budget={budgetData} />
      <BudgetAnalytics budget={budgetData} />

      <Card>
        <CardHeader className="border-b">
          <CardTitle>Budget items</CardTitle>
          <CardDescription>
            Connects directly to `Budgets` and `BudgetItems` models to map plan
            vs actual per category.
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="hidden text-sm font-medium text-muted-foreground md:grid md:grid-cols-[2fr_1fr_1fr_1fr] md:gap-4">
            <span>Category</span>
            <span>Planned</span>
            <span>Consumed</span>
            <span>Status</span>
          </div>
          <Separator className="my-4" />
          <div className="space-y-4">
            {budgetData.items.map(item => {
              const spentPercent = getPercent(
                item.consumedAmount,
                item.budgetAmount
              );
              const isOver = item.consumedAmount > item.budgetAmount;

              return (
                <div
                  key={item.publicId}
                  className="grid gap-3 rounded-xl border p-4 text-sm md:grid-cols-[2fr_1fr_1fr_1fr]"
                >
                  <div>
                    <p className="font-semibold">{item.category}</p>
                    <p className="text-xs uppercase text-muted-foreground">
                      {item.categoryType}
                    </p>
                  </div>
                  <div>
                    <p className="font-semibold">{format(item.budgetAmount)}</p>
                    <p className="text-xs text-muted-foreground">Planned</p>
                  </div>
                  <div>
                    <p className="font-semibold">
                      {format(item.consumedAmount)}
                    </p>
                    <div className="mt-2 h-2 rounded-full bg-muted">
                      <div
                        className={cn(
                          "h-full rounded-full transition-all",
                          isOver ? "bg-rose-500" : "bg-emerald-500"
                        )}
                        style={{
                          width: `${Math.min(spentPercent, 100)}%`
                        }}
                      />
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-xs">
                    {isOver ? (
                      <>
                        <AlertTriangle className="size-4 text-rose-500" />
                        <span className="font-semibold text-rose-500">
                          Over by{" "}
                          {format(item.consumedAmount - item.budgetAmount)}
                        </span>
                      </>
                    ) : (
                      <>
                        <ArrowDownRight className="size-4 text-emerald-500" />
                        <span className="font-semibold text-emerald-500">
                          {100 - spentPercent}% remaining
                        </span>
                      </>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Budgets;
