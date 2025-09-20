import { useReadContract } from "wagmi";
import { Address, isAddress } from "viem";
import { BondingPoolABI } from "../artifacts";

export function usePoolTotalSold(
  chainId?: number,
  poolAddress?: string | null,
) {
  return useReadContract({
    chainId,
    address: poolAddress as Address,
    abi: BondingPoolABI,
    functionName: "totalSold",
    query: {
      enabled: !!poolAddress && isAddress(poolAddress),
    },
  });
}
