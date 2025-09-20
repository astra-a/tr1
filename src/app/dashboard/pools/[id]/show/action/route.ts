import { NextResponse } from "next/server";
import { queryPoolById, updatePoolById } from "@/app/dashboard/_helpers/pools";

export async function POST(
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;

  const pool = await queryPoolById({ id });
  if (!pool) {
    return NextResponse.json(
      { ok: false, message: "Pool not found" },
      { status: 404 },
    );
  }

  try {
    const resp = await updatePoolById({ id, data: { isHidden: false } });
    console.log("show.pool.resp:", resp);
    return NextResponse.json({
      ok: true,
      message: "Pool shown successfully",
      data: { id },
    });
  } catch (e: any) {
    console.error("show.pool.err:", e);
    return NextResponse.json(
      { ok: false, message: e?.toString() },
      { status: e?.status ?? 400 },
    );
  }
}
