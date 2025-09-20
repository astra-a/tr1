import { NextResponse } from "next/server";
import {
  queryMediaById,
  updateMediaById,
} from "@/app/dashboard/_helpers/media";

export async function POST(
  req: Request,
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

  const formData = await req.formData();
  const data = { alt: formData.get("alt") as string };
  // console.log("POST.data:", data);

  try {
    const resp = await updateMediaById({ id, data });
    console.log("update.media.resp:", resp);
    return NextResponse.json({
      ok: true,
      message: "Media updated successfully",
      data: resp,
    });
  } catch (e: any) {
    console.error("update.media.err:", e);
    return NextResponse.json(
      { ok: false, message: e?.toString() },
      { status: e?.status ?? 400 },
    );
  }
}
