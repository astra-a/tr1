import { NextResponse } from "next/server";
import { updatePostsStatusByIds } from "@/app/dashboard/_helpers/posts";
import { POST_STATUS } from "@/constants";

export async function POST(req: Request) {
  const ids = (await req.json()) as string[];

  try {
    const resp = await updatePostsStatusByIds({
      ids,
      status: POST_STATUS.Draft,
    });
    console.log("batch.unpublish.post.resp:", resp);
    return NextResponse.json({
      ok: true,
      message: `${resp.docs.length} Post${resp.docs.length > 1 ? "s" : ""} unpublished successfully`,
      data: { ids: resp.docs.map(({ id }) => id) },
    });
  } catch (e: any) {
    console.error("batch.unpublish.post.err:", e);
    return NextResponse.json(
      { ok: false, message: e?.toString() },
      { status: e?.status ?? 400 },
    );
  }
}
