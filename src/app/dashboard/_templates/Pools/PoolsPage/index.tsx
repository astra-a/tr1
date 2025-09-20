"use client";

import { useMemo, useState } from "react";
import Layout from "@/app/dashboard/_components/Layout";
import Search from "@/app/dashboard/_components/Search";
import NoFound from "@/app/dashboard/_components/NoFound";
import { Pool } from "@/payload-types";
import { useRouter, useSearchParams } from "next/navigation";
import { ROUTES } from "@/app/dashboard/_contstants/routes";
import Pagination from "@/app/dashboard/_components/Pagination";
import { PoolStatusList } from "@/constants";
import List from "./List";
import Tabs from "./Tabs";

const FilterOptions = [{ label: "All", value: "" }, ...PoolStatusList];

const PAGE_SIZE = 10;

const PoolsPage = ({
  pools,
  poolCount,
  page,
}: {
  pools: Pool[];
  poolCount: number;
  page: number;
}) => {
  const pageCount = useMemo(
    () => Math.ceil(poolCount / PAGE_SIZE),
    [poolCount],
  );
  const searchParams = useSearchParams();
  const [search, setSearch] = useState(searchParams.get("keywords") ?? "");
  const [filterStatus, setFilterStatus] = useState(FilterOptions[0]);

  const router = useRouter();

  return (
    <Layout title="Pools" createButtonUrl={ROUTES.pools_new}>
      <div className="card">
        <div className="flex items-center max-md:h-12">
          <div className="pl-5 text-h6 max-lg:mr-auto max-lg:pl-3">Pools</div>
          <Search
            className="w-70 ml-6 mr-auto max-lg:hidden"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              router.push(ROUTES.pools(filterStatus.value, e.target.value));
            }}
            placeholder="Search pools"
            isGray
          />
          {search === "" && (
            <Tabs
              className="max-md:hidden"
              items={FilterOptions}
              value={filterStatus}
              setValue={(val) => {
                setFilterStatus(val);
                router.push(ROUTES.pools(val.value, search));
              }}
            />
          )}
        </div>
        {poolCount > 0 ? (
          <div className="p-1 pt-3 max-lg:px-0">
            <List pools={pools} />
            {PAGE_SIZE < poolCount && (
              <Pagination
                pageCount={pageCount}
                currentPage={page}
                onPageChange={(_page) => {
                  router.push(ROUTES.pools(filterStatus.value, search, _page));
                }}
              />
            )}
          </div>
        ) : (
          <NoFound title="No pools found" collectionName="pools" />
        )}
      </div>
    </Layout>
  );
};

export default PoolsPage;
