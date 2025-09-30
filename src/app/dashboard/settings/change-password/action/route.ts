import { NextResponse } from "next/server";
import {
  changePassword,
  getAuthUser,
  loginByEmail,
} from "@/app/dashboard/_helpers/users";

export async function POST(req: Request) {
  const json = (await req.json()) as {
    oldPassword: string;
    newPassword: string;
    confirmNewPassword: string;
  };
  console.log("change.password.json", json);
  if (json.newPassword && json.newPassword !== json.confirmNewPassword) {
    return NextResponse.json(
      { ok: false, message: "Passwords do not match" },
      { status: 404 },
    );
  }

  const { user } = await getAuthUser();
  if (!user) {
    return NextResponse.json(
      { ok: false, message: "User not found" },
      { status: 404 },
    );
  }

  // check old password
  try {
    await loginByEmail({
      data: { email: user.email, password: json.oldPassword },
    });
  } catch (e: any) {
    return NextResponse.json(
      { ok: false, message: e?.toString() },
      { status: 400 },
    );
  }

  try {
    const resp = await changePassword({
      userId: user.id,
      data: { password: json.newPassword },
    });
    console.log("change.password.resp:", resp);
    return NextResponse.json({
      ok: true,
      message: "Password changed successfully",
      data: { id: resp.id },
    });
  } catch (e: any) {
    console.error("change.password.err:", e);
    return NextResponse.json(
      { ok: false, message: e?.toString() },
      { status: e?.status ?? 400 },
    );
  }
}
