import { NextResponse } from "next/server";
import {
  deleteMediaById,
  queryMediaById,
} from "@/app/dashboard/_helpers/media";

export async function POST(
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;

  const media = await queryMediaById({ id });
  if (!media) {
    return NextResponse.json(
      { ok: false, message: "Media not found" },
      { status: 404 },
    );
  }

  try {
    const resp = await deleteMediaById({ id });
    console.log("delete.media.resp:", resp);
    return NextResponse.json({
      ok: true,
      message: "Media deleted successfully",
      data: { id },
    });
  } catch (e: any) {
    console.error("delete.media.err:", e);
    return NextResponse.json(
      { ok: false, message: e?.toString() },
      { status: e?.status ?? 400 },
    );
  }
}
