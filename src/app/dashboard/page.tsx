import HomePage from "@/app/dashboard/_templates/HomePage";
import { queryPools } from "@/app/dashboard/_helpers/pools";
import { holesky } from "viem/chains";
import { POOL_STATUS } from "@/constants";

export default async function Page() {
  const chain = holesky;
  const pools = await queryPools({
    where: {
      chainId: {
        equals: chain.id,
      },
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
    },
    pagination: false,
  });

  return <HomePage chain={chain} pools={pools} />;
}
