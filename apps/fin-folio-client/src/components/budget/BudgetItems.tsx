import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useCurrency } from "@/hooks/useCurrency";
import { cn, getPercent } from "@/lib/utils";
import type { BudgetItem } from "@/types";
import { AlertTriangle, ArrowDownRight, Plus } from "lucide-react";

type BudgetItemsProps = {
  items: BudgetItem[];
  onCreateNewItem: () => void;
};
const BudgetItems = ({ items, onCreateNewItem }: BudgetItemsProps) => {
  const { format } = useCurrency();
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between gap-4 border-b">
        <div>
          <CardTitle className="pb-2">Budget Breakdown</CardTitle>
          <CardDescription>
            Planned vs Actual spending across categories
          </CardDescription>
        </div>
        <Button
          size="sm"
          variant="outline"
          className="shrink-0"
          onClick={onCreateNewItem}
        >
          <Plus className="mr-2 size-4" />
          New Item
        </Button>
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
          {items.map(item => {
            const spentPercent = getPercent(
              item.consumedAmount,
              item.budgetAmount
            );
            const isOver = item.consumedAmount > item.budgetAmount;

            return (
              <div
                key={item.id}
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
                  <p className="font-semibold">{format(item.consumedAmount)}</p>
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
  );
};

export default BudgetItems;
