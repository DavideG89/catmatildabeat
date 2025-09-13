import type { NextRequest } from "next/server"
import { NextResponse } from "next/server"

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl

  // Protect dashboard routes
  if (pathname.startsWith("/dashboard")) {
    const isLoggedIn = req.cookies.get("is-logged-in")?.value === "1"

    // Allow if authenticated; otherwise redirect to login
    if (!isLoggedIn) {
      const loginUrl = req.nextUrl.clone()
      loginUrl.pathname = "/login"
      loginUrl.searchParams.set("from", pathname)
      return NextResponse.redirect(loginUrl)
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/dashboard/:path*"],
}

