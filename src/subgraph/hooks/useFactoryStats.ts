import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { SUBGRAPH_URLS } from "../constants";
import { FetchData } from "./instance";
import { QueryFactoryStats } from "./queries";
import { IFactory } from "../types";
import { isAddress } from "viem";

export function useFactoryStats(
  chainId?: number,
  factoryAddress?: string,
  refetchInterval?: number,
): UseQueryResult<Omit<IFactory, "id" | "saleToken">> {
  return useQuery({
    queryKey: ["factory-stats", chainId, factoryAddress],
    queryFn: async () => {
      const res = await FetchData(SUBGRAPH_URLS[chainId!], {
        query: QueryFactoryStats,
        variables: {
          id: factoryAddress?.toLowerCase(),
        },
      });
      return res?.factory;
    },
    enabled:
      !!chainId &&
      chainId in SUBGRAPH_URLS &&
      !!factoryAddress &&
      isAddress(factoryAddress),
    refetchOnWindowFocus: true,
    refetchInterval,
    retry: false,
  });
}
