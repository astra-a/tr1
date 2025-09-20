import { NextResponse } from "next/server";
import { POOL_STATUS } from "@/constants";
import {
  createPool,
  queryPoolByChainAndTransaction,
  updatePoolById,
} from "@/app/dashboard/_helpers/pools";
import { Pool } from "@/payload-types";

export async function POST(req: Request) {
  const json = (await req.json()) as Pick<
    Pool,
    | "chainId"
    | "network"
    | "name"
    | "team"
    | "treasury"
    | "paymentRules"
    | "saleToken"
    | "apr"
    | "saleStartedAt"
    | "saleDuration"
    | "lockDuration"
    | "totalSaleCap"
    | "creator"
    | "createdHash"
  >;

  try {
    let existedPool: Pool | undefined = undefined;
    if (json.chainId && json.createdHash) {
      existedPool = await queryPoolByChainAndTransaction({
        chainId: json.chainId,
        createdHash: json.createdHash,
      });
    }
    const resp = await (existedPool
      ? updatePoolById({ id: existedPool.id, data: json })
      : createPool({
          data: {
            ...json,
            status: POOL_STATUS.Creating,
            isHidden: false,
            deployedAt: 0,
            pausedDurationSum: 0,
            totalSold: "0",
          },
        }));
    console.log("create.pool.resp:", resp);
    return NextResponse.json({
      ok: true,
      message: "Pool created successfully",
      data: { id: resp.id },
    });
  } catch (e: any) {
    console.error("create.pool.err:", e);
    return NextResponse.json(
      { ok: false, message: e?.toString() },
      { status: e?.status ?? 400 },
    );
  }
}
