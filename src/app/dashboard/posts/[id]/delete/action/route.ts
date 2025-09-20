import { NextResponse } from "next/server";
import { deletePostById, queryPostById } from "@/app/dashboard/_helpers/posts";

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
    const resp = await deletePostById({ id });
    console.log("delete.post.resp:", resp);
    return NextResponse.json({
      ok: true,
      message: "Post deleted successfully",
      data: { id },
    });
  } catch (e: any) {
    console.error("delete.post.err:", e);
    return NextResponse.json(
      { ok: false, message: e?.toString() },
      { status: e?.status ?? 400 },
    );
  }
}
