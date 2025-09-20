import { useQueryClient } from "@tanstack/react-query";
import {
  useAccount,
  useBalance as useWagmiBalance,
  UseBalanceParameters,
  UseBalanceReturnType,
  useWatchBlockNumber,
} from "wagmi";

export interface IBalanceReturnType {
  decimals: number;
  formatted: string;
  symbol: string;
  value: bigint;
}

/**
 * todo: Moving forward, useBalance will only work for native currencies, thus the token parameter is no longer supported. Use useReadContracts instead.
 * @see https://wagmi.sh/react/guides/migrate-from-v1-to-v2#deprecated-usebalance-token-parameter
 * @param parameters
 */
export function useBalance(
  parameters: UseBalanceParameters & { watch?: boolean; interval?: number },
): Omit<UseBalanceReturnType, "data"> & { data?: IBalanceReturnType } {
  const { isConnected } = useAccount();
  const result = useWagmiBalance(parameters);

  const queryClient = useQueryClient();

  useWatchBlockNumber({
    enabled: isConnected && parameters.query?.enabled && !!parameters?.watch,
    onBlockNumber(blockNumber) {
      if (parameters?.interval && parameters.interval > 1) {
        if (Number(blockNumber) % parameters.interval === 0) {
          queryClient.invalidateQueries({ queryKey: result?.queryKey });
        }
      } else {
        queryClient.invalidateQueries({ queryKey: result?.queryKey });
      }
    },
  });

  return result as any;
}
