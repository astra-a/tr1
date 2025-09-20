import { NextResponse } from "next/server";
import { formatSlug } from "@/collections/fields/slug/formatSlug";
import {
  queryCategoryById,
  updateCategoryById,
} from "@/app/dashboard/_helpers/categories";

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;

  const category = await queryCategoryById({ id });
  if (!category) {
    return NextResponse.json(
      { ok: false, message: "Category not found" },
      { status: 404 },
    );
  }

  const json = (await req.json()) as { title: string; parent: string };

  const data = {
    title: json.title,
    parent: json.parent,
    slug: formatSlug(json.title),
    slugLock: true,
  };
  console.log("POST.data:", data);

  try {
    const resp = await updateCategoryById({ id, data });
    console.log("update.category.resp:", resp);
    return NextResponse.json({
      ok: true,
      message: "Category updated successfully",
      data: { id },
    });
  } catch (e: any) {
    console.error("update.category.err:", e);
    return NextResponse.json(
      { ok: false, message: e?.toString() },
      { status: e?.status ?? 400 },
    );
  }
}
