"use client";

import Card from "@/app/dashboard/_components/Card";
import { Pool } from "@/payload-types";
import Parameter from "@/app/dashboard/_templates/Pools/Parameter";
import { POOL_STATUS } from "@/constants";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useRafInterval } from "ahooks";
import dayjs from "dayjs";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import StatusControl from "./StatusControl";
import IncreaseSaleCap from "./IncreaseSaleCap";
import { useQueryClient } from "@tanstack/react-query";
import HiddenControl from "./HiddenControl";

const Operations = ({ pool }: { pool: Pool }) => {
  const router = useRouter();
  const [delay, setDelay] = useState<number | undefined>(undefined);
  useRafInterval(() => {
    console.log("refresh at", dayjs().format("mm:ss SSS"));
    router.refresh();
  }, delay);

  const queryClient = useQueryClient();
  const cacheRef = useRef({
    status: pool.status,
    totalSaleCap: pool.totalSaleCap,
  });
  useEffect(() => {
    if (POOL_STATUS.Creating === pool.status) {
      setDelay(1_000);
    }
    if (
      cacheRef.current.status !== pool.status ||
      cacheRef.current.totalSaleCap !== pool.totalSaleCap
    ) {
      cacheRef.current = {
        status: pool.status,
        totalSaleCap: pool.totalSaleCap,
      };
      setDelay(undefined);
      queryClient.setQueryData(
        ["updatePool-success", pool.chainId, pool.address],
        Date.now(),
      );
    }
  }, [pool.status, pool.totalSaleCap]);

  return (
    <Card
      title="Operation"
      headContent={
        <ConnectButton
          accountStatus="address"
          chainStatus="name"
          showBalance={false}
        />
      }
    >
      <div className="flex-auto">
        {POOL_STATUS.Paused === pool.status && (
          <>
            <Parameter
              label="Unpause"
              content={
                <StatusControl
                  pool={pool}
                  action="unpause"
                  buttonText="Unpause"
                  buttonClassName="!border-primary-02"
                  txSent={() => setDelay(1_000)}
                />
              }
            />
            {pool.isHidden ? (
              <Parameter
                label="Shown"
                content={
                  <HiddenControl
                    pool={pool}
                    action="show"
                    buttonText="Show"
                    buttonClassName="!border-shade-06"
                    onSuccess={() => router.refresh()}
                  />
                }
              />
            ) : (
              <Parameter
                label="Hidden"
                content={
                  <HiddenControl
                    pool={pool}
                    action="hide"
                    buttonText="Hide"
                    buttonClassName="!border-shade-06"
                    onSuccess={() => router.refresh()}
                  />
                }
              />
            )}
          </>
        )}
        {[POOL_STATUS.Active, POOL_STATUS.SoldOut].includes(
          pool.status as POOL_STATUS,
        ) && (
          <Parameter
            label="Pause"
            content={
              <StatusControl
                pool={pool}
                action="pause"
                buttonText="Pause"
                buttonClassName="!border-shade-06"
                txSent={() => setDelay(1_000)}
              />
            }
          />
        )}
        {[
          POOL_STATUS.Active,
          POOL_STATUS.Paused,
          POOL_STATUS.SoldOut,
          POOL_STATUS.Upcoming,
        ].includes(pool.status as POOL_STATUS) && (
          <>
            <Parameter
              label="Stop"
              content={
                <StatusControl
                  pool={pool}
                  action="stop"
                  buttonText="Stop"
                  buttonClassName="!border-[#EF9D0E]"
                  txSent={() => setDelay(1_000)}
                />
              }
            />
            <Parameter
              label="Increase Cap"
              content={
                <IncreaseSaleCap pool={pool} txSent={() => setDelay(1_000)} />
              }
            />
          </>
        )}
      </div>
    </Card>
  );
};

export default Operations;
