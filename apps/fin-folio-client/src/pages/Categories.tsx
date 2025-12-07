import CategoryItems from "@/components/category/CategoryItems";
import type { Category } from "@/types";

const Categories = () => {
  // TODO: Replace with actual API call
  const categories: Category[] = [];

  const handleCreateCategory = () => {};
  return (
    <CategoryItems
      categories={categories}
      onCreateNewCategory={handleCreateCategory}
    />
  );
};

export default Categories;
