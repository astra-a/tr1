import { NextResponse } from "next/server";
import { createMedia } from "@/app/dashboard/_helpers/media";

export async function POST(req: Request) {
  const formData = await req.formData();
  const file = formData.get("file") as File | null;
  if (!file) {
    return NextResponse.json(
      { ok: false, message: "No file upload." },
      { status: 400 },
    );
  }
  const bytes = await file.arrayBuffer();
  const data = {
    id: "",
    alt: formData.get("alt") as string,
    createdAt: "",
    updatedAt: "",
  };
  // console.log("POST.data:", data);

  try {
    const resp = await createMedia({
      data,
      file: {
        data: Buffer.from(bytes),
        mimetype: file.type,
        name: file.name,
        size: file.size,
      },
    });
    console.log("create.media.resp:", resp);
    return NextResponse.json({
      ok: true,
      message: "Media created successfully",
      data: resp,
    });
  } catch (e: any) {
    console.error("create.media.err:", e);
    return NextResponse.json(
      { ok: false, message: e?.toString() },
      { status: e?.status ?? 400 },
    );
  }
}
