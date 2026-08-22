import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";
import { authSecret } from "@/lib/secret";

function isPublicPath(pathname: string) {
  if (pathname === "/" || pathname === "/login") return true;
  if (pathname.startsWith("/pays")) return true;
  if (pathname.startsWith("/destinations")) return true;
  if (pathname.startsWith("/notifications")) return true;
  if (pathname.startsWith("/aide")) return true;
  if (pathname.startsWith("/demande")) return true;
  if (pathname.startsWith("/api/chat")) return true;
  if (pathname.startsWith("/_next")) return true;
  if (pathname === "/favicon.ico" || pathname === "/logo-mw.svg") return true;
  return false;
}

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (isPublicPath(pathname)) {
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
