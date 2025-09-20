import LaunchpadList from "../_components/Launchpad";
import { queryPools } from "@/app/dashboard/_helpers/pools";
import { POOL_STATUS } from "@/constants";

export const revalidate = 0;

export default async function Page() {
  // Page({searchParams }: { searchParams: Promise<{ code?: string }> })
  // const _searchParams = await searchParams;
  // const code = _searchParams.code;
  // if (!code) {
  //   return redirect(`/launchpad?code=QS2875`);
  // }

  const pools = await queryPools({
    where: {
      or: [
        {
          status: {
            in: [POOL_STATUS.Active, POOL_STATUS.SoldOut, POOL_STATUS.Upcoming],
          },
        },
        {
          status: {
            equals: POOL_STATUS.Paused,
          },
          isHidden: {
            equals: false,
          },
        },
      ],
    },
    sort: "-createdAt",
    pagination: false,
  });

  return <LaunchpadList pools={pools} />;
}
