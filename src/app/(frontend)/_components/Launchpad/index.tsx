"use client";

import dayjs from "dayjs";
import { motion } from "framer-motion";
import dynamic from "next/dynamic";
import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import { formatUnits } from "viem";
import {
  DAY_SECONDS,
  DEFAULT_PRICE_SYMBOL,
  POOL_STATUS,
  PoolStatusLabels,
} from "@/constants";
import {
  ALL_TOKENS,
  displayBalance,
  getAprPercent,
  usePoolSaleStats,
  usePoolStatus,
} from "@/web3";
import { Pool } from "@/payload-types";
import GlowingEdgeCard from "../GlowingEdgeCard";

const Countdown = dynamic(() => import("./Countdown"), { ssr: false });

function PoolStatus({ status }: { status: POOL_STATUS }) {
  const color = useMemo(() => {
    switch (status) {
      case POOL_STATUS.Active:
        return "text-neon-green border-neon-green";
      case POOL_STATUS.Upcoming:
        return "text-yellow-500 border-yellow-500";
      case POOL_STATUS.SoldOut:
        return "text-red-500 border-red-500";
      case POOL_STATUS.Paused:
        return "text-dark-greenish-gray border-dark-greenish-gray";
    }
  }, [status]);
  return (
    <div
      className={`flex flex-none items-center gap-1 py-1 bg-medium-gray rounded-md px-2 ${color}`}
    >
      <div className="switch" />
      <p className="text-sm font-semibold uppercase">
        {PoolStatusLabels[status]}
      </p>
    </div>
  );
}

function ProgressBar({ progress }: { progress: number }) {
  return (
    <div className="progress h-5 bg-dark-greenish-gray border border-dark-gray rounded-sm">
      <div
        className={`progress-bar w-0 h-full ${progress >= 50 ? "t2" : "t1"}`}
        style={{ width: `${progress}%` }}
      />
    </div>
  );
}

// function PoolParticipants({
//   pool,
// }: {
//   pool: Pick<Pool, "chainId" | "address">;
// }) {
//   const { data } = usePoolParticipants(pool.chainId, pool.address);
//   return <p>PARTICIPANTS: {data?.participants ?? 0}</p>;
// }

function StakedProgress({
  totalCap,
  totalSold,
  price,
  showProgress,
}: {
  totalCap: number;
  totalSold: number;
  price: number;
  showProgress: boolean;
}) {
  const [capValue, soldValue, progress] = useMemo(() => {
    return [totalCap * price, totalSold * price, (totalSold / totalCap) * 100];
  }, [totalCap, totalSold, price]);

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-col gap-2">
        <div className="flex justify-between items-center text-sm lg:text-base leading-none font-semibold text-white">
          <p>
            {displayBalance(soldValue)}/{displayBalance(capValue)}{" "}
            {DEFAULT_PRICE_SYMBOL}
          </p>
          <p>Progress {showProgress ? Math.floor(progress) : 0}%</p>
        </div>
        <ProgressBar progress={showProgress ? progress : 0} />
      </div>
      <div className="flex justify-between items-center text-sm leading-none font-semibold text-white/70">
        <p>LIMITED</p>
      </div>
    </div>
  );
}

function PoolOverview({
  pool,
  totalCap,
  totalRemaining,
}: {
  pool: Pick<Pool, "lockDuration" | "apr" | "saleToken">;
  totalCap: number;
  totalRemaining: number;
}) {
  return (
    <div className="flex flex-col gap-3">
      <div className="border-t border-dark-gray border-dashed" />
      <div className="flex flex-col gap-2">
        <div className="flex justify-between items-center text-sm leading-none font-semibold text-white">
          <p>Total Allocation</p>
          <p className="text-bright-cyan">
            {displayBalance(totalCap)} {pool.saleToken.symbol}
          </p>
        </div>
        <div className="flex justify-between items-center text-sm leading-none font-semibold text-white">
          <p>Remaining Allocation</p>
          <p>
            {displayBalance(totalRemaining)} {pool.saleToken.symbol}
          </p>
        </div>
        <div className="flex justify-between items-center text-sm leading-none font-semibold text-white">
          <p>APR</p>
          <p className="text-bright-aqua">{getAprPercent(pool.apr)}</p>
        </div>
        <div className="flex justify-between items-center text-sm leading-none font-semibold text-white">
          <p>Cliff Lock</p>
          <p>
            {(pool.lockDuration / DAY_SECONDS).toLocaleString(undefined, {
              maximumFractionDigits: 2,
            })}{" "}
            days
          </p>
        </div>
      </div>
      <div className="border-t border-dark-gray border-dashed" />
    </div>
  );
}

function IdoEnded({
  pool,
  poolStatus,
  setPoolStatus,
}: {
  pool: Pick<Pool, "saleStartedAt" | "pausedDurationSum" | "saleDuration">;
  poolStatus: POOL_STATUS;
  setPoolStatus: (status: POOL_STATUS) => void;
}) {
  const [title, deadline] = useMemo(() => {
    switch (poolStatus) {
      case POOL_STATUS.Upcoming:
        return ["SALE IN", pool.saleStartedAt];
      case POOL_STATUS.Active:
        return [
          "SALE ENDED",
          pool.saleStartedAt + pool.saleDuration + pool.pausedDurationSum,
        ];
      default:
        return ["SALE ENDED", 0];
    }
  }, [pool, poolStatus]);
  return (
    <div className="h-10 flex justify-between items-center">
      <h2 className="text-sm lg:text-base leading-none font-semibold text-white">
        {title}
      </h2>
      <Countdown
        deadline={deadline}
        onEnd={() => {
          if (
            pool.saleStartedAt + pool.saleDuration + pool.pausedDurationSum <=
            dayjs().unix()
          ) {
            setPoolStatus(POOL_STATUS.SoldOut);
          } else if (pool.saleStartedAt <= dayjs().unix()) {
            setPoolStatus(POOL_STATUS.Active);
          }
        }}
      />
    </div>
  );
}

