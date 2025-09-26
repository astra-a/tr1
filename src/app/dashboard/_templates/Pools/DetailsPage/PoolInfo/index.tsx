"use client";

import { Pool } from "@/payload-types";
import Jdenticon from "react-jdenticon";
import {
  DashboardStatusLabels,
  DAY_SECONDS,
  POOL_STATUS,
  PoolStatusLabels,
} from "@/constants";
import {
  getAprPercent,
  shortenAddress,
  shortenHash,
  displayBalance,
} from "@/web3";
import Parameter from "../../Parameter";
import { useChains } from "wagmi";
import { useMemo } from "react";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";

dayjs.extend(utc);

const PoolInfo = ({ pool }: { pool: Pool }) => {
  const chains = useChains();
  const chain = useMemo(
    () => chains.find((c) => c.id === pool.chainId),
    [pool.id],
  );

  return (
    <div className="shrink-0 w-full border-1 border-s-stroke2 rounded-4xl overflow-hidden">
      <div className="flex items-center gap-8 p-8 max-2xl:gap-4 max-2xl:p-5 max-md:p-3">
        <div className="shrink-0">
          <Jdenticon size={88} value={`${pool.name}-${pool.address}`} />
        </div>
        <div className="grow">
          <div className="flex gap-2">
            <div className={`mb-2 label ${DashboardStatusLabels[pool.status]}`}>
              {PoolStatusLabels[pool.status]}
            </div>
            {POOL_STATUS.Paused === pool.status && (
              <div
                className={`mb-2 label ${pool.isHidden ? "label-gray" : "label-green"}`}
              >
                {pool.isHidden ? "Hidden" : "Shown"}
              </div>
            )}
          </div>
          <div className="text-h5 max-2xl:text-h6">{pool.name}</div>
        </div>
      </div>
      <div className="bg-shade-09/30 max-lg:flex max-lg:flex-wrap max-md:block dark:bg-shade-02">
        <Parameter label="Network" content={pool.network} />
        <Parameter
          label="Address"
          content={
            pool.address ? (
              <a
                href={`${chain?.blockExplorers?.default?.url}/address/${pool.address}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-green-700 underline"
              >
                {shortenAddress(pool.address)}
              </a>
            ) : (
              "-"
            )
          }
        />
        {/*<Parameter label="Team" content={pool.team} />*/}
        <Parameter label="APR" content={getAprPercent(pool.apr)} />
        <Parameter
          label="Lock Duration"
          content={`${(pool.lockDuration / DAY_SECONDS).toLocaleString(undefined, { maximumFractionDigits: 2 })} days`}
        />
        <Parameter
          label="Sale Duration"
          content={`${(pool.saleDuration / DAY_SECONDS).toLocaleString(undefined, { maximumFractionDigits: 2 })} days`}
        />
        <Parameter
          label="Sale Started At"
          content={dayjs
            .unix(pool.saleStartedAt)
            .utc()
            .format("DD MMM, hh:mm A [UTC]")}
        />
        <Parameter
          label="Paused Duration Sum"
          content={`${pool.pausedDurationSum} seconds`}
        />
        <Parameter
          label="Deployed At"
          content={
            pool.deployedAt
              ? dayjs
                  .unix(pool.deployedAt)
                  .utc()
                  .format("DD MMM, hh:mm A [UTC]")
              : "-"
          }
        />
        <Parameter
          label="Total Sale Cap"
          content={`${displayBalance(pool.totalSaleCap)} ${pool.saleToken.symbol}`}
        />
        {pool.paymentRules?.map((rule, index) => (
          <Parameter
            key={rule.index}
            label={`Payment Rule ${rule.index + 1}`}
            content={
              <div className="flex flex-col items-end gap-1">
                <p>
                  <a
                    href={`${chain?.blockExplorers?.default?.url}/address/${rule.paymentToken.address}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-green-700 underline"
                  >
                    {rule.paymentToken.symbol} (decimals:{" "}
                    {rule.paymentToken.decimals})
                  </a>
                </p>
                <table className="border-collapse border-none font-normal">
                  <tbody>
                    <tr className="border-none">
                      <td align="right" className="py-1 pr-1 border-none">
                        Price:
                      </td>
                      <td className="py-1 pl-1 border-none">
                        {rule.price} {rule.paymentToken.symbol}
                      </td>
                    </tr>
                    <tr className="border-none">
                      <td align="right" className="py-1 pr-1 border-none">
                        Min Purchase:
                      </td>
                      <td className="py-1 pl-1 border-none">
                        {displayBalance(rule.minPurchase)}{" "}
                        {rule.paymentToken.symbol}
                      </td>
                    </tr>
                    <tr className="border-none">
                      <td align="right" className="py-1 pr-1 border-none">
                        Max Purchase:
                      </td>
                      <td className="py-1 pl-1 border-none">
                        {displayBalance(rule.maxPurchase)}{" "}
                        {rule.paymentToken.symbol}
                      </td>
                    </tr>
                    <tr className="border-none">
                      <td align="right" className="py-1 pr-1 border-none">
                        Status:
                      </td>
                      <td className="py-1 pl-1 border-none">
                        {rule.enabled ? "enabled" : "disabled"}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            }
          />
        ))}
        <Parameter
          label="Sale Token"
          content={
            <a
              href={`${chain?.blockExplorers?.default?.url}/address/${pool.saleToken.address}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-green-700 underline"
            >
              {pool.saleToken.symbol} (decimals: {pool.saleToken.decimals})
            </a>
          }
        />
        <Parameter
          label="Treasury"
          content={
            <a
              href={`${chain?.blockExplorers?.default?.url}/address/${pool.treasury}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-green-700 underline"
            >
              {shortenAddress(pool.treasury)}
            </a>
          }
        />
        <Parameter
          label="Creator"
          content={
            <a
              href={`${chain?.blockExplorers?.default?.url}/address/${pool.creator}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-green-700 underline"
            >
              {shortenHash(pool.creator)}
            </a>
          }
        />
        <Parameter
          label="Created At"
          content={dayjs(pool.createdAt).utc().format("DD MMM, hh:mm A [UTC]")}
        />
        {pool.createdHash ? (
          <Parameter
            label="Created Hash"
            content={
              <a
                href={`${chain?.blockExplorers?.default?.url}/tx/${pool.createdHash}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-green-700 underline"
              >
                {shortenHash(pool.createdHash)}
              </a>
            }
          />
        ) : (
          <></>
        )}

        {/*<Parameter*/}
        {/*  label="Post downloaded"*/}
        {/*  content={<div className="label label-green">Yes</div>}*/}
        {/*/>*/}
        {/*<Parameter*/}
        {/*  label="Price"*/}
        {/*  content="$72.88"*/}
        {/*  tooltip="Maximum 100 characters. No HTML or emoji allowed"*/}
        {/*/>*/}
      </div>
    </div>
  );
};

export default PoolInfo;
