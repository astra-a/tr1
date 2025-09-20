"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo } from "react";
import { toast } from "react-toastify";
import { Hash } from "viem";
import { useAccount, useWaitForTransactionReceipt } from "wagmi";
import { useShallow } from "zustand/react/shallow";
import { faExternalLink } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ALL_TOKENS, NETWORKS_ICON, ONE_BYTES32, displayBalance } from "@/web3";
import {
  IERC20Approve,
  IPoolClaim,
  IPoolPurchase,
  ITransaction,
  useWalletStore,
} from "@/stores";

function TransactionToast({ tx }: { tx: ITransaction }) {
  const { chain } = useAccount();
  const [token, title, content] = useMemo(() => {
    if ("erc20-approve" === tx.action) {
      const txContent = tx.content as IERC20Approve;
      const _token = ALL_TOKENS?.[tx.chainId]?.find(
        (t) =>
          t.chainId === tx.chainId &&
          t.address.toLowerCase() === txContent.token.address.toLowerCase(),
      );
      return [
        _token,
        "Token Approve",
        `${txContent.amount === ONE_BYTES32 ? "" : displayBalance(txContent.amount)} ${txContent.token.symbol}`,
      ];
    } else if ("pool-purchase" === tx.action) {
      const txContent = tx.content as IPoolPurchase;
      const _token = ALL_TOKENS?.[tx.chainId]?.find(
        (t) =>
          t.chainId === tx.chainId &&
          t.address.toLowerCase() ===
            txContent.poolConfig.saleToken.address.toLowerCase(),
      );
      return [
        _token,
        `Purchase ${_token?.symbol}`,
        `Payment ${displayBalance(txContent.paymentAmount)} ${txContent.poolConfig.paymentToken.symbol}`,
      ];
    } else if ("pool-claim" === tx.action) {
      const txContent = tx.content as IPoolClaim;
      const _token = ALL_TOKENS?.[tx.chainId]?.find(
        (t) =>
          t.chainId === tx.chainId &&
          t.address.toLowerCase() ===
            txContent.poolConfig.saleToken.address.toLowerCase(),
      );
      return [
        _token,
        `Claim ${_token?.symbol}`,
        `Claimed ${displayBalance(txContent.amount)} ${txContent.poolConfig.saleToken.symbol}`,
      ];
    }
    return [undefined, "", ""];
  }, [tx]);

  return (
    <div className="flex flex-col flex-auto gap-1">
      <div className="flex items-center gap-2">
        <div className="text-base">{title}</div>
        <Link
          className="w-6 h-6 flex justify-center items-center bg-[#6d6d6d] rounded-md"
          href={
            chain ? `${chain?.blockExplorers?.default.url}/tx/${tx.hash}` : ""
          }
          target="_blank"
          rel="noopener noreferrer external-link-alt"
        >
          <FontAwesomeIcon icon={faExternalLink} size="xs" />
        </Link>
      </div>
      <div className="flex justify-between items-center gap-2">
        <div className="flex items-center">
          <Image
            src={NETWORKS_ICON?.[tx.chainId] ?? "/images/network-ethereum.svg"}
            alt=""
            width={16}
            height={16}
            className="flex-none"
          />
          {token ? (
            <div className="flex-none border-1 border-charcoal-black rounded-xl -ml-1.5">
              <Image
                src={token.logo}
                alt={token.symbol}
                width={16}
                height={16}
              />
            </div>
          ) : (
            <></>
          )}
        </div>
        <div className="flex flex-auto w-0 flex-col gap-1.5 text-sm">
          {content}
        </div>
      </div>
    </div>
  );
}

function TransactionContainer({ tx }: { tx: ITransaction }) {
  const [updateTransaction] = useWalletStore(
    useShallow((state) => [state.updateTransaction]),
  );

  const { status } = useWaitForTransactionReceipt({
    chainId: tx.chainId,
    hash: tx.hash as Hash,
    query: { enabled: !!tx.hash },
  });

  useEffect(() => {
    if (["success", "error"].includes(status)) {
      updateTransaction(tx.chainId, tx.hash, status);
      toast(<TransactionToast tx={tx} />, {
        type: status as "success" | "error",
      });
    }
  }, [status]);

  return <></>;
}

export default function TransactionsPadding() {
  const { address: account, chainId, isConnected } = useAccount();
  const [transactions] = useWalletStore(
    useShallow((state) => [state.transactions]),
  );

  const txs = useMemo(() => {
    if (isConnected && chainId && account) {
      return transactions.filter(
        (tx) =>
          "pending" === tx.status &&
          chainId === tx.chainId &&
          account.toLowerCase() === tx.owner.toLowerCase(),
      );
    }
    return [];
  }, [isConnected, chainId, account, transactions]);

  return txs.map((tx) => (
    <TransactionContainer key={`${tx.chainId}-${tx.hash}`} tx={tx} />
  ));
}
