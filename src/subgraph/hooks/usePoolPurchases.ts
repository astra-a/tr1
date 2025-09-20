import { isAddress } from "viem";
import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { SUBGRAPH_URLS } from "../constants";
import { FetchData } from "./instance";
import { QueryPoolPurchases } from "./queries";
import { IPurchase } from "../types";

export function usePoolPurchases(
  chainId?: number,
  pool?: string | null,
  claimed?: boolean,
  orderBy?: string,
  orderDirection?: string,
  limit?: number,
  skip?: number,
  refetchInterval?: number,
): UseQueryResult<IPurchase[]> {
  return useQuery({
    queryKey: [
      "pool-purchases",
      chainId,
      pool,
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
            pool: pool?.toLowerCase(),
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
    enabled: !!chainId && chainId in SUBGRAPH_URLS && !!pool && isAddress(pool),
    refetchOnWindowFocus: true,
    refetchInterval,
    retry: false,
  });
}
