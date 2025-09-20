import { Category } from "@/payload-types";
import CategoryForm from "@/app/dashboard/_templates/Categories/CategoryForm";
import {
  getCategoryList,
  queryCategories,
} from "@/app/dashboard/_helpers/categories";

export default async function Page() {
  const category: Category = {
    id: "",
    slug: null,
    slugLock: null,
    title: "",
    parent: null,
    createdAt: "",
    updatedAt: "",
  };

  const rawCategories = await queryCategories({
    sort: ["parent", "createdAt"],
    pagination: false,
  });

  return (
    <CategoryForm
      category={category}
      categoryList={getCategoryList(rawCategories)}
      pageTitle="New Category"
    />
  );
}
