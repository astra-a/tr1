import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { SUBGRAPH_URLS } from "../constants";
import { FetchData } from "./instance";
import { QueryPoolPurchases } from "./queries";
import { IPurchase } from "../types";

export function usePoolsPurchases(
  chainId?: number,
  pools?: string[],
  claimed?: boolean,
  orderBy?: string,
  orderDirection?: string,
  limit?: number,
  skip?: number,
  refetchInterval?: number,
): UseQueryResult<IPurchase[]> {
  return useQuery({
    queryKey: [
      "pools-purchases",
      chainId,
      pools,
      claimed,
      orderBy,
      orderDirection,
      limit,
      skip,
    ],
    queryFn: async () => {
      const res = await FetchData(SUBGRAPH_URLS[chainId!], {
        query: QueryPoolPurchases,
        variables: {
          where: {
            pool_in: pools,
            claimed,
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
