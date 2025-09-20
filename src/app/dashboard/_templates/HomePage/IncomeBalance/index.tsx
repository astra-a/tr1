"use client";

import Card from "@/app/dashboard/_components/Card";
import Item from "../BalanceItem";
import { Chain } from "viem";
import { useMemo } from "react";
import { IToken, PAYMENT_TOKENS } from "@/web3";
import { useTokensStats } from "@/subgraph";

const IncomeBalance = ({ chain }: { chain: Chain }) => {
  const [tokens, tokenAddresses] = useMemo(() => {
    const _tokens: IToken[] = [];
    const _tokenAddresses: string[] = [];
    if (chain.id in PAYMENT_TOKENS) {
      PAYMENT_TOKENS[chain.id].forEach((t) => {
        _tokens.push(t);
        _tokenAddresses.push(t.address.toLowerCase());
      });
    }
    return [_tokens, _tokenAddresses];
  }, [chain.id]);
  const { data } = useTokensStats(chain.id, tokenAddresses);

  return (
    <Card className="h-full max-md:overflow-hidden" title="Income">
      <div className="relative p-5 pt-4 before:hidden after:hidden before:absolute before:-left-3 before:top-0 before:bottom-0 before:z-3 before:w-8 before:bg-linear-to-r before:from-b-surface2 before:to-transparent before:pointer-events-none after:absolute after:-right-3 after:top-0 after:bottom-0 after:z-3 after:w-8 after:bg-linear-to-l after:from-b-surface2 after:to-transparent after:pointer-events-none max-lg:p-3 max-md:before:block max-md:after:block">
        <div className="flex gap-6 max-md:-mx-6 max-md:px-6 max-md:gap-6 max-md:overflow-auto max-md:scrollbar-none">
          {tokens.map((token) => {
            const incomeInfo = data?.find(
              (d) => d.id === token.address.toLowerCase(),
            );
            return (
              <Item
                key={token.address}
                token={token}
                value={incomeInfo ? Number(incomeInfo.totalIncomeAmount) : 0}
              />
            );
          })}
        </div>
      </div>
    </Card>
  );
};

export default IncomeBalance;
