import { useReadContract } from "wagmi";
import { Address, erc20Abi, isAddress } from "viem";

export function useAllowance(
  chainId?: number,
  token?: { address?: string },
  owner?: string,
  spender?: string | null,
) {
  return useReadContract({
    chainId,
    address: token?.address as Address,
    abi: erc20Abi,
    functionName: "allowance",
    args: [owner as Address, spender as Address],
    query: {
      enabled:
        !!owner &&
        !!spender &&
        !!token?.address &&
        isAddress(spender) &&
        isAddress(token.address),
    },
  });
}