function Item({ pool }: { pool: Pool }) {
  const { data: status } = usePoolStatus(pool.chainId, pool.address);
  const { data: saleStats } = usePoolSaleStats(pool.chainId, pool.address);

  const [poolStatus, setPoolStatus] = useState<POOL_STATUS>(
    pool.status as POOL_STATUS,
  );
  const [totalCap, totalSold, totalRemaining, price] = useMemo(() => {
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
          Number(formatUnits(saleStats[0], pool.saleToken.decimals)),
          Number(formatUnits(saleStats[1], pool.saleToken.decimals)),
          Number(formatUnits(saleStats[2], pool.saleToken.decimals)),
        ]
      : [
          Number(pool.totalSold),
          Number(pool.totalSaleCap),
          Number(pool.totalSaleCap) - Number(pool.totalSold),
        ];
    if (POOL_STATUS.Active === _status && saleStats) {
      const mins = pool.paymentRules
        .filter((r) => r.enabled)
        .map((r) => Number(r.minPurchase) / Number(r.price));
      if (mins.length && _remaining < Math.min(...mins)) {
        _status = POOL_STATUS.SoldOut;
      }
    }
    const paymentRules = pool.paymentRules.filter((r) => r.enabled);
    const _price = paymentRules.length ? Number(paymentRules[0].price) : 0;
    setPoolStatus(_status);
    return POOL_STATUS.SoldOut === _status
      ? [_cap, _cap, 0, _price]
      : [_cap, _sold, _remaining, _price];
  }, [status, saleStats, pool]);

  const [showProgress, setShowProgress] = useState(false);

  return (
    <motion.div
      className={`launchpad-item-wrapper border-gradient-rounded ${[POOL_STATUS.SoldOut].includes(poolStatus) ? "red" : ""} rounded-lg relative`}
      initial={{ opacity: 0, y: 150 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.75 }}
      viewport={{ once: true }}
      onAnimationComplete={() => setShowProgress(true)}
    >
      <GlowingEdgeCard
        autoPlayOnHover
        className={`w-full h-full ${[POOL_STATUS.SoldOut].includes(poolStatus) ? "red" : ""}`}
      >
        <Link
          className={`launchpad-item flex flex-col p-4 xl:p-5 bg-eerie-black ${[POOL_STATUS.Active].includes(poolStatus) ? "" : "cursor-auto"}`}
          href={
            [POOL_STATUS.Active].includes(poolStatus)
              ? `/launchpad/${pool.address}`
              : "#"
          }
          onClick={(e) => {
            if (![POOL_STATUS.Active].includes(poolStatus)) {
              e.preventDefault();
            }
          }}
        >
          <div className="flex flex-col gap-4 z-1 pointer-events-none">
            <div className="flex justify-between items-center gap-2">
              <div className="flex flex-auto w-0">
                <p className="text-lg leading-none font-semibold text-white line-clamp-1">
                  {pool.name}
                </p>
              </div>
              <PoolStatus status={poolStatus} />
            </div>
            <div className="flex flex-col gap-2">
              <h3 className="text-sm leading-none text-white/70">
                TOTAL RAISED
              </h3>
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                  {pool.paymentRules
                    .filter((r) => r.enabled)
                    ?.map((rule) => {
                      const token = ALL_TOKENS?.[pool.chainId]?.find(
                        (t) =>
                          t.chainId === pool.chainId &&
                          t.address.toLowerCase() ===
                            rule.paymentToken.address.toLowerCase(),
                      );
                      return (
                        <div key={rule.index} className="w-6">
                          <Image
                            src={token?.logo ?? ""}
                            alt={token?.symbol ?? rule.paymentToken.symbol}
                            width={24}
                            height={24}
                            className="w-full"
                          />
                        </div>
                      );
                    })}
                </div>
                <div className="w-30 px-3 py-1 bg-dark-greenish-gray bg-clip-padding border-gradient-rounded rounded-md">
                  <div className="text-base font-semibold text-electric-cyan text-center uppercase">
                    {price > 0 ? price : "-"} {DEFAULT_PRICE_SYMBOL}
                  </div>
                </div>
              </div>
            </div>
            <div className="h-0.25 rounded-xs bg-dark-gray" />
            <StakedProgress
              totalCap={totalCap}
              totalSold={totalSold}
              price={price}
              showProgress={showProgress}
            />
            <PoolOverview
              pool={pool}
              totalCap={totalCap}
              totalRemaining={totalRemaining}
            />
            <IdoEnded
              pool={pool}
              poolStatus={poolStatus}
              setPoolStatus={setPoolStatus}
            />
          </div>
        </Link>
      </GlowingEdgeCard>
    </motion.div>
  );
}

export default function LaunchpadList({ pools }: { pools: Pool[] }) {
  return (
    <>
      <div className="launchpad w-full max-w-370 min-h-100 mx-auto px-4 md:px-6 lg:px-8 xl:px-9 2xl:px-10 py-20 relative z-[1] overflow-hidden antialiased">
        <div className="launchpad-list flex flex-wrap gap-4 justify-center xl:justify-start">
          {pools.map((item) => (
            <Item key={item.id} pool={item} />
          ))}
        </div>
      </div>
    </>
  );
}
