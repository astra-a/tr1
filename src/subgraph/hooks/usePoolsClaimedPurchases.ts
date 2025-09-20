import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { SUBGRAPH_URLS } from "../constants";
import { FetchData } from "./instance";
import { QueryPoolClaimedPurchases } from "./queries";
import { IPurchase } from "../types";

export function usePoolsClaimedPurchases(
  chainId?: number,
  pools?: string[],
  orderBy?: string,
  orderDirection?: string,
  limit?: number,
  skip?: number,
  refetchInterval?: number,
): UseQueryResult<IPurchase[]> {
  return useQuery({
    queryKey: [
      "pools-claimed-purchases",
      chainId,
      pools,
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
            pool_in: pools,
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
    enabled: !!chainId && chainId in SUBGRAPH_URLS && !!pools?.length,
    refetchOnWindowFocus: true,
    refetchInterval,
    retry: false,
  });
}
