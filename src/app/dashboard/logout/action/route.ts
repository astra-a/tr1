import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { ROUTE_PREFIX } from "@/app/dashboard/_contstants/routes";

export async function POST(_req: Request) {
  try {
    (await cookies()).set("payload-token", "", {
      maxAge: 0,
      path: ROUTE_PREFIX,
    });
    return NextResponse.json({
      ok: true,
      message: "Logout successfully.",
    });
  } catch (err: any) {
    console.error("logout error:", err);
    return NextResponse.json(
      { ok: false, message: "Unknown error." },
      { status: 400 },
    );
  }
}
