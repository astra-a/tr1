"use client";

import Link from "next/link";
import Table from "@/app/dashboard/_components/Table";
import TableRow from "@/app/dashboard/_components/TableRow";
import TablePoolCell from "@/app/dashboard/_components/TablePoolCell";
import Icon from "@/app/dashboard/_components/Icon";
import { ROUTES } from "@/app/dashboard/_contstants/routes";
import { Pool } from "@/payload-types";
import {
  DashboardStatusLabels,
  POOL_STATUS,
  PoolStatusLabels,
} from "@/constants";
import Jdenticon from "react-jdenticon";
import { displayBalance } from "@/web3";
import { useMemo } from "react";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";

dayjs.extend(utc);

function Item({ pool }: { pool: Pool }) {
  return (
    <TableRow>
      <TablePoolCell
        title={pool.name}
        details={""}
        image={<Jdenticon size={64} value={`${pool.name}-${pool.address}`} />}
      >
        <Link className="action" href={ROUTES.pools_details(pool.id)}>
          <Icon name="edit" />
          Detail
        </Link>
        {/*<button className="action">*/}
        {/*  <Icon name="trash" />*/}
        {/*  Refund*/}
        {/*</button>*/}
        {/*<button className="action">*/}
        {/*  <Icon name="chain" />*/}
        {/*  Decline*/}
        {/*</button>*/}
      </TablePoolCell>
      <td className="max-md:hidden">
        <div className={`label ${DashboardStatusLabels[pool.status]}`}>
          {PoolStatusLabels[pool.status]}
          {POOL_STATUS.Paused === pool.status
            ? pool.isHidden
              ? "(Hidden)"
              : "(Shown)"
            : ""}
        </div>
      </td>
      <td className="max-md:hidden">
        {pool.paymentRules?.map((rule) => (
          <p key={rule.index}>
            {displayBalance(rule.price)} {rule.paymentToken.symbol}
          </p>
        ))}
      </td>
      <td className="max-lg:hidden">
        {displayBalance(pool.totalSold)} / {displayBalance(pool.totalSaleCap)}
      </td>
      <td className="max-lg:hidden">
        {dayjs(pool.createdAt).utc().format("DD MMM, hh:mm A")}
      </td>
    </TableRow>
  );
}

const List = ({ pools }: { pools: Pool[] }) => {
  const tableHeads = useMemo(
    () => ["Pool", "Status", "Price", `Sale Cap`, "Created At (UTC 0:00)"],
    [],
  );

  return (
    <Table
      cellsThead={tableHeads.map((head) => (
        <th className="max-lg:nth-5:hidden max-lg:last:hidden" key={head}>
          {head}
        </th>
      ))}
    >
      {pools.map((pool) => (
        <Item key={pool.id} pool={pool} />
      ))}
    </Table>
  );
};

export default List;
