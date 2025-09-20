import { useReadContract, UseReadContractReturnType } from "wagmi";
import { Address, isAddress } from "viem";
import { BondingPoolABI } from "../artifacts";
import { useMemo } from "react";
import { POOL_STATUS } from "@/constants";

export function usePoolStatus(
  chainId?: number,
  poolAddress?: string | null,
): Omit<UseReadContractReturnType, "data"> & { data?: POOL_STATUS } {
  const resp = useReadContract({
    chainId,
    address: poolAddress as Address,
    abi: BondingPoolABI,
    functionName: "getPoolStatus",
    query: {
      enabled: !!poolAddress && isAddress(poolAddress),
    },
  });

  return useMemo(() => {
    if (undefined === resp.data) {
      return resp;
    } else {
      return {
        ...resp,
        data:
          resp.data === 0
            ? POOL_STATUS.Active
            : resp.data === 1
              ? POOL_STATUS.Paused
              : POOL_STATUS.Stopped,
      };
    }
  }, [resp.data]);
}
