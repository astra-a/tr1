import { NextResponse } from "next/server";
import { formatSlug } from "@/collections/fields/slug/formatSlug";
import { POST_STATUS } from "@/constants";
import { createPost } from "@/app/dashboard/_helpers/posts";

export async function POST(req: Request) {
  const json = (await req.json()) as {
    title: string;
    description: string;
    category: string;
    content: string;
    coverImage: string;
  };

  const data = {
    id: "",
    title: json.title,
    description: json.description,
    category: json.category,
    coverImage: json.coverImage,
    content: json.content ? JSON.parse(json.content) : null,
    slug: formatSlug(json.title),
    slugLock: true,
    status: POST_STATUS.Draft,
    createdAt: "",
    updatedAt: "",
  };
  // console.log("POST.data:", data);

  try {
    const resp = await createPost({ data });
    console.log("create.post.resp:", resp);
    return NextResponse.json({
      ok: true,
      message: "Post created successfully",
      data: { id: resp.id },
    });
  } catch (e: any) {
    console.error("create.post.err:", e);
    return NextResponse.json(
      { ok: false, message: e?.toString() },
      { status: e?.status ?? 400 },
    );
  }
}
