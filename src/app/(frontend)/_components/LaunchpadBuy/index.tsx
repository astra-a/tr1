"use client";

import BigNumber from "bignumber.js";
import dayjs from "dayjs";
import { motion } from "framer-motion";
import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";
import ReactCardFlip from "react-card-flip";
import CountUp from "react-countup";
import { NumericFormat } from "react-number-format";
import { MoonLoader } from "react-spinners";
import { Address, formatUnits, isAddress, parseUnits } from "viem";
import {
  useAccount,
  useWaitForTransactionReceipt,
  useWriteContract,
} from "wagmi";
import { useShallow } from "zustand/react/shallow";
import {
  DAY_SECONDS,
  DEFAULT_PRICE_SYMBOL,
  EARN_MAP,
  LOCK_MAP,
  POOL_STATUS,
  PoolStatusLabels,
} from "@/constants";
import { Radio, RadioGroup } from "@headlessui/react";
import {
  useAllowance,
  useBalance,
  usePoolSaleStats,
  usePoolStatus,
  ALL_TOKENS,
  BondingPoolABI,
  NETWORKS_ICON,
  calculateStakeReward,
  getAprPercent,
  IPaymentRule,
  displayBalance,
} from "@/web3";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useWalletStore } from "@/stores";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Pool } from "@/payload-types";
import GlowingEdgeCard from "../GlowingEdgeCard";
import { TokenApproveButton } from "../TokenApproveButton";
import { useWindowSize } from "react-use";

interface IAmounts {
  paymentRule: IPaymentRule;
  paymentAmount: string; // decimals: paymentToken
  stakedAmount: string; // decimals: saleToken
  yieldAmount: string; // decimals: saleToken
}

function PoolInfo({
  pool,
  totalCap,
  totalRemaining,
  price,
}: {
  pool: Pool;
  totalCap: string;
  totalRemaining: string;
  price: string;
}) {
  const totalYield = useMemo(() => {
    return Number(calculateStakeReward(totalCap, pool.apr, pool.lockDuration));
  }, [pool, totalCap]);

  return (
    <motion.div
      className="pool-info flex flex-col gap-6 lg:gap-7 2xl:gap-8"
      initial={{ opacity: 0, x: -150 }}
      whileInView={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.75 }}
      viewport={{ once: true }}
    >
      <div className="pool-info-item flex flex-col items-end gap-1 pr-4">
        <p className="text-xl lg:text-2xl xl:text-3xl 2xl:text-[2rem] leading-[1.4] tracking-[-0.02em] font-semibold text-white">
          Pool
        </p>
        <table className="border-collapse border-none text-base sm:text-lg lg:text-xl xl:text-2xl tracking-[-0.02em] font-semibold text-white/70">
          <tbody>
            <tr className="border-none">
              <td align="right" className="pr-1 py-1 border-none">
                Name:
              </td>
              <td className="pl-1 border-none">{pool.name}</td>
            </tr>
            <tr className="border-none">
              <td align="right" className="pr-1 py-1 border-none">
                Price:
              </td>
              <td className="pl-1 border-none">
                {displayBalance(price)} {DEFAULT_PRICE_SYMBOL}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div className="pool-info-item flex flex-col items-end gap-1 pr-4">
        <p className="text-xl lg:text-2xl xl:text-3xl 2xl:text-[2rem] leading-[1.4] tracking-[-0.02em] font-semibold text-white">
          Chain
        </p>
        <div className="flex items-center gap-2">
          <Image
            src={NETWORKS_ICON?.[pool.chainId] ?? ""}
            alt={pool.network}
            width={24}
            height={24}
            className="w-5"
          />
          <p className="text-base sm:text-lg lg:text-xl xl:text-2xl tracking-[-0.02em] font-semibold text-white/70">
            {pool.network}
          </p>
        </div>
      </div>
      <div className="pool-info-item flex flex-col items-end gap-1 pr-4">
        <p className="text-xl lg:text-2xl xl:text-3xl 2xl:text-[2rem] leading-[1.4] tracking-[-0.02em] font-semibold text-white">
          {LOCK_MAP.plural}
        </p>

        <table className="border-collapse border-none text-base sm:text-lg lg:text-xl xl:text-2xl tracking-[-0.02em] font-semibold text-white/70">
          <tbody>
            <tr className="border-none">
              <td align="right" className="pr-1 py-1 border-none">
                APR:
              </td>
              <td className="pl-1 border-none">{getAprPercent(pool.apr)}</td>
            </tr>
            <tr className="border-none">
              <td align="right" className="pr-1 py-1 border-none">
                Total Allocation:
              </td>
              <td className="pl-1 border-none">
                {displayBalance(totalCap)} {pool.saleToken.symbol}
              </td>
            </tr>
            <tr className="border-none">
              <td align="right" className="pr-1 py-1 border-none">
                Remaining Allocation:
              </td>
              <td className="pl-1 border-none">
                {displayBalance(totalRemaining)} {pool.saleToken.symbol}
              </td>
            </tr>
            <tr className="border-none">
              <td align="right" className="pr-1 py-1 border-none">
                Total Yield:
              </td>
              <td className="pl-1 border-none">
                {displayBalance(totalYield)} {pool.saleToken.symbol}
              </td>
            </tr>
            <tr className="border-none">
              <td align="right" className="pr-1 py-1 border-none">
                Lock Duration:
              </td>
              <td className="pl-1 border-none">
                {(pool.lockDuration / DAY_SECONDS).toLocaleString(undefined, {
                  maximumFractionDigits: 2,
                })}{" "}
                days
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </motion.div>
  );
}

