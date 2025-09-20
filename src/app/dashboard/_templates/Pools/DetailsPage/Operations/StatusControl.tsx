"use client";

import { useEffect, useState } from "react";
import Button from "@/app/dashboard/_components/Button";
import { Pool } from "@/payload-types";
import {
  useAccount,
  useReadContract,
  useWaitForTransactionReceipt,
  useWriteContract,
} from "wagmi";
import { Address, isAddress } from "viem";
import { BondingPoolABI, DEFAULT_ADMIN_ROLE, OPERATOR_ROLE } from "@/web3";
import { toast } from "sonner";
import { MoonLoader } from "react-spinners";

const StatusControl = ({
  pool,
  action,
  buttonText,
  buttonClassName,
  txSent,
}: {
  pool: Pool;
  action: "unpause" | "pause" | "stop";
  buttonText: string;
  buttonClassName: string;
  txSent?: () => void;
}) => {
  const { address: account, chainId, isConnected } = useAccount();

  // --- check:
  const { data: hasAdminRole } = useReadContract({
    chainId: pool.chainId,
    address: pool.address as Address,
    abi: BondingPoolABI,
    functionName: "hasRole",
    args: [DEFAULT_ADMIN_ROLE, account as Address],
    query: {
      enabled: !!account && !!pool.address && isAddress(pool.address),
    },
  });
  const { data: hasOperatorRole } = useReadContract({
    chainId: pool.chainId,
    address: pool.address as Address,
    abi: BondingPoolABI,
    functionName: "hasRole",
    args: [OPERATOR_ROLE, account as Address],
    query: {
      enabled: !!account && !!pool.address && isAddress(pool.address),
    },
  });

  // send transaction
  const [isTxPending, setIsTxPending] = useState(false);
  const {
    data: txHash,
    status: txWriteStatus,
    writeContractAsync,
    error: writeError,
  } = useWriteContract();
  const { status: txWaitStatus, error: waitError } =
    useWaitForTransactionReceipt({
      chainId: pool.chainId,
      hash: txHash,
      query: { enabled: "success" === txWriteStatus },
    });
  useEffect(() => {
    console.log(`${action}.tx.status`, {
      txWriteStatus,
      txWaitStatus,
      writeError,
      waitError,
    });
    if (
      "success" === txWriteStatus &&
      ["success", "error"].includes(txWaitStatus)
    ) {
      setIsTxPending(false);
    }
  }, [txWriteStatus, txWaitStatus, writeError, waitError]);
  const sendTransaction = () => {
    if (isTxPending) return;
    if (!isConnected) {
      toast.error("Please connect wallet");
      return;
    }
    if (chainId !== pool.chainId) {
      toast.error(`Please switch to ${pool.network}`);
      return;
    }
    if (["unpause", "pause"].includes(action)) {
      if (!hasOperatorRole) {
        toast.error(`Account is not OPERATOR`);
        return;
      }
    } else if ("stop" === action) {
      if (!hasAdminRole) {
        toast.error(`Account is not ADMIN`);
        return;
      }
    }

    setIsTxPending(true);
    writeContractAsync({
      account,
      address: pool.address as Address,
      abi: BondingPoolABI,
      functionName: action,
    })
      .then((hash) => {
        txSent?.();
        console.log(`${action}.tx.hash`, hash);
        toast.success(
          "Transaction successfully sent, please refresh the page later!",
          { duration: 30_000 },
        );
      })
      .catch((e) => {
        setIsTxPending(false);
        console.error(`${action}.tx.err`, e);
      });
  };

  return (
    <Button
      type="button"
      isStroke
      className={`${buttonClassName} disabled:!border-transparent gap-2 ${isTxPending ? "!cursor-not-allowed" : ""}`}
      onClick={(e) => {
        e.stopPropagation();
        sendTransaction();
      }}
    >
      {buttonText}
      {isTxPending && <MoonLoader size={20} color="#727272" />}
    </Button>
  );
};

export default StatusControl;
