import { NextResponse } from "next/server";
import { formatSlug } from "@/collections/fields/slug/formatSlug";
import { queryPostById, updatePostById } from "@/app/dashboard/_helpers/posts";

export async function POST(
  req: Request,
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

  const json = (await req.json()) as {
    title: string;
    description: string;
    category: string;
    content: string;
    coverImage: string;
  };

  const data = {
    title: json.title,
    description: json.description,
    category: json.category,
    coverImage: json.coverImage,
    content: json.content ? JSON.parse(json.content) : null,
    slug: formatSlug(json.title),
    slugLock: true,
  };
  // console.log("POST.data:", data);

  try {
    const resp = await updatePostById({ id, data });
    console.log("update.post.resp:", resp);
    return NextResponse.json({
      ok: true,
      message: "Post updated successfully",
      data: { id },
    });
  } catch (e: any) {
    console.error("update.post.err:", e);
    return NextResponse.json(
      { ok: false, message: e?.toString() },
      { status: e?.status ?? 400 },
    );
  }
}
