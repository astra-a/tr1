import { NextResponse } from "next/server";
import { deletePostsByIds } from "@/app/dashboard/_helpers/posts";

export async function POST(req: Request) {
  const ids = (await req.json()) as string[];

  try {
    const resp = await deletePostsByIds({ ids });
    console.log("batch.delete.post.resp:", resp);
    return NextResponse.json({
      ok: true,
      message: `${resp.docs.length} Post${resp.docs.length > 1 ? "s" : ""} deleted successfully`,
      data: { ids: resp.docs.map(({ id }) => id) },
    });
  } catch (e: any) {
    console.error("batch.delete.post.err:", e);
    return NextResponse.json(
      { ok: false, message: e?.toString() },
      { status: e?.status ?? 400 },
    );
  }
}
