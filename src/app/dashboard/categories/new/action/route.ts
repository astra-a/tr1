import { NextResponse } from "next/server";
import { formatSlug } from "@/collections/fields/slug/formatSlug";
import { createCategory } from "@/app/dashboard/_helpers/categories";

export async function POST(req: Request) {
  const json = (await req.json()) as { title: string; parent: string };

  const data = {
    id: "",
    title: json.title,
    parent: json.parent,
    slug: formatSlug(json.title),
    slugLock: true,
    createdAt: "",
    updatedAt: "",
  };
  // console.log("POST.data:", data);

  try {
    const resp = await createCategory({ data });
    console.log("create.category.resp:", resp);
    return NextResponse.json({
      ok: true,
      message: "Category created successfully",
      data: { id: resp.id },
    });
  } catch (e: any) {
    console.error("create.category.err:", e);
    return NextResponse.json(
      { ok: false, message: e?.toString() },
      { status: e?.status ?? 400 },
    );
  }
}