function BuyPanel({
  pool,
  poolStatus,
  deadline,
  totalRemaining,
  amounts,
  setAmountIn,
  setPaymentRule,
  flipToConfirm,
}: {
  pool: Pool;
  poolStatus: POOL_STATUS;
  deadline: number;
  totalRemaining: string;
  amounts: IAmounts;
  setAmountIn: (value: string) => void;
  setPaymentRule: (value: IPaymentRule) => void;
  flipToConfirm: () => void;
}) {
  const { paymentRules, saleToken } = pool;
  const { paymentRule, paymentAmount, stakedAmount, yieldAmount } = amounts;
  const { paymentToken, minPurchase, maxPurchase } = paymentRule;
  const { address: account, chainId, isConnected } = useAccount();
  const { data: pBalance, refetch: refetchPBalance } = useBalance({
    chainId: pool.chainId,
    token: paymentToken.address as Address,
    unit: paymentToken.decimals,
    address: account,
    // watch: true,
    query: {
      enabled:
        !!account && !!paymentToken?.address && isAddress(paymentToken.address),
    },
  });
  const balanceIsSufficient = useMemo(() => {
    if (
      account &&
      pBalance &&
      Number(pBalance.formatted) > 0 &&
      Number(paymentAmount) > 0
    ) {
      // console.log("_balance", pBalance.formatted);
      return Number(pBalance.formatted) >= Number(paymentAmount);
    }
    return false;
  }, [account, pBalance, paymentAmount]);

  const { data: pAllowance, refetch: refetchPAllowance } = useAllowance(
    pool.chainId,
    paymentToken,
    account,
    pool.address,
  );
  const allowanceIsSufficient = useMemo(() => {
    if (
      account &&
      pAllowance &&
      minPurchase &&
      Number(paymentAmount) >= Number(minPurchase)
    ) {
      const _allowance = formatUnits(pAllowance, paymentToken.decimals);
      // console.log("_allowance", _allowance);
      return Number(_allowance) >= Number(paymentAmount);
    }
    return false;
  }, [account, pAllowance, minPurchase, paymentAmount]);

  const { refetch: refetchSaleStats } = usePoolSaleStats(
    pool.chainId,
    pool.address,
  );
  const { data: updateData } = useQuery({
    queryKey: ["purchase-success", pool.chainId, pool.address],
    queryFn: (): number | null => null,
  });
  useEffect(() => {
    if (updateData) {
      // console.log("_updateData", updateData);
      refetchPBalance?.();
      refetchPAllowance?.();
      refetchSaleStats?.();
    }
  }, [updateData]);

  return (
    <div className="pool-operate relative w-full max-w-120 lg:w-120 xl:w-140 xl:max-w-none flex flex-col gap-8 lg:gap-10 xl:gap-12 2xl:gap-14 px-6 sm:px-8 lg:px-10 xl:px-12 2xl:px-14 py-6 sm:py-8 lg:py-10 xl:py-12 2xl:py-14 3xl:py-18 border-2 border-dark-charcoal rounded-inherit">
      <div className="pool-operate-header flex flex-col items-center gap-2">
        <h3 className="text-lg leading-none font-semibold text-white">
          Lock & Earn {pool.saleToken.name}
        </h3>
        <p className="text-base leading-none text-white/70">
          Purchase and lock now, receive {pool.saleToken.name} plus bonus at
          maturity.
        </p>
      </div>
      <div className="pool-operate-centent flex flex-col gap-8">
        <div className="flex flex-col gap-7">
          <div className="flex justify-between items-center gap-2">
            <p className="flex-none text-lg text-white">{LOCK_MAP.past}</p>
            <p className="text-lg text-white">
              {displayBalance(stakedAmount)} {saleToken.symbol}
            </p>
          </div>
          <div className="w-full h-[1.5px] bg-dark-gray" />
          <div className="flex justify-between items-center gap-2">
            <p className="flex-none text-lg text-white">{EARN_MAP.past}</p>
            <p className="text-lg text-white">
              {displayBalance(yieldAmount)} {saleToken.symbol}
            </p>
          </div>
          <div className="w-full h-[1.5px] bg-dark-gray" />
          <div className="flex justify-between items-center gap-2">
            <label
              htmlFor="input-amount"
              className="flex-none text-lg text-white"
            >
              Amount
            </label>
            <div className="flex items-center gap-2">
              <div className="flex justify-between items-center gap-1">
                <NumericFormat
                  id="input-amount"
                  autoComplete="off"
                  thousandSeparator={false}
                  // allowLeadingZeros={false}
                  allowNegative={false}
                  decimalScale={paymentToken.decimals}
                  valueIsNumericString
                  placeholder="0.0"
                  value={paymentAmount}
                  onValueChange={(values) => {
                    setAmountIn(values.value);
                  }}
                  className="numeric-input w-full text-lg text-white text-right"
                />
                <p className="text-lg text-white">{paymentToken.symbol}</p>
              </div>
              <button
                type="button"
                className="text-lg font-semibold text-bright-aqua cursor-pointer"
                onClick={() => {
                  if (Number(totalRemaining) > 0 && pBalance) {
                    const maxPaymentToken = BigNumber(
                      BigNumber(totalRemaining)
                        .times(amounts.paymentRule.price)
                        .toFixed(amounts.paymentRule.paymentToken.decimals, 1),
                    ).toString();
                    setAmountIn(
                      Number(maxPaymentToken) > Number(pBalance.formatted)
                        ? pBalance.formatted
                        : maxPaymentToken,
                    );
                  } else {
                    setAmountIn("0");
                  }
                }}
              >
                MAX
              </button>
            </div>
          </div>
          <div className="flex flex-col gap-1.5">
            <div className="w-full h-[1.5px] bg-dark-gray" />
            <div className="text-lg text-white">
              Available:
              <CountUp
                // key="account-balance"
                // start={0}
                end={pBalance ? Number(pBalance.formatted) : 0}
                decimals={0}
                preserveValue
                suffix=" "
                prefix=" "
              />
              {paymentToken.symbol}
            </div>
          </div>
          <div className="flex flex-col gap-3">
            <RadioGroup
              value={paymentToken.address.toLowerCase()}
              onChange={(v) => {
                const _rule = paymentRules.find(
                  (p) =>
                    p.paymentToken.address.toLowerCase() === v.toLowerCase(),
                );
                if (_rule) {
                  setPaymentRule(_rule);
                }
              }}
              aria-label="payment rule"
              className="flex flex-col gap-3"
            >
              {paymentRules
                .filter((r) => r.enabled)
                ?.map((rule) => {
                  const token = ALL_TOKENS?.[pool.chainId]?.find(
                    (t) =>
                      t.chainId === pool.chainId &&
                      t.address.toLowerCase() ===
                        rule.paymentToken.address.toLowerCase(),
                  );
                  return (
                    <Radio
                      key={rule.index}
                      value={rule.paymentToken.address.toLowerCase()}
                      disabled={!rule.enabled}
                    >
                      {({ checked }) => (
                        <div
                          className={`flex justify-between items-center ${rule.enabled ? "cursor-pointer" : "cursor-not-allowed"}`}
                        >
                          <div className="flex items-center gap-2">
                            <div className="w-6">
                              <Image
                                src={token?.logo ?? ""}
                                alt={token?.symbol ?? rule.paymentToken.symbol}
                                width={24}
                                height={24}
                                className="w-full"
                              />
                            </div>
                            <p className="text-xl font-semibold tracking-[-0.02em] text-white">
                              {token?.symbol ?? rule.paymentToken.symbol}
                            </p>
                          </div>
                          <div
                            className={`size-4 flex justify-center items-center border-2 ${rule.enabled ? "border-bright-aqua" : "border-charcoal"} rounded-full`}
                          >
                            {checked && (
                              <div className="size-2 bg-bright-aqua rounded-inherit" />
                            )}
                          </div>
                        </div>
                      )}
                    </Radio>
                  );
                })}
            </RadioGroup>
            <div className="text-base text-white text-center">
              Min Purchase: {minPurchase} {paymentToken.symbol}, Max Purchase:{" "}
              {maxPurchase} {paymentToken.symbol}.
            </div>
          </div>
        </div>
      </div>
      <div className="pool-operate-footer flex flex-col gap-2">
        {POOL_STATUS.Active !== poolStatus ? (
          <button
            type="button"
            className="btn-main w-full flex justify-center items-center py-3.5 rounded-md text-lg font-semibold text-jet-black"
            disabled
          >
            Pool was {PoolStatusLabels[poolStatus]}
          </button>
        ) : deadline < dayjs().unix() ? (
          <button
            type="button"
            className="btn-main w-full flex justify-center items-center py-3.5 rounded-md text-lg font-semibold text-jet-black"
            disabled
          >
            Pool was {PoolStatusLabels[POOL_STATUS.SoldOut]}
          </button>
        ) : !isConnected ? (
          <ConnectButton.Custom>
            {({ openConnectModal, mounted }) => {
              if (mounted) {
                return (
                  <button
                    type="button"
                    className="btn-main w-full flex justify-center items-center py-3.5 rounded-md text-lg font-semibold text-jet-black cursor-pointer"
                    onClick={openConnectModal}
                  >
                    Connect Wallet
                  </button>
                );
              } else {
                return <></>;
              }
            }}
          </ConnectButton.Custom>
        ) : chainId !== pool.chainId ? (
          <ConnectButton.Custom>
            {({ openChainModal, mounted }) => {
              if (mounted) {
                return (
                  <button
                    type="button"
                    className="btn-main w-full flex justify-center items-center py-3.5 rounded-md text-lg font-semibold text-jet-black cursor-pointer"
                    onClick={openChainModal}
                  >
                    Switch to {pool.network}
                  </button>
                );
              } else {
                return <></>;
              }
            }}
          </ConnectButton.Custom>
        ) : Number(paymentAmount) < Number(minPurchase) ? (
          <button
            type="button"
            className="btn-main w-full flex justify-center items-center py-3.5 rounded-md text-lg font-semibold text-jet-black"
            disabled
          >
            {Number(paymentAmount) > 0
              ? `Below min purchase`
              : "Enter an amount"}
          </button>
        ) : Number(stakedAmount) > Number(totalRemaining) ? (
          <button
            type="button"
            className="btn-main w-full flex justify-center items-center py-3.5 rounded-md text-lg font-semibold text-jet-black"
            disabled
          >
            Insufficient Allocation
          </button>
        ) : !allowanceIsSufficient ? (
          <TokenApproveButton
            token={paymentToken}
            spender={pool.address!}
            amount={paymentAmount}
            onSuccess={() => {
              console.log(
                dayjs().format("mm:ss SSS"),
                "approve.success, to refetch allowance",
              );
              refetchPAllowance?.();
            }}
            storeTransaction={true}
          />
        ) : Number(paymentAmount) > Number(maxPurchase) ? (
          <button
            type="button"
            className="btn-main w-full flex justify-center items-center py-3.5 rounded-md text-lg font-semibold text-jet-black"
            disabled
          >
            Above max purchase
          </button>
        ) : !balanceIsSufficient ? (
          <button
            type="button"
            className="btn-main w-full flex justify-center items-center py-3.5 rounded-md text-lg font-semibold text-jet-black"
            disabled
          >
            Insufficient balance
          </button>
        ) : (
          <button
            type="button"
            className="btn-main w-full flex justify-center items-center py-3.5 rounded-md text-lg font-semibold text-jet-black cursor-pointer"
            onClick={flipToConfirm}
          >
            Purchase and {LOCK_MAP.general}
          </button>
        )}
      </div>
    </div>
  );
}

