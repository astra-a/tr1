"use client";

import BigNumber from "bignumber.js";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { MoonLoader } from "react-spinners";
import { Address, erc20Abi, parseUnits } from "viem";
import {
  useAccount,
  useWaitForTransactionReceipt,
  useWriteContract,
} from "wagmi";
import { useShallow } from "zustand/react/shallow";
import { ONE_BYTES32, IToken } from "@/web3";
import { useWalletStore } from "@/stores";

export function TokenApproveButton({
  token,
  spender,
  amount,
  onSuccess,
  buttonClass = "btn-main w-full flex justify-center items-center gap-2 py-3.5 rounded-md text-lg font-semibold text-jet-black",
  storeTransaction,
}: {
  token: Omit<IToken, "chainId" | "logo">;
  spender: string;
  amount?: string;
  onSuccess?: () => void;
  buttonClass?: string;
  storeTransaction?: boolean;
}) {
  const { address: account, chain, isConnected } = useAccount();
  const [addTransaction] = useWalletStore(
    useShallow((state) => [state.addTransaction]),
  );

  const [isTxPending, setIsTxPending] = useState(false);
  const {
    data: txHash,
    status: txWriteStatus,
    writeContractAsync,
  } = useWriteContract();
  const { status: txWaitStatus } = useWaitForTransactionReceipt({
    hash: txHash,
    query: { enabled: "success" === txWriteStatus },
  });
  useEffect(() => {
    console.log("approve.tx.status", token.symbol, {
      txWriteStatus,
      txWaitStatus,
    });
    if (
      "success" === txWriteStatus &&
      ["success", "error"].includes(txWaitStatus)
    ) {
      setIsTxPending(false);
    }
    if ("success" === txWriteStatus && "success" === txWaitStatus) {
      onSuccess?.();
    }
  }, [txWriteStatus, txWaitStatus]);

  const sendTransaction = () => {
    if (!isConnected) return;
    setIsTxPending(true);
    writeContractAsync({
      account,
      address: token.address as Address,
      abi: erc20Abi,
      functionName: "approve",
      args: [
        spender as Address,
        amount
          ? parseUnits(
              BigNumber(amount).toFixed(token.decimals),
              token.decimals,
            )
          : BigInt(ONE_BYTES32),
      ],
    })
      .then((hash) => {
        console.log("approve.tx.hash", token.symbol, hash);
        if (storeTransaction) {
          addTransaction({
            timestamp: dayjs().unix(),
            action: "erc20-approve",
            owner: account!,
            chainId: chain?.id ?? 0,
            hash,
            status: "pending",
            content: {
              token,
              amount: amount ?? ONE_BYTES32,
            },
          });
        }
      })
      .catch((e) => {
        setIsTxPending(false);
        console.error("approve.tx.err", e);
      });
  };

  return (
    <button
      type="button"
      className={`${buttonClass} ${isTxPending ? "pending cursor-not-allowed" : "cursor-pointer"}`}
      disabled={isTxPending}
      onClick={(e) => {
        e.stopPropagation();
        sendTransaction();
      }}
    >
      Approve {token.symbol}
      {isTxPending && <MoonLoader size={20} color="#0e0e0e" />}
    </button>
  );
}
