import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { SUBGRAPH_URLS } from "../constants";
import { FetchData } from "./instance";
import { QueryTokensStats } from "./queries";
import { IToken } from "../types";

export function useTokensStats(
  chainId?: number,
  tokens?: string[],
  limit?: number,
  skip?: number,
  refetchInterval?: number,
): UseQueryResult<
  Pick<IToken, "id" | "totalIncomeAmount" | "totalSold" | "totalRewarded">[]
> {
  return useQuery({
    queryKey: ["tokens-stats", chainId, tokens, limit, skip],
    queryFn: async () => {
      const res = await FetchData(SUBGRAPH_URLS[chainId!], {
        query: QueryTokensStats,
        variables: {
          first: limit,
          skip,
          where: {
            id_in: tokens,
          },
        },
      });
      return res?.tokens;
    },
    enabled: !!chainId && chainId in SUBGRAPH_URLS && !!tokens?.length,
    refetchOnWindowFocus: true,
    refetchInterval,
    retry: false,
  });
}
