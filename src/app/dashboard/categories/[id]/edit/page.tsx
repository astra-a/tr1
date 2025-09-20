import { notFound } from "next/navigation";
import {
  getCategoryList,
  queryCategories,
  queryCategoryById,
} from "@/app/dashboard/_helpers/categories";
import CategoryForm from "@/app/dashboard/_templates/Categories/CategoryForm";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const category = await queryCategoryById({ id });
  console.log("category", category);

  if (!category) {
    return notFound();
  }

  const rawCategories = await queryCategories({
    sort: ["parent", "createdAt"],
    pagination: false,
  });

  return (
    <CategoryForm
      category={category}
      categoryList={getCategoryList(rawCategories, [category.id])}
      pageTitle="Edit category"
    />
  );
}
