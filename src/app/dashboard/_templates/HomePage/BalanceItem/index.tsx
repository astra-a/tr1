"use client";

import { displayBalance, IToken } from "@/web3";
import Image from "next/image";
import CountUp from "react-countup";

const Item = ({
  title,
  token,
  value,
  subValues,
  showTokenIcon = true,
}: {
  title?: string;
  token: IToken;
  value: number;
  subValues?: number[];
  showTokenIcon?: boolean;
}) => {
  return (
    <div className="flex-1 pr-4 border-r border-shade-07/10 last:border-r-0 max-md:flex-auto max-md:shrink-0 max-md:w-62">
      <div className="relative">
        <div className="relative z-2 grow">
          <div className="flex items-center gap-2 mb-2">
            {showTokenIcon ? (
              <div className="w-8 h-8">
                <Image
                  src={token?.logo ?? ""}
                  alt={token?.symbol}
                  width={32}
                  height={32}
                  className="w-full"
                />
              </div>
            ) : (
              <div className="h-8" />
            )}
            <div className="text-sub-title-1">{title ?? token?.symbol}</div>
          </div>
          <div
            className={`flex mb-3 text-h4 ${value < 0 ? "text-red-600" : ""}`}
          >
            <CountUp
              // key={title}
              // start={0}
              end={value}
              decimals={value > 1_000_000 ? 0 : value > 1_000 ? 2 : 4}
              preserveValue
            />
          </div>
          {subValues?.length ? (
            <p className="text-base font-semibold">
              {subValues.map((v) => displayBalance(v)).join(" + ")}
            </p>
          ) : (
            <></>
          )}
        </div>
      </div>
    </div>
  );
};

export default Item;
