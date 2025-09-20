import { isAddress } from "viem";
import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { SUBGRAPH_URLS } from "../constants";
import { FetchData } from "./instance";
import { QueryPoolClaimedPurchases } from "./queries";
import { IPurchase } from "../types";

export function usePoolClaimedPurchases(
  chainId?: number,
  pool?: string | null,
  orderBy?: string,
  orderDirection?: string,
  limit?: number,
  skip?: number,
  refetchInterval?: number,
): UseQueryResult<IPurchase[]> {
  return useQuery({
    queryKey: [
      "pool-claimed-purchases",
      chainId,
      pool,
      orderBy,
      orderDirection,
      limit,
      skip,
    ],
    queryFn: async () => {
      const res = await FetchData(SUBGRAPH_URLS[chainId!], {
        query: QueryPoolClaimedPurchases,
        variables: {
          where: {
            pool: pool?.toLowerCase(),
            claimed: true,
          },
          orderBy,
          orderDirection,
          first: limit,
          skip,
        },
      });
      return res?.purchases;
    },
    enabled: !!chainId && chainId in SUBGRAPH_URLS && !!pool && isAddress(pool),
    refetchOnWindowFocus: true,
    refetchInterval,
    retry: false,
  });
}
