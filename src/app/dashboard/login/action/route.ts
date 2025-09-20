import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { loginByEmail } from "@/app/dashboard/_helpers/users";
import { ROUTE_PREFIX } from "@/app/dashboard/_contstants/routes";

export async function POST(req: Request) {
  const { email, password } = await req.json();
  try {
    const result = await loginByEmail({ data: { email, password } });
    if (result.token && result.exp) {
      (await cookies()).set("payload-token", result.token, {
        expires: result.exp * 1_000,
        // domain: ''
        path: ROUTE_PREFIX,
        // secure: true,
        httpOnly: true,
        // sameSite: "strict",
        priority: "high",
      });
      return NextResponse.json({
        ok: true,
        message: "Login successfully.",
        data: { exp: result.exp, token: result.token },
      });
    }
    return NextResponse.json({ ok: false, message: "?" }, { status: 401 });
  } catch (err: any) {
    console.error("login error:", err);
    return NextResponse.json(
      { ok: false, message: "The email or password provided is incorrect" },
      { status: 401 },
    );
  }
}
