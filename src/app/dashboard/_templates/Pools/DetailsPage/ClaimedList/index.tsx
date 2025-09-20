"use client";

import { useMemo, useState } from "react";
import Table from "@/app/dashboard/_components/Table";
import TableRow from "@/app/dashboard/_components/TableRow";
import Card from "@/app/dashboard/_components/Card";
import { Pool } from "@/payload-types";
import { usePoolClaimedPurchases } from "@/subgraph";
import { displayBalance, shortenAddress } from "@/web3";
import dayjs from "dayjs";
import { MoonLoader } from "react-spinners";
import Button from "@/app/dashboard/_components/Button";
import { useChains } from "wagmi";

const PAGE_SIZE = 10;

const ClaimedList = ({ pool }: { pool: Pool }) => {
  const chains = useChains();
  const chain = useMemo(
    () => chains.find((c) => c.id === pool.chainId),
    [pool.id],
  );

  const tableHeads = useMemo(
    () => [
      { field: "claimedAt", title: "Date", enableSort: true },
      { field: "buyer__id", title: "Buyer" },
      { field: "paymentAmount", title: "Payment" },
      { field: "claimedAmount", title: `Claimed` },
      { field: "", title: `` },
    ],
    [pool.saleToken.symbol],
  );

  const [orderBy, setOrderBy] = useState("claimedAt");
  const [orderDirection, setOrderDirection] = useState<"asc" | "desc">("desc");
  const [skip, setSkip] = useState(0);
  const { data, isFetching } = usePoolClaimedPurchases(
    pool.chainId,
    pool.address,
    orderBy,
    orderDirection,
    PAGE_SIZE,
    skip,
  );

  return (
    <Card title="Claimed">
      <div className="flex-auto">
        <div className="p-1 max-md:pt-3 max-lg:px-0">
          <Table
            cellsThead={tableHeads.map((head, i) => (
              <th
                className="!h-12.5 last:text-right max-lg:nth-4:hidden max-lg:nth-6:hidden max-md:nth-3:hidden max-md:nth-5:hidden"
                key={i}
              >
                {head.enableSort ? (
                  <button
                    className="inline-flex items-center gap-1"
                    onClick={() => {
                      if (head.field === orderBy) {
                        setOrderDirection(
                          "asc" === orderDirection ? "desc" : "asc",
                        );
                      } else {
                        setOrderBy(head.field);
                        setOrderDirection("asc");
                      }
                    }}
                  >
                    <p>{head.title}</p>
                    <div className="flex flex-col gap-0.5">
                      <div
                        className={`sort-asc ${head.field === orderBy && "asc" === orderDirection ? "active" : ""}`}
                      />
                      <div
                        className={`sort-desc ${head.field === orderBy && "desc" === orderDirection ? "active" : ""}`}
                      />
                    </div>
                  </button>
                ) : (
                  head.title
                )}
              </th>
            ))}
            isMobileVisibleTHead
          >
            {data?.length ? (
              data.map((purchase) => (
                <TableRow key={purchase.id}>
                  <td className="max-md:text-caption">
                    <a
                      href={`${chain?.blockExplorers?.default?.url}/tx/${purchase.claimedHash}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="underline"
                    >
                      {dayjs
                        .unix(Number(purchase.claimedAt))
                        .format("DD MMM, hh:mm A")}
                    </a>
                  </td>
                  <td>
                    <a
                      href={`${chain?.blockExplorers?.default?.url}/address/${purchase.buyer.id}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="underline"
                    >
                      {shortenAddress(purchase.buyer.id)}
                    </a>
                  </td>
                  <td className="max-md:hidden">
                    {displayBalance(purchase.paymentAmount)}{" "}
                    {purchase.paymentToken.symbol}
                  </td>
                  <td className="max-lg:hidden">
                    {displayBalance(purchase?.claimedAmount ?? "0")} (
                    {displayBalance(purchase?.claimedSaleAmount ?? "0")}
                    {` + `}
                    {displayBalance(purchase?.claimedRewardAmount ?? "0")})
                  </td>
                  <td />
                </TableRow>
              ))
            ) : isFetching ? (
              <tr>
                <td colSpan={tableHeads.length}>
                  <div className="w-full min-h-50 flex justify-center items-center">
                    <MoonLoader size={36} color="rgba(0,0,0,0.75)" />
                  </div>
                </td>
              </tr>
            ) : (
              <tr>
                <td colSpan={tableHeads.length}>
                  <div className="w-full min-h-50 flex justify-center items-center text-base text-black/75">
                    <p>No Data</p>
                  </div>
                </td>
              </tr>
            )}
          </Table>
          <div className="flex justify-center gap-2 mt-5">
            <Button
              className="rotate-180"
              icon="arrow"
              isCircle
              isStroke
              disabled={0 === skip}
              onClick={() => setSkip(skip > PAGE_SIZE ? skip - PAGE_SIZE : 0)}
            />
            <Button
              icon="arrow"
              isCircle
              isStroke
              disabled={(data?.length ?? 0) < PAGE_SIZE}
              onClick={() => setSkip(skip + PAGE_SIZE)}
            />
          </div>
        </div>
      </div>
    </Card>
  );
};

export default ClaimedList;
