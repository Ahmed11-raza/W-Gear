import { NextResponse, type NextRequest } from "next/server";
import { readSession, SESSION_COOKIE } from "@/lib/auth";

/**
 * Gate every admin surface.
 *
 * Runs before the page or route handler, so an unauthenticated request never
 * reaches code that can read or write the database. The login page and the
 * login endpoint are the only exceptions, or there would be no way in.
 */
export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isLoginPage = pathname === "/admin/login";
  const isLoginApi = pathname === "/api/admin/login";
  if (isLoginPage || isLoginApi) return NextResponse.next();

  const session = await readSession(request.cookies.get(SESSION_COOKIE)?.value);
  if (session) return NextResponse.next();

  // API calls get a status they can act on; pages get sent to the login form.
  if (pathname.startsWith("/api/admin")) {
    return NextResponse.json({ message: "Not authenticated." }, { status: 401 });
  }

  const url = request.nextUrl.clone();
  url.pathname = "/admin/login";
  url.searchParams.set("next", pathname);
  return NextResponse.redirect(url);
}

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"],
};
