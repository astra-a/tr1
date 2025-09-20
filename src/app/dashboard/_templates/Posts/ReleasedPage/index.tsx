"use client";

import { useMemo, useState } from "react";
import Layout from "@/app/dashboard/_components/Layout";
import Search from "@/app/dashboard/_components/Search";
import Tabs from "@/app/dashboard/_components/Tabs";
import Button from "@/app/dashboard/_components/Button";
import DeleteItems from "@/app/dashboard/_components/DeleteItems";
import NoFound from "@/app/dashboard/_components/NoFound";
import UnpublishItems from "@/app/dashboard/_components/UnpublishItems";
import List from "./List";
import Grid from "./Grid";
import { useSelection } from "@/hooks/useSelection";
import { Post } from "@/payload-types";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { ROUTES } from "@/app/dashboard/_contstants/routes";
import Pagination from "@/app/dashboard/_components/Pagination";
import { useMutation } from "@tanstack/react-query";
import axiosInstance from "@/app/dashboard/_helpers/axios";

const views = [
  { id: 1, name: "grid" },
  { id: 2, name: "list" },
];

const PAGE_SIZE = 10;

const ReleasedPage = ({
  posts,
  postCount,
  page,
}: {
  posts: Post[];
  postCount: number;
  page: number;
}) => {
  const pageCount = useMemo(
    () => Math.ceil(postCount / PAGE_SIZE),
    [postCount],
  );
  const searchParams = useSearchParams();
  const [search, setSearch] = useState(searchParams.get("keywords") ?? "");
  const [view, setView] = useState(views[1]);
  const {
    selectedRows,
    selectAll,
    handleRowSelect,
    handleSelectAll,
    handleDeselect,
  } = useSelection<Post>(posts);

  const router = useRouter();

  const batchOperatePostMutation = useMutation({
    mutationFn: async ({
      operate,
      data,
    }: {
      operate: "unpublish" | "delete";
      data: string[];
    }): Promise<{
      ok: boolean;
      message: string;
      data: { ids: string[] };
    }> => {
      return axiosInstance.post(
        ROUTES.posts_batch_operate_action(operate),
        data,
      );
    },
  });
  const handleBatchOperate = async (operate: "unpublish" | "delete") => {
    try {
      const resp = await batchOperatePostMutation.mutateAsync({
        operate,
        data: selectedRows.map((r) => r.toString()),
      });
      console.log(`handle.${operate}.resp`, resp);
      toast.success(resp.message);
      handleDeselect();
      router.refresh();
    } catch (e: any) {
      toast.error(e?.toString());
    }
  };

  return (
    <Layout title="Released">
      <div className="card">
        {selectedRows.length === 0 ? (
          <div className="flex items-center">
            <div className="pl-5 text-h6 max-lg:pl-3 max-md:mr-auto">Posts</div>
            <Search
              className="w-70 ml-6 mr-auto max-md:hidden"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                router.push(ROUTES.posts_released(e.target.value));
              }}
              placeholder="Search posts"
              isGray
            />
            {search === "" && (
              <Tabs items={views} value={view} setValue={setView} isOnlyIcon />
            )}
          </div>
        ) : (
          <div className="flex items-center">
            <div className="mr-6 pl-5 text-h6">
              {selectedRows.length} post
              {selectedRows.length !== 1 ? "s" : ""} selected
            </div>
            <Button className="mr-auto" isStroke onClick={handleDeselect}>
              Deselect
            </Button>
            <DeleteItems
              counter={selectedRows.length}
              onDelete={() => handleBatchOperate("delete")}
              isLargeButton
            />
            <UnpublishItems
              items={selectedRows}
              onClick={() => handleBatchOperate("unpublish")}
              isLargeButton
            />
          </div>
        )}
        {postCount > 0 ? (
          <div className="p-1 pt-3 max-lg:px-0">
            {view.id === 1 ? (
              <Grid
                posts={posts}
                selectedRows={selectedRows}
                onRowSelect={handleRowSelect}
              />
            ) : (
              <List
                posts={posts}
                selectedRows={selectedRows}
                onRowSelect={handleRowSelect}
                selectAll={selectAll}
                onSelectAll={handleSelectAll}
              />
            )}
            {PAGE_SIZE < postCount && (
              <Pagination
                pageCount={pageCount}
                currentPage={page}
                onPageChange={(_page) => {
                  router.push(ROUTES.posts_released(search, _page));
                }}
              />
            )}
          </div>
        ) : (
          <NoFound title="No posts found" collectionName="posts" />
        )}
      </div>
    </Layout>
  );
};

export default ReleasedPage;