function ConfirmPanel({
  pool,
  poolStatus,
  deadline,
  amounts,
  setAmountIn,
  flipToBuy,
}: {
  pool: Pool;
  poolStatus: POOL_STATUS;
  deadline: number;
  amounts: IAmounts;
  setAmountIn: (value: string) => void;
  flipToBuy: () => void;
}) {
  const { saleToken } = pool;
  const { paymentRule, paymentAmount, stakedAmount, yieldAmount } = amounts;
  const { paymentToken, minPurchase, maxPurchase } = paymentRule;
  const queryClient = useQueryClient();
  const { address: account, chainId, isConnected } = useAccount();
  useEffect(() => {
    if (!isConnected || chainId !== pool.chainId) {
      flipToBuy();
    }
  }, [isConnected, chainId, pool]);

  const [addTransaction] = useWalletStore(
    useShallow((state) => [state.addTransaction]),
  );

  // send transaction
  const [isTxPending, setIsTxPending] = useState(false);
  const {
    data: txHash,
    status: txWriteStatus,
    writeContractAsync,
    error: writeError,
    reset,
  } = useWriteContract();
  const { status: txWaitStatus, error: waitError } =
    useWaitForTransactionReceipt({
      chainId: pool.chainId,
      hash: txHash,
      query: { enabled: "success" === txWriteStatus },
    });
  useEffect(() => {
    console.log("purchase.tx.status", {
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
      queryClient.setQueryData(
        ["purchase-success", pool.chainId, pool.address],
        Date.now(),
      );
      reset?.();
      setAmountIn("0");
      flipToBuy();
    }
  }, [txWriteStatus, txWaitStatus, writeError, waitError]);
  const sendTransaction = () => {
    if (
      !isConnected ||
      Number(paymentAmount) < Number(minPurchase) ||
      Number(paymentAmount) > Number(maxPurchase)
    )
      return;
    if (deadline < dayjs().unix()) return;

    setIsTxPending(true);
    writeContractAsync({
      account,
      address: pool.address as Address,
      abi: BondingPoolABI,
      functionName: "purchase",
      args: [
        paymentToken.address as Address,
        parseUnits(
          BigNumber(paymentAmount).toFixed(paymentToken.decimals),
          paymentToken.decimals,
        ),
      ],
    })
      .then((hash) => {
        console.log("purchase.tx.hash", hash);
        addTransaction({
          timestamp: dayjs().unix(),
          action: "pool-purchase",
          owner: account!,
          chainId: pool.chainId,
          hash,
          status: "pending",
          content: {
            poolName: pool.name,
            poolConfig: {
              address: pool.address!,
              paymentToken: paymentToken,
              saleToken,
              apr: pool.apr,
              lockDuration: pool.lockDuration,
            },
            paymentAmount: paymentAmount,
            stakedAmount: stakedAmount,
          },
        });
      })
      .catch((e) => {
        setIsTxPending(false);
        console.error("purchase.tx.err", e);
      });
  };

  return (
    <div className="pool-operate relative w-full max-w-120 lg:w-120 xl:w-140 xl:max-w-none flex flex-col gap-8 lg:gap-10 xl:gap-12 2xl:gap-14 px-6 sm:px-8 lg:px-10 xl:px-12 2xl:px-14 py-6 sm:py-8 lg:py-10 xl:py-12 2xl:py-14 3xl:py-18 border-2 border-dark-charcoal rounded-inherit">
      <div className="pool-operate-centent flex flex-col gap-8">
        <div className="flex flex-col gap-7">
          <div className="flex justify-between items-center">
            <label htmlFor="" className="text-lg text-white">
              {LOCK_MAP.past}
            </label>
            <p className="text-lg text-white">
              {displayBalance(stakedAmount)} {saleToken.symbol}
            </p>
          </div>
          <div className="w-full h-[1.5px] bg-dark-gray" />
          <div className="flex justify-between items-center">
            <label htmlFor="" className="text-lg text-white">
              {EARN_MAP.past}
            </label>
            <p className="text-lg text-white">
              {displayBalance(yieldAmount)} {saleToken.symbol}
            </p>
          </div>
          <div className="w-full h-[1.5px] bg-dark-gray" />
          <div className="flex justify-between items-center">
            <label htmlFor="" className="text-lg text-white">
              Amount
            </label>
            <p className="text-lg text-white">
              {paymentAmount} {paymentToken.symbol}
            </p>
          </div>
          <div className="w-full" />
        </div>
      </div>
      <div className="pool-operate-footer flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <div className="w-full h-[3em] flex justify-center items-end text-sm text-vermilion">
            {writeError
              ? (writeError as any).shortMessage
              : waitError
                ? (waitError as any).shortMessage
                : ""}
          </div>
          {POOL_STATUS.Active !== poolStatus ? (
            <button
              type="button"
              className="btn-main w-full flex justify-center items-center py-3.5 rounded-md text-lg font-semibold text-jet-black"
              disabled
            >
              Pool was {PoolStatusLabels[poolStatus]}
            </button>
          ) : deadline < dayjs().unix() ? (
            <button
              type="button"
              className="btn-main w-full flex justify-center items-center py-3.5 rounded-md text-lg font-semibold text-jet-black"
              disabled
            >
              Pool was {PoolStatusLabels[POOL_STATUS.SoldOut]}
            </button>
          ) : (
            <button
              type="button"
              className={`btn-main ${isTxPending ? "pending cursor-not-allowed" : "cursor-pointer"} w-full flex justify-center items-center gap-2 py-3.5 bg-mint-green rounded-md text-lg font-semibold text-jet-black`}
              disabled={isTxPending}
              onClick={(e) => {
                e.stopPropagation();
                sendTransaction();
              }}
            >
              Confirm
              {isTxPending && <MoonLoader size={20} color="#0e0e0e" />}
            </button>
          )}
        </div>
        <button
          type="button"
          className="btn-cancel w-full flex justify-center items-center py-3.5 border border-light-gray rounded-md text-lg font-semibold cursor-pointer"
          onClick={flipToBuy}
        >
          Cancel
        </button>
      </div>
    </div>
  );
}

export default function BuyAndStake({ pool }: { pool: Pool }) {
  const { width } = useWindowSize();
  const ref = useRef<HTMLDivElement>(null);
  const [isFlipped, setIsFlipped] = useState(false);
  const [containerHeight, setContainerHeight] = useState<number | undefined>(
    undefined,
  );
  useEffect(() => {
    if (ref?.current && !isFlipped) {
      setContainerHeight(ref.current.clientHeight);
    }
  }, [ref?.current?.clientHeight, isFlipped]);

  const [amounts, setAmounts] = useState<IAmounts>({
    paymentRule: pool.paymentRules[0],
    paymentAmount: "",
    stakedAmount: "0",
    yieldAmount: "0",
  });
  function updateAmounts(paymentAmount: string) {
    if (paymentAmount && Number(paymentAmount) > 0) {
      const stakedAmount = BigNumber(paymentAmount)
        .div(amounts.paymentRule.price)
        .toFixed(pool.saleToken.decimals, 1);
      const yieldAmount = calculateStakeReward(
        stakedAmount,
        pool.apr,
        pool.lockDuration,
        pool.saleToken.decimals,
      );
      setAmounts((prevState) => ({
        ...prevState,
        paymentAmount,
        stakedAmount,
        yieldAmount,
      }));
    } else {
      setAmounts((prevState) => ({
        ...prevState,
        paymentAmount,
        stakedAmount: "0",
        yieldAmount: "0",
      }));
    }
  }

  const deadline = useMemo(
    () => pool.saleStartedAt + pool.saleDuration + pool.pausedDurationSum,
    [pool],
  );

  const { data: status } = usePoolStatus(pool.chainId, pool.address);
  const { data: saleStats } = usePoolSaleStats(pool.chainId, pool.address);
  const [poolStatus, totalCap, _, totalRemaining, price] = useMemo(() => {
    let _status = undefined === status ? (pool.status as POOL_STATUS) : status;
    if (pool.saleStartedAt > dayjs().unix()) {
      _status = POOL_STATUS.Upcoming;
    } else if (
      pool.saleStartedAt + pool.saleDuration + pool.pausedDurationSum <=
      dayjs().unix()
    ) {
      _status = POOL_STATUS.SoldOut;
    }
    const [_sold, _cap, _remaining] = saleStats
      ? [
          formatUnits(saleStats[0], pool.saleToken.decimals),
          formatUnits(saleStats[1], pool.saleToken.decimals),
          formatUnits(saleStats[2], pool.saleToken.decimals),
        ]
      : [
          pool.totalSold,
          pool.totalSaleCap,
          BigNumber(pool.totalSaleCap).minus(pool.totalSold).toString(),
        ];
    if (POOL_STATUS.Active === _status && saleStats) {
      const mins = pool.paymentRules
        .filter((r) => r.enabled)
        .map((r) => Number(r.minPurchase) / Number(r.price));
      if (mins.length && Number(_remaining) < Math.min(...mins)) {
        _status = POOL_STATUS.SoldOut;
      }
    }
    const paymentRules = pool.paymentRules.filter((r) => r.enabled);
    const _price = paymentRules.length ? paymentRules[0].price : "0";
    return POOL_STATUS.SoldOut === _status
      ? [_status, _cap, _cap, "0", _price]
      : [_status, _cap, _sold, _remaining, _price];
  }, [status, saleStats, pool]);

  return (
    <div className="launchpad-details w-full max-w-370 min-h-100 mx-auto px-4 md:px-6 lg:px-8 xl:px-9 2xl:px-10 py-20 lg:py-24 xl:py-28 relative z-[1] overflow-hidden antialiased">
      <div
        className="launchpad-buy relative flex flex-col items-center lg:flex-row lg:justify-center gap-8 lg:gap-12 xl:gap-24 2xl:gap-36 3xl:gap-48"
        style={{ height: width > 1024 ? containerHeight : "auto" }}
      >
        <PoolInfo
          pool={pool}
          totalCap={totalCap}
          totalRemaining={totalRemaining}
          price={price}
        />

        <motion.div
          initial={{ opacity: 0, x: 150 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.75 }}
          viewport={{ once: true }}
          className="w-full lg:w-auto"
        >
          <ReactCardFlip
            isFlipped={isFlipped}
            flipDirection="horizontal"
            flipSpeedBackToFront={1.5}
            flipSpeedFrontToBack={1.5}
            containerClassName="relative"
          >
            <div ref={ref} className="w-full rounded-2xl">
              <GlowingEdgeCard
                autoPlayOnHover
                className="w-full rounded-inherit"
              >
                <div className="flex justify-center rounded-inherit">
                  <BuyPanel
                    pool={pool}
                    poolStatus={poolStatus}
                    deadline={deadline}
                    totalRemaining={totalRemaining}
                    amounts={amounts}
                    setAmountIn={(v) => updateAmounts(v)}
                    setPaymentRule={(paymentRule) => {
                      setAmounts((prevState) => ({
                        ...prevState,
                        paymentRule,
                      }));
                    }}
                    flipToConfirm={() => setIsFlipped(true)}
                  />
                </div>
              </GlowingEdgeCard>
            </div>
            <div
              className="flex items-center w-full rounded-2xl"
              style={{ height: containerHeight }}
            >
              <GlowingEdgeCard
                autoPlayOnHover
                className="w-full rounded-inherit"
              >
                <div className="flex justify-center rounded-inherit">
                  <ConfirmPanel
                    pool={pool}
                    poolStatus={poolStatus}
                    deadline={deadline}
                    amounts={amounts}
                    setAmountIn={(v) => updateAmounts(v)}
                    flipToBuy={() => setIsFlipped(false)}
                  />
                </div>
              </GlowingEdgeCard>
            </div>
          </ReactCardFlip>
        </motion.div>
      </div>
    </div>
  );
}
