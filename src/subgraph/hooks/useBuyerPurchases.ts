import { isAddress } from "viem";
import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { SUBGRAPH_URLS } from "../constants";
import { FetchData } from "./instance";
import { QueryBuyerPurchases } from "./queries";
import { IPurchase } from "../types";

export function useBuyerPurchases(
  chainId?: number,
  buyer?: string | null,
  limit?: number,
  skip?: number,
  refetchInterval?: number,
): UseQueryResult<IPurchase[]> {
  return useQuery({
    queryKey: ["buyer-purchases", chainId, buyer, limit, skip],
    queryFn: async () => {
      const res = await FetchData(SUBGRAPH_URLS[chainId!], {
        query: QueryBuyerPurchases,
        variables: {
          first: limit,
          skip,
          where: {
            buyer: buyer?.toLowerCase(),
          },
        },
      });
      return res?.purchases;
    },
    enabled:
      !!chainId && chainId in SUBGRAPH_URLS && !!buyer && isAddress(buyer),
    refetchOnWindowFocus: true,
    refetchInterval,
    retry: false,
  });
}
