"use client";

import Card from "@/app/dashboard/_components/Card";
import Item from "../BalanceItem";
import { Chain } from "viem";
import { useEffect, useMemo, useState } from "react";
import { TOTAL_SALE_CAP } from "@/constants";
import { useFactoryStats } from "@/subgraph";
import { FACTORIES } from "@/web3";

interface IAmounts {
  // totalCap: number;
  // totalReward: number;

  totalSold: number;
  totalRewarded: number;
  totalSoldAmount: number; // totalSold + totalRewarded

  leftInPool: number; // totalCap - totalSold
  leftRewardInPool: number; // totalReward - totalRewarded
  leftAmountInPool: number; // leftInPool + leftRewardInPool

  leftAllocation: number; // TOTAL_SALE_CAP - totalCap - totalReward
}

const SaleBalance = ({ chain }: { chain: Chain }) => {
  const factory = useMemo(() => FACTORIES[chain.id], [chain.id]);
  const { data: stats } = useFactoryStats(chain.id, factory.address);

  const [amounts, setAmounts] = useState<IAmounts>({
    // totalCap: 0,
    // totalReward: 0,
    totalSold: 0,
    totalRewarded: 0,
    totalSoldAmount: 0,
    leftInPool: 0,
    leftRewardInPool: 0,
    leftAmountInPool: 0,
    leftAllocation: 0,
  });

  useEffect(() => {
    if (stats) {
      const totalCap = Number(stats.totalCap);
      const totalReward = Number(stats.totalReward);
      const totalSold = Number(stats.totalSold);
      const totalRewarded = Number(stats.totalRewarded);
      const leftInPool = totalCap - totalSold;
      const leftRewardInPool = totalReward - totalRewarded;
      setAmounts({
        // totalCap,
        // totalReward,
        totalSold,
        totalRewarded,
        totalSoldAmount: totalSold + totalRewarded,
        leftInPool,
        leftRewardInPool,
        leftAmountInPool: leftInPool + leftRewardInPool,
        leftAllocation: TOTAL_SALE_CAP - totalCap - totalReward,
      });
    }
  }, [stats]);

  return (
    <Card className="h-full max-md:overflow-hidden" title="Sale">
      <div className="relative p-5 pt-4 before:hidden after:hidden before:absolute before:-left-3 before:top-0 before:bottom-0 before:z-3 before:w-8 before:bg-linear-to-r before:from-b-surface2 before:to-transparent before:pointer-events-none after:absolute after:-right-3 after:top-0 after:bottom-0 after:z-3 after:w-8 after:bg-linear-to-l after:from-b-surface2 after:to-transparent after:pointer-events-none max-lg:p-3 max-md:before:block max-md:after:block">
        <div className="flex gap-6 max-md:-mx-6 max-md:px-6 max-md:gap-6 max-md:overflow-auto max-md:scrollbar-none">
          <Item
            title={`Sold`}
            token={factory.saleToken}
            value={amounts.totalSoldAmount}
            subValues={stats ? [amounts.totalSold, amounts.totalRewarded] : []}
          />
          <Item
            title={`Left in Pool`}
            token={factory.saleToken}
            value={amounts.leftAmountInPool}
            subValues={
              stats ? [amounts.leftInPool, amounts.leftRewardInPool] : []
            }
            showTokenIcon={false}
          />
          <Item
            title={`Left in Allocation`}
            token={factory.saleToken}
            value={amounts.leftAllocation}
            showTokenIcon={false}
          />
        </div>
      </div>
    </Card>
  );
};

export default SaleBalance;
