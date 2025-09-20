import { isAddress } from "viem";
import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { SUBGRAPH_URLS } from "../constants";
import { FetchData } from "./instance";
import { QueryFirstUnclaimPurchase } from "./queries";
import { IPurchase } from "../types";

export function useFirstUnclaimPurchase(
  chainId?: number,
  poolAddress?: string | null,
  account?: string,
  refetchInterval?: number,
): UseQueryResult<IPurchase | null> {
  return useQuery({
    queryKey: ["first-unclaim-purchase", chainId, poolAddress, account],
    queryFn: async () => {
      const res = await FetchData(SUBGRAPH_URLS[chainId!], {
        query: QueryFirstUnclaimPurchase,
        variables: {
          first: 1,
          skip: 0,
          where: {
            pool: poolAddress?.toLowerCase(),
            buyer: account?.toLowerCase(),
            claimed: false,
          },
        },
      });
      return res?.purchases?.[0] ?? null;
    },
    enabled:
      !!chainId &&
      chainId in SUBGRAPH_URLS &&
      !!poolAddress &&
      !!account &&
      isAddress(poolAddress) &&
      isAddress(account),
    refetchOnWindowFocus: true,
    refetchInterval,
    retry: false,
  });
}
