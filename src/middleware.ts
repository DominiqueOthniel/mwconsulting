import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";
import { authSecret } from "@/lib/secret";

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const publicPath =
    pathname === "/login" ||
    pathname.startsWith("/_next") ||
    pathname === "/favicon.ico";

  if (publicPath) {
    return NextResponse.next();
  }

  const token = req.cookies.get("relais_session")?.value;
  if (!token) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  try {
    await jwtVerify(token, new TextEncoder().encode(authSecret()));
    return NextResponse.next();
  } catch {
    return NextResponse.redirect(new URL("/login", req.url));
  }
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
