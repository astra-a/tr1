import { redirect } from "next/navigation";
import {
  countCategories,
  queryCategories,
} from "@/app/dashboard/_helpers/categories";
import CategoryListPage from "@/app/dashboard/_templates/Categories/CategoryListPage";
import { Where } from "payload";
import { ROUTES } from "@/app/dashboard/_contstants/routes";

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ keywords?: string; limit?: string; page?: string }>;
}) {
  const _searchParams = await searchParams;
  const keywords = _searchParams.keywords;
  const limit = parseInt(_searchParams.limit ?? "10", 10);
  const page = parseInt(_searchParams.page ?? "1", 10);

  const where: Where = {};
  if (keywords) {
    where["title"] = { like: keywords };
  }

  const categoryCount = await countCategories({
    where,
  });
  const categories = await queryCategories({
    where,
    sort: "-updatedAt",
    limit,
    page,
  });

  if (page > 1 && categories.length === 0) {
    return redirect(ROUTES.categories(keywords, page - 1));
  }

  return (
    <CategoryListPage
      categories={categories}
      categoryCount={categoryCount}
      page={page}
    />
  );
}
