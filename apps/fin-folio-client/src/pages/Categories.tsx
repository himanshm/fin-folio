import { Button } from "@/components/ui/button";

const Categories = () => {
  const handleCreateCategory = () => {};
  return (
    <div className="space-y-6">
      <header className="flex items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight pb-1">
            Categories
          </h1>
          <p className="text-sm text-muted-foreground">
            Budget and transaction categories overview
          </p>
        </div>
        <Button
          size="sm"
          onClick={handleCreateCategory}
          className="cursor-pointer"
        >
          Create Category
        </Button>
      </header>
    </div>
  );
};

export default Categories;
