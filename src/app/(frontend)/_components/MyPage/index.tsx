"use client";

import BigNumber from "bignumber.js";
import dayjs from "dayjs";
import { motion } from "framer-motion";
import Image from "next/image";
import dynamic from "next/dynamic";
import { useEffect, useMemo, useState } from "react";
import CountUp from "react-countup";
import { MoonLoader } from "react-spinners";
import { Address, isAddress } from "viem";
import {
  useAccount,
  useWaitForTransactionReceipt,
  useWriteContract,
} from "wagmi";
import { useShallow } from "zustand/react/shallow";
import {
  BondingPoolABI,
  useBalance,
  calculateStakeReward,
  getAprPercent,
  displayBalance,
} from "@/web3";
import {
  DEFAULT_PRICE_SYMBOL,
  DEFAULT_TOKEN_NAME,
  DEFAULT_TOKEN_PRICE,
  EARN_MAP,
  LOCK_MAP,
} from "@/constants";
import { IPurchase, useBuyerPurchases } from "@/subgraph";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useWalletStore } from "@/stores";
import GlowingEdgeCard from "../GlowingEdgeCard";
import NewMatrix from "../NewMatrix";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useDeepCompareEffect } from "ahooks";

const Countdown = dynamic(() => import("./Countdown"), { ssr: false });

