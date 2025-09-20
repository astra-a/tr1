"use client";

import { useMemo, useState } from "react";
import Layout from "@/app/dashboard/_components/Layout";
import Search from "@/app/dashboard/_components/Search";
import Tabs from "@/app/dashboard/_components/Tabs";
import Button from "@/app/dashboard/_components/Button";
import DeleteItems from "@/app/dashboard/_components/DeleteItems";
import NoFound from "@/app/dashboard/_components/NoFound";
import List from "./List";
import Grid from "./Grid";
import { useSelection } from "@/hooks/useSelection";
import { Media } from "@/payload-types";
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
  mediaArray,
  mediaCount,
  page,
}: {
  mediaArray: Media[];
  mediaCount: number;
  page: number;
}) => {
  const pageCount = useMemo(
    () => Math.ceil(mediaCount / PAGE_SIZE),
    [mediaCount],
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
  } = useSelection<Media>(mediaArray);

  const router = useRouter();

  const batchDeleteMediaMutation = useMutation({
    mutationFn: async (
      data: string[],
    ): Promise<{
      ok: boolean;
      message: string;
      data: { ids: string[] };
    }> => {
      return axiosInstance.post(ROUTES.media_batch_delete_action, data);
    },
  });
  const handleBatchDelete = async () => {
    try {
      const resp = await batchDeleteMediaMutation.mutateAsync(
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
    <Layout title="Media List" createButtonUrl={ROUTES.media_new}>
      <div className="card">
        {selectedRows.length === 0 ? (
          <div className="flex items-center">
            <div className="pl-5 text-h6 max-lg:pl-3 max-md:mr-auto">Media</div>
            <Search
              className="w-70 ml-6 mr-auto max-md:hidden"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                router.push(ROUTES.media(e.target.value));
              }}
              placeholder="Search media"
              isGray
            />
            {search === "" && (
              <Tabs items={views} value={view} setValue={setView} isOnlyIcon />
            )}
          </div>
        ) : (
          <div className="flex items-center">
            <div className="mr-6 pl-5 text-h6">
              {selectedRows.length} media selected
            </div>
            <Button className="mr-auto" isStroke onClick={handleDeselect}>
              Deselect
            </Button>
            <DeleteItems
              counter={selectedRows.length}
              onDelete={handleBatchDelete}
              isLargeButton
            />
          </div>
        )}
        {mediaCount > 0 ? (
          <div className="p-1 pt-3 max-lg:px-0">
            {view.id === 1 ? (
              <Grid
                mediaArray={mediaArray}
                selectedRows={selectedRows}
                onRowSelect={handleRowSelect}
              />
            ) : (
              <List
                mediaArray={mediaArray}
                selectedRows={selectedRows}
                onRowSelect={handleRowSelect}
                selectAll={selectAll}
                onSelectAll={handleSelectAll}
              />
            )}
            {PAGE_SIZE < mediaCount && (
              <Pagination
                pageCount={pageCount}
                currentPage={page}
                onPageChange={(_page) => {
                  router.push(ROUTES.media(search, _page));
                }}
              />
            )}
          </div>
        ) : (
          <NoFound title="No media found" collectionName="media" />
        )}
      </div>
    </Layout>
  );
};

export default ReleasedPage;
