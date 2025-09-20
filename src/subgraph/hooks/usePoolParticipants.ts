import { isAddress } from "viem";
import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { SUBGRAPH_URLS } from "../constants";
import { FetchData } from "./instance";
import { QueryPoolParticipants } from "./queries";
import { IPool } from "../types";

export function usePoolParticipants(
  chainId?: number,
  poolAddress?: string | null,
  refetchInterval?: number,
): UseQueryResult<Pick<IPool, "id" | "participants">> {
  return useQuery({
    queryKey: ["pool-participants", chainId, poolAddress],
    queryFn: async () => {
      const res = await FetchData(SUBGRAPH_URLS[chainId!], {
        query: QueryPoolParticipants,
        variables: {
          poolAddr: poolAddress?.toLowerCase(),
        },
      });
      return res?.pool ?? null;
    },
    enabled:
      !!chainId &&
      chainId in SUBGRAPH_URLS &&
      !!poolAddress &&
      isAddress(poolAddress),
    refetchOnWindowFocus: true,
    refetchInterval,
    retry: false,
  });
}