function ClaimAction({
  purchase,
  updateClaimState,
}: {
  purchase: IPurchase;
  updateClaimState: (val: { claimed: boolean; amount: string }) => void;
}) {
  const { address: account, chainId, isConnected } = useAccount();
  const claimAmount = useMemo(
    () =>
      BigNumber(purchase.saleAmount)
        .plus(purchase.rewardAmount)
        .toFixed(purchase.pool?.saleToken?.decimals, 1),
    [purchase],
  );

  // check pool's balance
  const {
    data: sBalance,
    isFetched: isFetchedSBalance,
    refetch: refetchSBalance,
  } = useBalance({
    chainId,
    token: purchase.pool.saleToken.id as Address,
    unit: purchase.pool.saleToken.decimals,
    address: purchase.pool.id as Address,
    // watch: true,
    query: {
      enabled:
        !!purchase.pool?.saleToken?.id &&
        !!purchase?.pool?.id &&
        isAddress(purchase.pool.saleToken.id) &&
        isAddress(purchase.pool.id),
    },
  });
  const sBalanceIsSufficient = useMemo(() => {
    if (account && sBalance && Number(sBalance.formatted) > 0) {
      // console.log("_balance", sBalance.formatted, claimAmount);
      return Number(sBalance.formatted) >= Number(claimAmount);
    }
    return false;
  }, [account, sBalance, claimAmount]);

  // send transaction
  const queryClient = useQueryClient();
  const [addTransaction] = useWalletStore(
    useShallow((state) => [state.addTransaction]),
  );
  const [isTxPending, setIsTxPending] = useState(false);
  const {
    data: txHash,
    status: txWriteStatus,
    writeContractAsync,
    error: writeError,
  } = useWriteContract();
  const { status: txWaitStatus, error: waitError } =
    useWaitForTransactionReceipt({
      chainId,
      hash: txHash,
      query: { enabled: "success" === txWriteStatus },
    });
  useEffect(() => {
    console.log("claim.tx.status", {
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
    if ("success" === txWriteStatus && "success" === txWaitStatus) {
      refetchSBalance?.();
      updateClaimState({ claimed: true, amount: claimAmount });
      queryClient.setQueryData(["claim-success", chainId, account], {
        time: Date.now(),
        saleAmount: purchase.saleAmount,
        rewardAmount: purchase.rewardAmount,
      });
    }
  }, [txWriteStatus, txWaitStatus, writeError, waitError]);
  const sendTransaction = () => {
    if (!isConnected || !sBalanceIsSufficient) return;
    console.log("claim", account, purchase.pool.id, BigInt(purchase.index));
    setIsTxPending(true);
    writeContractAsync({
      account,
      address: purchase.pool.id as Address,
      abi: BondingPoolABI,
      functionName: "claim",
      args: [BigInt(purchase.index)],
    })
      .then((hash) => {
        console.log("claim.tx.hash", hash);
        addTransaction({
          timestamp: dayjs().unix(),
          action: "pool-claim",
          owner: account!,
          chainId: chainId!,
          hash,
          status: "pending",
          content: {
            poolName: purchase.pool.name,
            poolConfig: {
              address: purchase.pool.id,
              saleToken: {
                address: purchase.pool.saleToken.id,
                name: purchase.pool.saleToken.name,
                symbol: purchase.pool.saleToken.symbol,
                decimals: purchase.pool.saleToken.decimals,
              },
            },
            amount: claimAmount,
          },
        });
      })
      .catch((e) => {
        setIsTxPending(false);
        console.error("claim.tx.err", e);
      });
  };

  return (
    <div className="flex justify-start items-center gap-4 z-1">
      <button
        type="button"
        className={`btn-main ${isTxPending ? "pending" : ""} ${isTxPending || (isFetchedSBalance && !sBalanceIsSufficient) ? "cursor-not-allowed" : "cursor-pointer"} min-w-40 flex justify-center items-center gap-2 px-4 py-2 rounded-md text-lg font-semibold text-jet-black`}
        disabled={isTxPending || (isFetchedSBalance && !sBalanceIsSufficient)}
        onClick={(e) => {
          e.stopPropagation();
          sendTransaction();
        }}
      >
        Claim
        {isTxPending && <MoonLoader size={18} color="#0e0e0e" />}
      </button>
      {isFetchedSBalance && !sBalanceIsSufficient && (
        <p className="text-sm text-vermilion">Insufficient pool balance</p>
      )}
    </div>
  );
}

function PurchaseItem({
  purchase,
}: {
  purchase: IPurchase & { deadline: number; currentReward: number };
}) {
  const [localDeadline, setLocalDeadline] = useState(purchase.deadline);
  const [claimState, setClaimState] = useState<{
    claimed: boolean;
    amount: string;
  }>({ claimed: purchase.claimed, amount: purchase.claimedAmount || "" });

  return (
    <motion.div
      className="relative flex flex-col gap-5 px-7 py-8 bg-eerie-black box-shadow-2 border-2 border-dark-greenish-gray rounded-xl"
      initial={{ opacity: 0, y: 150 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.75 }}
      viewport={{ once: true }}
    >
      <div className="flex flex-col gap-3.5 z-1">
        <div className="flex justify-between items-center">
          <div className="text-lg font-semibold text-white">
            {purchase.pool.name}
          </div>
          <div className="text-lg text-white">
            APR: {getAprPercent(purchase.pool.apr)}
          </div>
        </div>
        <div className="flex justify-between items-center">
          <div className="text-lg text-white">
            {LOCK_MAP.past}：
            <span className="font-semibold text-mint-green">
              {displayBalance(purchase.saleAmount)}{" "}
              {purchase.pool?.saleToken?.symbol ?? DEFAULT_TOKEN_NAME}
            </span>
          </div>
          <div className="text-lg text-white">
            {EARN_MAP.past}：
            <span className="text-bright-cyan">
              {displayBalance(purchase.currentReward)} /{" "}
              {displayBalance(purchase.rewardAmount)}{" "}
              {purchase.pool?.saleToken?.symbol ?? DEFAULT_TOKEN_NAME}
            </span>
          </div>
        </div>
      </div>
      <div className="border-t border-dark-gray border-dashed z-1" />
      {claimState.claimed ? (
        <div className="text-lg text-white z-1">
          Claimed {displayBalance(claimState.amount)}{" "}
          {purchase.pool?.saleToken?.symbol ?? DEFAULT_TOKEN_NAME}
        </div>
      ) : localDeadline > dayjs().unix() ? (
        <div className="text-lg text-white z-1">
          Unlock:{" "}
          <Countdown
            deadline={localDeadline}
            onEnd={() => setLocalDeadline((prevState) => prevState - 1)}
          />
        </div>
      ) : (
        <ClaimAction purchase={purchase} updateClaimState={setClaimState} />
      )}
    </motion.div>
  );
}

function Purchases({
  purchases,
  isFetching,
}: {
  purchases: (IPurchase & { deadline: number; currentReward: number })[];
  isFetching: boolean;
}) {
  const { isConnected } = useAccount();

  if (purchases?.length) {
    return purchases
      .sort((a, b) => {
        if (a.claimed !== b.claimed) {
          return Number(a.claimed) - Number(b.claimed);
        } else {
          return (
            Number(a.createdAt) +
            Number(a.pool.lockDuration) -
            (Number(b.createdAt) + Number(b.pool.lockDuration))
          );
        }
      })
      .map((item) => <PurchaseItem key={item.id} purchase={item} />);
  } else if (isFetching) {
    return (
      <div className="w-full min-h-50 flex justify-center items-center text-base text-white/75">
        <MoonLoader size={36} color="rgba(255,255,255,0.75)" />
      </div>
    );
  } else if (!isConnected) {
    return (
      <div className="w-full min-h-50 flex justify-center items-center">
        <ConnectButton.Custom>
          {({ openConnectModal, mounted }) => {
            if (mounted) {
              return (
                <button
                  type="button"
                  className="btn-main min-w-40 flex justify-center items-center gap-2 px-4 py-2 rounded-md text-lg font-semibold text-jet-black"
                  onClick={openConnectModal}
                >
                  Connect Wallet
                </button>
              );
            }
            return <></>;
          }}
        </ConnectButton.Custom>
      </div>
    );
  } else {
    return (
      <div className="w-full min-h-50 flex justify-center items-center text-base text-white/75">
        <p>No {LOCK_MAP.progressive}</p>
      </div>
    );
  }
}

function Headers({
  allSaleAmount,
  allCurrentReward,
  allRewardAmount,
  tempClaimedAmounts,
}: {
  allSaleAmount: number;
  allCurrentReward: number;
  allRewardAmount: number;
  tempClaimedAmounts: { saleAmount: number; rewardAmount: number };
}) {
  const [animationComplete, setAnimationComplete] = useState(false);
  const [tokenStaked, setTokenStaked] = useState(0);
  const [tokenCurrentFarmed, setTokenCurrentFarmed] = useState(0);
  const [tokenFarmed, setTokenFarmed] = useState(0);
  const [tokenValue, setTokenValue] = useState(0);

  useEffect(() => {
    if (animationComplete) {
      const _tokenStaked = allSaleAmount - tempClaimedAmounts.saleAmount;
      const _tokenCurrentFarmed =
        allCurrentReward - tempClaimedAmounts.rewardAmount;
      const _tokenFarmed = allRewardAmount - tempClaimedAmounts.rewardAmount;
      setTokenStaked(_tokenStaked);
      setTokenCurrentFarmed(_tokenCurrentFarmed);
      setTokenFarmed(_tokenFarmed);
      setTokenValue((_tokenStaked + _tokenCurrentFarmed) * DEFAULT_TOKEN_PRICE);
    }
  }, [
    animationComplete,
    allSaleAmount,
    allCurrentReward,
    allRewardAmount,
    tempClaimedAmounts,
  ]);

  return (
    <div className="flex gap-6">
      <motion.div
        className="header-card w-104 box-shadow-1 border-gradient-rounded rounded-lg"
        initial={{ opacity: 0, x: -150 }}
        whileInView={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.75 }}
        viewport={{ once: true }}
        onAnimationComplete={() => setAnimationComplete(true)}
      >
        <GlowingEdgeCard autoPlayOnHover>
          <div className="inner relative w-full h-full flex flex-col gap-11 px-7 py-9">
            <NewMatrix
              className="absolute inset-0 z-0 overflow-hidden rounded-inherit bg-eerie-black"
              baseColor={0x7453ff}
              hoverColor={0x52ffa8}
            />

            <h3 className="z-1 text-lg font-semibold text-white pointer-events-none">
              {DEFAULT_TOKEN_NAME} Balance ({LOCK_MAP.past} + {EARN_MAP.past})
            </h3>
            <div className="z-1 flex items-center gap-4 pointer-events-none">
              <Image
                src="/images/token-aios.svg"
                alt={DEFAULT_TOKEN_NAME}
                width={56}
                height={56}
                className="w-14"
              />
              <p className="text-2xl tracking-[-0.02em] font-semibold text-white">
                <CountUp
                  // key="token-value"
                  // start={0}
                  end={tokenValue}
                  decimals={tokenValue > 1_000 ? 2 : 4}
                  preserveValue
                />{" "}
                {DEFAULT_PRICE_SYMBOL}
              </p>
            </div>
          </div>
        </GlowingEdgeCard>
      </motion.div>

      <motion.div
        className="header-card w-190 box-shadow-1 border-gradient-rounded rounded-lg"
        initial={{ opacity: 0, x: 150 }}
        whileInView={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.75 }}
        viewport={{ once: true }}
        onAnimationComplete={() => setAnimationComplete(true)}
      >
        <GlowingEdgeCard autoPlayOnHover>
          <div className="inner relative w-full h-full flex flex-col gap-6 px-7 py-9">
            <NewMatrix
              className="absolute inset-0 z-0 overflow-hidden rounded-inherit bg-eerie-black"
              baseColor={0x7453ff}
              hoverColor={0x52ffa8}
            />

            <h3 className="z-1 text-lg font-semibold text-white pointer-events-none">
              {LOCK_MAP.progressive} and {EARN_MAP.progressive} Balance
            </h3>
            <div className="z-1 flex justify-center items-end gap-23 pointer-events-none">
              <div className="flex flex-col py-1 gap-2 items-center">
                <p className="text-2xl tracking-[-0.02em] font-semibold text-aquamarine">
                  <CountUp
                    // key="token-staked"
                    // start={0}
                    end={tokenStaked}
                    decimals={tokenStaked > 1_000 ? 2 : 4}
                    preserveValue
                  />
                </p>
                <p className="text-base font-semibold text-white/70">
                  {DEFAULT_TOKEN_NAME} ({LOCK_MAP.past})
                </p>
              </div>
              <div className="w-0.25 h-[90%] bg-dark-greenish-gray" />
              <div className="flex flex-col py-1 gap-2 items-center">
                <p className="text-2xl tracking-[-0.02em] font-semibold text-aquamarine">
                  <CountUp
                    // key="token-current-farmed"
                    // start={0}
                    end={tokenCurrentFarmed}
                    decimals={tokenCurrentFarmed > 1_000 ? 2 : 4}
                    preserveValue
                  />
                  {` / `}
                  <CountUp
                    // key="token-farmed"
                    // start={0}
                    end={tokenFarmed}
                    decimals={tokenFarmed > 1_000 ? 2 : 4}
                    preserveValue
                  />
                </p>
                <p className="text-base font-semibold text-white/70">
                  {DEFAULT_TOKEN_NAME} ({EARN_MAP.past})
                </p>
              </div>
            </div>
          </div>
        </GlowingEdgeCard>
      </motion.div>
    </div>
  );
}

