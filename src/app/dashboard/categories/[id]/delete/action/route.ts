import { NextResponse } from "next/server";
import {
  deleteCategoryById,
  queryCategories,
  queryCategoryById,
} from "@/app/dashboard/_helpers/categories";

export async function POST(
  _req: Request,
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

  // check children
  const children = await queryCategories({
    where: {
      parent: {
        equals: category.id,
      },
    },
  });
  if (children.length) {
    return NextResponse.json(
      {
        ok: false,
        message: "This category has subcategories and cannot be deleted.",
      },
      { status: 404 },
    );
  }

  try {
    const resp = await deleteCategoryById({ id });
    console.log("delete.category.resp:", resp);
    return NextResponse.json({
      ok: true,
      message: "Category deleted successfully",
      data: { id },
    });
  } catch (e: any) {
    console.error("delete.category.err:", e);
    return NextResponse.json(
      { ok: false, message: e?.toString() },
      { status: e?.status ?? 400 },
    );
  }
}
