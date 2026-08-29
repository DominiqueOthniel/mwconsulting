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
  if (pathname.startsWith("/compte")) return true;
  if (pathname.startsWith("/boussole")) return true;
  if (pathname.startsWith("/radar")) return true;
  if (pathname.startsWith("/rendez-vous")) return true;
  if (pathname.startsWith("/api/chat")) return true;
  if (pathname.startsWith("/_next")) return true;
  if (pathname === "/favicon.ico" || pathname === "/logo-mw.svg") return true;
  return false;
}

function isConsolePath(pathname: string) {
  return (
    pathname.startsWith("/relais") ||
    pathname.startsWith("/dossiers") ||
    pathname.startsWith("/agenda") ||
    pathname.startsWith("/audit") ||
    pathname.startsWith("/demandes")
  );
}

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (isPublicPath(pathname)) {
    return NextResponse.next();
  }

  const token = req.cookies.get("relais_session")?.value;

  if (pathname.startsWith("/profil")) {
    if (!token) {
      return NextResponse.redirect(new URL("/compte", req.url));
    }
    try {
      await jwtVerify(token, new TextEncoder().encode(authSecret()));
      return NextResponse.next();
    } catch {
      return NextResponse.redirect(new URL("/compte", req.url));
    }
  }

  if (!token) {
    const dest = isConsolePath(pathname) ? "/login" : "/compte";
    return NextResponse.redirect(new URL(dest, req.url));
  }

  try {
    const { payload } = await jwtVerify(
      token,
      new TextEncoder().encode(authSecret()),
    );
    const role = String(payload.role ?? "");

    if (isConsolePath(pathname) && role === "CLIENT") {
      return NextResponse.redirect(new URL("/profil", req.url));
    }

    if (pathname.startsWith("/profil") && role !== "CLIENT") {
      return NextResponse.redirect(new URL("/relais", req.url));
    }

    return NextResponse.next();
  } catch {
    const dest = isConsolePath(pathname) ? "/login" : "/compte";
    return NextResponse.redirect(new URL(dest, req.url));
  }
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
