"use client";

import { useMemo, useState } from "react";
import Layout from "@/app/dashboard/_components/Layout";
import Search from "@/app/dashboard/_components/Search";
import Button from "@/app/dashboard/_components/Button";
import DeleteItems from "@/app/dashboard/_components/DeleteItems";
import NoFound from "@/app/dashboard/_components/NoFound";
import List from "./List";
import { useSelection } from "@/hooks/useSelection";
import { Category } from "@/payload-types";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { ROUTES } from "@/app/dashboard/_contstants/routes";
import Pagination from "@/app/dashboard/_components/Pagination";
import { useMutation } from "@tanstack/react-query";
import axiosInstance from "@/app/dashboard/_helpers/axios";

const PAGE_SIZE = 10;

const CategoryListPage = ({
  categories,
  categoryCount,
  page,
}: {
  categories: Category[];
  categoryCount: number;
  page: number;
}) => {
  const pageCount = useMemo(
    () => Math.ceil(categoryCount / PAGE_SIZE),
    [categoryCount],
  );
  const searchParams = useSearchParams();
  const [search, setSearch] = useState(searchParams.get("keywords") ?? "");
  const {
    selectedRows,
    selectAll,
    handleRowSelect,
    handleSelectAll,
    handleDeselect,
  } = useSelection<Category>(categories);

  const router = useRouter();

  const batchDeleteCategoryMutation = useMutation({
    mutationFn: async (
      data: string[],
    ): Promise<{
      ok: boolean;
      message: string;
      data: { ids: string[] };
    }> => {
      return axiosInstance.post(ROUTES.categories_batch_delete_action, data);
    },
  });
  const handleBatchDelete = async () => {
    try {
      const resp = await batchDeleteCategoryMutation.mutateAsync(
        selectedRows.map((r) => r.toString()),
      );
      console.log(`handle.delete.resp`, resp);
      toast.success(resp.message);
      handleDeselect();
      router.refresh();
    } catch (e: any) {
      toast.error(e?.toString());
    }
  };

  return (
    <Layout title="Categories" createButtonUrl={ROUTES.categories_new}>
      <div className="card">
        {selectedRows.length === 0 ? (
          <div className="flex items-center">
            <div className="pl-5 text-h6 max-lg:pl-3 max-md:mr-auto">
              Categories
            </div>
            <Search
              className="w-70 ml-6 mr-auto max-md:hidden"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                router.push(ROUTES.categories(e.target.value));
              }}
              placeholder="Search categories"
              isGray
            />
          </div>
        ) : (
          <div className="flex items-center">
            <div className="mr-6 pl-5 text-h6">
              {selectedRows.length}
              {selectedRows.length !== 1 ? " categories" : " category"} selected
            </div>
            <Button className="mr-auto" isStroke onClick={handleDeselect}>
              Deselect
            </Button>
            <DeleteItems
              counter={selectedRows.length}
              content={`This will definitely delete ${
                selectedRows.length > 1
                  ? `${selectedRows.length} categories`
                  : "this category"
              }, and all data will be removed. This action cannot be undone.`}
              onDelete={handleBatchDelete}
              isLargeButton
            />
          </div>
        )}
        {categoryCount > 0 ? (
          <div className="p-1 pt-3 max-lg:px-0">
            <List
              categories={categories}
              selectedRows={selectedRows}
              onRowSelect={handleRowSelect}
              selectAll={selectAll}
              onSelectAll={handleSelectAll}
            />
            {PAGE_SIZE < categoryCount && (
              <Pagination
                pageCount={pageCount}
                currentPage={page}
                onPageChange={(_page) => {
                  router.push(ROUTES.categories(search, _page));
                }}
              />
            )}
          </div>
        ) : (
          <NoFound title="No categories found" collectionName="categories" />
        )}
      </div>
    </Layout>
  );
};

export default CategoryListPage;
