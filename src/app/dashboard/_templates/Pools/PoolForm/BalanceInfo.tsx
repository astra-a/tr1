"use client";

import Card from "@/app/dashboard/_components/Card";
import { displayBalance, IFactory } from "@/web3";
import Parameter from "../Parameter";

const BalanceInfo = ({
  factory,
  saleTokenBalance,
  saleTokenAllowance,
  totalRequired,
}: {
  factory: IFactory;
  saleTokenBalance: string;
  saleTokenAllowance: string;
  totalRequired: string;
}) => {
  return (
    <Card classHead="!pl-3" title="Overview">
      <div className="p-3">
        <Parameter
          label="Your Balance"
          content={`${displayBalance(saleTokenBalance)} ${factory.saleToken.symbol}`}
        />
        <Parameter
          label="Your Allowance"
          content={`${displayBalance(saleTokenAllowance)} ${factory.saleToken.symbol}`}
        />
        <Parameter
          label="Total Required"
          content={`${displayBalance(totalRequired)} ${factory.saleToken.symbol}`}
        />
      </div>
    </Card>
  );
};

export default BalanceInfo;
