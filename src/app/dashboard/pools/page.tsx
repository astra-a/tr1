import PoolsPage from "@/app/dashboard/_templates/Pools/PoolsPage";
import { Where } from "payload";
import { POOL_STATUS } from "@/constants";
import { countPools, queryPools } from "@/app/dashboard/_helpers/pools";
import { redirect } from "next/navigation";
import { ROUTES } from "@/app/dashboard/_contstants/routes";

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{
    status?: string;
    keywords?: string;
    limit?: string;
    page?: string;
  }>;
}) {
  const _searchParams = await searchParams;
  const keywords = _searchParams.keywords;
  const status = _searchParams.status;
  const limit = parseInt(_searchParams.limit ?? "10", 10);
  const page = parseInt(_searchParams.page ?? "1", 10);

  const where: Where = {
    status: {
      in: [
        POOL_STATUS.Active,
        POOL_STATUS.Paused,
        POOL_STATUS.Stopped,
        POOL_STATUS.Creating,
        POOL_STATUS.SoldOut,
        POOL_STATUS.Upcoming,
      ],
    },
  };
  if (status) {
    where["status"] = { equals: status };
  }
  if (keywords) {
    where["name"] = { like: keywords };
  }
  const poolCount = await countPools({
    where,
  });
  const pools = await queryPools({
    where,
    sort: "-createdAt",
    limit,
    page,
  });

  if (page > 1 && pools.length === 0) {
    return redirect(ROUTES.pools(status, keywords, page - 1));
  }

  return <PoolsPage pools={pools} poolCount={poolCount} page={page} />;
}
