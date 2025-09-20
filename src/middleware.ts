import { NextRequest, NextResponse } from "next/server";
import { ROUTE_PREFIX, ROUTES } from "@/app/dashboard/_contstants/routes";

export default function middleware(req: NextRequest) {
  if (req.nextUrl.pathname.startsWith(ROUTE_PREFIX)) {
    if (
      req.nextUrl.pathname.startsWith(ROUTES.login) ||
      req.nextUrl.pathname.startsWith(ROUTES.logout_action)
    ) {
      return NextResponse.next();
    }

    const { cookies } = req;
    const token = cookies.get("payload-token")?.value;
    if (!token) {
      if (req.nextUrl.pathname.endsWith("/action")) {
        return NextResponse.json(
          { ok: false, message: "No logged in." },
          { status: 401 },
        );
      } else {
        return NextResponse.redirect(
          `${req.nextUrl.protocol}//${req.nextUrl.host}${ROUTES.login}`,
        );
      }
    }

    if (
      !(
        req.nextUrl.pathname === ROUTES.dashboard ||
        req.nextUrl.pathname.startsWith(`${ROUTE_PREFIX}/posts`) ||
        req.nextUrl.pathname.startsWith(`${ROUTE_PREFIX}/categories`) ||
        req.nextUrl.pathname.startsWith(`${ROUTE_PREFIX}/media`) ||
        req.nextUrl.pathname.startsWith(`${ROUTE_PREFIX}/pools`) ||
        req.nextUrl.pathname.startsWith(`${ROUTE_PREFIX}/settings`)
      )
    ) {
      return NextResponse.redirect(
        `${req.nextUrl.protocol}//${req.nextUrl.host}${ROUTES.posts}`,
      );
    }
  }
}
