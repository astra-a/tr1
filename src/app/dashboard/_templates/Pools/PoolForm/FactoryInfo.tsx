"use client";

import Card from "@/app/dashboard/_components/Card";
import { IFactory, shortenAddress } from "@/web3";
import { Chain } from "viem";
import Parameter from "../Parameter";

const FactoryInfo = ({
  chain,
  factory,
}: {
  chain: Chain;
  factory: IFactory;
}) => {
  return (
    <Card classHead="!pl-3" title="Factory Info">
      <div className="p-3">
        <Parameter
          label="Factory Address"
          content={
            <a
              href={`${chain.blockExplorers?.default.url}/address/${factory.address}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-green-700 underline"
            >
              {shortenAddress(factory.address)}
            </a>
          }
        />
        <Parameter
          label="Treasury Address"
          content={
            <a
              href={`${chain.blockExplorers?.default.url}/address/${factory.treasury}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-green-700 underline"
            >
              {shortenAddress(factory.treasury)}
            </a>
          }
        />
        <Parameter
          label={`Sale Token`}
          content={
            <div className="flex flex-col items-end gap-1">
              <p>
                <a
                  href={`${chain.blockExplorers?.default.url}/address/${factory.saleToken.address}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-green-700 underline"
                >
                  {shortenAddress(factory.saleToken.address)}
                </a>
              </p>
              <table className="border-collapse border-none font-normal">
                <tbody>
                  <tr className="border-none">
                    <td align="right" className="py-1 pr-1 border-none">
                      Name:
                    </td>
                    <td className="py-1 pl-1 border-none">
                      {factory.saleToken.name}
                    </td>
                  </tr>
                  <tr className="border-none">
                    <td align="right" className="py-1 pr-1 border-none">
                      Symbol:
                    </td>
                    <td className="py-1 pl-1 border-none">
                      {factory.saleToken.symbol}
                    </td>
                  </tr>
                  <tr className="border-none">
                    <td align="right" className="py-1 pr-1 border-none">
                      Decimals:
                    </td>
                    <td className="py-1 pl-1 border-none">
                      {factory.saleToken.decimals}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          }
        />
      </div>
    </Card>
  );
};

export default FactoryInfo;