export default function MyPage() {
  const { address: account, chainId } = useAccount();
  const { data, isFetching } = useBuyerPurchases(chainId, account, 1000, 0);

  const [tempClaimedAmounts, setTempClaimedAmounts] = useState({
    saleAmount: 0,
    rewardAmount: 0,
  });
  const { data: updateData } = useQuery({
    queryKey: ["claim-success", chainId, account],
    queryFn: (): {
      time: number;
      saleAmount: string;
      rewardAmount: string;
    } | null => null,
    staleTime: Infinity,
  });
  useEffect(() => {
    if (updateData?.time) {
      setTempClaimedAmounts((prevState) => ({
        saleAmount: prevState.saleAmount + Number(updateData.saleAmount),
        rewardAmount: prevState.rewardAmount + Number(updateData.rewardAmount),
      }));
    }
  }, [updateData?.time]);

  const [purchases, setPurchases] = useState<
    (IPurchase & { deadline: number; currentReward: number })[]
  >([]);
  const [allSaleAmount, setAllSaleAmount] = useState(0);
  const [allCurrentReward, setAllCurrentReward] = useState(0);
  const [allRewardAmount, setAllRewardAmount] = useState(0);
  useDeepCompareEffect(() => {
    const currentTime = dayjs().unix();
    const _purchases: (IPurchase & {
      deadline: number;
      currentReward: number;
    })[] = [];
    let _allSaleAmount = 0;
    let _allCurrentReward = 0;
    let _allRewardAmount = 0;
    data?.forEach((item) => {
      const deadline = Number(item.canClaimAt);
      const currentReward = Number(
        deadline > currentTime
          ? calculateStakeReward(
              item.saleAmount,
              item.pool.apr,
              currentTime - Number(item.createdAt),
            )
          : item.rewardAmount,
      );
      _purchases.push({ ...item, deadline, currentReward });
      if (!item.claimed) {
        _allSaleAmount += Number(item.saleAmount);
        _allCurrentReward += currentReward;
        _allRewardAmount += Number(item.rewardAmount);
      }
    });
    setTempClaimedAmounts({ saleAmount: 0, rewardAmount: 0 });
    setPurchases(_purchases);
    setAllSaleAmount(_allSaleAmount);
    setAllCurrentReward(_allCurrentReward);
    setAllRewardAmount(_allRewardAmount);
  }, [data]);

  return (
    <>
      <div className="w-full max-w-320 min-h-100 mx-auto px-4 sm:px-6 md:px-7 lg:px-8 xl:px-9 2xl:px-10 py-20 relative z-[1] overflow-hidden antialiased">
        <div className="my-page flex flex-col gap-18">
          <Headers
            allSaleAmount={allSaleAmount}
            allCurrentReward={allCurrentReward}
            allRewardAmount={allRewardAmount}
            tempClaimedAmounts={tempClaimedAmounts}
          />

          <div className="flex flex-col gap-4">
            <motion.h3
              className="text-lg font-semibold text-white"
              initial={{ opacity: 0, y: 150 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.75 }}
              viewport={{ once: true }}
            >
              My {LOCK_MAP.progressive}
            </motion.h3>
            <div className="flex flex-col gap-4">
              <Purchases purchases={purchases} isFetching={isFetching} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
