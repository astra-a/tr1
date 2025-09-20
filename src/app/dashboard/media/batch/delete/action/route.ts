import { NextResponse } from "next/server";
import { deleteMediaByIds } from "@/app/dashboard/_helpers/media";

export async function POST(req: Request) {
  const ids = (await req.json()) as string[];

  try {
    const resp = await deleteMediaByIds({ ids });
    console.log("batch.delete.media.resp:", resp);
    return NextResponse.json({
      ok: true,
      message: `${resp.docs.length} media${resp.docs.length > 1 ? "s" : ""} deleted successfully`,
      data: { ids: resp.docs.map(({ id }) => id) },
    });
  } catch (e: any) {
    console.error("batch.delete.media.err:", e);
    return NextResponse.json(
      { ok: false, message: e?.toString() },
      { status: e?.status ?? 400 },
    );
  }
}
