import { isAddress } from "viem";
import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { SUBGRAPH_URLS } from "../constants";
import { FetchData } from "./instance";
import { QueryBuyerStats } from "./queries";
import { IBuyer } from "../types";

export function useBuyerStats(
  chainId?: number,
  account?: string | null,
  refetchInterval?: number,
): UseQueryResult<Omit<IBuyer, "id">> {
  return useQuery({
    queryKey: ["buyer-stats", chainId, account],
    queryFn: async () => {
      const res = await FetchData(SUBGRAPH_URLS[chainId!], {
        query: QueryBuyerStats,
        variables: {
          account: account?.toLowerCase(),
        },
      });
      return res?.buyer ?? null;
    },
    enabled:
      !!chainId && chainId in SUBGRAPH_URLS && !!account && isAddress(account),
    refetchOnWindowFocus: true,
    refetchInterval,
    retry: false,
  });
}
