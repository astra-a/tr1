"use client";

import { useEffect, useState } from "react";
import Card from "@/app/dashboard/_components/Card";
import { Pool } from "@/payload-types";
import { usePoolStats } from "@/subgraph";
import Parameter from "../../Parameter";
import { displayBalance } from "@/web3";
import { useQuery } from "@tanstack/react-query";

interface IAmounts {
  totalSaleCap: number;
  totalReward: number;

  totalSoldAmount: number; // totalSold + totalRewarded
  totalSold: number;
  totalRewarded: number;

  leftInPool: number; // totalCap - totalSold
  leftRewardInPool: number; // totalReward - totalRewarded

  participants: number;
}

const Statistics = ({ pool }: { pool: Pool }) => {
  const [amounts, setAmounts] = useState<IAmounts>({
    totalSaleCap: 0,
    totalReward: 0,
    totalSoldAmount: 0,
    totalSold: 0,
    totalRewarded: 0,
    leftInPool: 0,
    leftRewardInPool: 0,
    participants: 0,
  });
  const { data: stats, refetch: refetchPoolStats } = usePoolStats(
    pool.chainId,
    pool.address,
  );
  useEffect(() => {
    if (stats) {
      const totalSaleCap = Number(stats.totalSaleCap);
      const totalReward = Number(stats.totalReward);
      const totalSold = Number(stats.totalSold);
      const totalRewarded = Number(stats.totalRewarded);
      setAmounts({
        totalSaleCap,
        totalReward,
        totalSoldAmount: totalSold + totalRewarded,
        totalSold,
        totalRewarded,
        leftInPool: totalSaleCap - totalSold,
        leftRewardInPool: totalReward - totalRewarded,
        participants: stats.participants,
      });
    }
  }, [stats]);

  const { data: updateData } = useQuery({
    queryKey: ["updatePool-success", pool.chainId, pool.address],
    queryFn: (): number | null => null,
  });
  useEffect(() => {
    if (updateData) {
      // console.log("_updateData", updateData);
      refetchPoolStats?.();
    }
  }, [updateData]);

  return (
    <Card title="Statistics">
      <div className="flex-auto">
        <Parameter
          label="Sold Amount"
          content={`${displayBalance(amounts.totalSold)} / ${displayBalance(amounts.totalRewarded)} ${pool.saleToken.symbol}`}
        />
        <Parameter
          label="Left in Pool"
          content={`${displayBalance(amounts.leftInPool)} / ${displayBalance(amounts.leftRewardInPool)} ${pool.saleToken.symbol}`}
        />
        <Parameter label="Participants" content={amounts.participants} />
      </div>
    </Card>
  );
};

export default Statistics;
