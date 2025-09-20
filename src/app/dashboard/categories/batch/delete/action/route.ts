import { NextResponse } from "next/server";
import {
  deleteCategoriesByIds,
  queryCategories,
} from "@/app/dashboard/_helpers/categories";

export async function POST(req: Request) {
  const ids = (await req.json()) as string[];

  // check children
  const children = await queryCategories({
    where: {
      parent: {
        in: ids,
      },
    },
  });
  if (children.length) {
    return NextResponse.json(
      {
        ok: false,
        message: "These categories has subcategories and cannot be deleted.",
      },
      { status: 400 },
    );
  }

  try {
    const resp = await deleteCategoriesByIds({ ids });
    console.log("batch.delete.category.resp:", resp);
    return NextResponse.json({
      ok: true,
      message: `${resp.docs.length} Categor${resp.docs.length > 1 ? "ies" : "y"} deleted successfully`,
      data: { ids: resp.docs.map(({ id }) => id) },
    });
  } catch (e: any) {
    console.error("batch.delete.category.err:", e);
    return NextResponse.json(
      { ok: false, message: e?.toString() },
      { status: e?.status ?? 400 },
    );
  }
}
