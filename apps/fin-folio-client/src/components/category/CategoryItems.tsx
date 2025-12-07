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
import type { Category } from "@/types";
import { Plus, Settings, User } from "lucide-react";

type CategoryItemsProps = {
  categories: Category[];
  onCreateNewCategory: () => void;
};
const CategoryItems = ({
  categories,
  onCreateNewCategory
}: CategoryItemsProps) => {
  const { format } = useCurrency();
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between gap-4 border-b">
        <div>
          <CardTitle className="pb-2">Categories</CardTitle>
          <CardDescription>
            Manage your budget and transaction categories
          </CardDescription>
        </div>
        <Button
          size="sm"
          variant="outline"
          className="shrink-0 cursor-pointer"
          onClick={onCreateNewCategory}
        >
          <Plus className="mr-2 size-4" />
          New Category
        </Button>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="hidden text-sm font-medium text-muted-foreground md:grid md:grid-cols-[2fr_1fr_1fr_1fr] md:gap-4">
          <span>Title</span>
          <span>Type</span>
          <span>Bucket</span>
          <span>Accumulated</span>
        </div>
        <Separator className="my-4" />
        <div className="space-y-4">
          {categories.map(category => {
            const isSystemCategory = category.origin === "SYSTEM";

            return (
              <div
                key={category.id}
                className="grid gap-3 rounded-xl border p-4 text-sm md:grid-cols-[2fr_1fr_1fr_1fr]"
              >
                <div>
                  <p className="font-semibold">{category.title}</p>
                  <p className="text-xs uppercase text-muted-foreground flex items-center gap-1">
                    {isSystemCategory ? (
                      <Settings className="size-3" />
                    ) : (
                      <User className="size-3" />
                    )}
                    {category.type}
                  </p>
                </div>
                <div>
                  <p className="font-semibold">{category.type}</p>
                  <p className="text-xs text-muted-foreground">Type</p>
                </div>
                <div>
                  <p className="font-semibold capitalize">{category.bucket}</p>
                  <p className="text-xs text-muted-foreground">Bucket</p>
                </div>
                <div>
                  <p className="font-semibold">
                    {format(category.accumulatedAmount)}
                  </p>
                  <p className="text-xs text-muted-foreground">Accumulated</p>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

export default CategoryItems;
