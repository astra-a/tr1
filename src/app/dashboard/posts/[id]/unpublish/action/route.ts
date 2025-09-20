import { NextResponse } from "next/server";
import { queryPostById, updatePostById } from "@/app/dashboard/_helpers/posts";
import { POST_STATUS } from "@/constants";

export async function POST(
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;

  const post = await queryPostById({ id });
  if (!post) {
    return NextResponse.json(
      { ok: false, message: "Post not found" },
      { status: 404 },
    );
  }

  try {
    const resp = await updatePostById({
      id,
      data: { status: POST_STATUS.Draft, publishedAt: "" },
    });
    console.log("unpublish.post.resp:", resp);
    return NextResponse.json({
      ok: true,
      message: "Post unpublished successfully",
      data: { id },
    });
  } catch (e: any) {
    console.error("unpublish.post.err:", e);
    return NextResponse.json(
      { ok: false, message: e?.toString() },
      { status: e?.status ?? 400 },
    );
  }
}
