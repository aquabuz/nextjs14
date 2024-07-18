import { NextRequestWithAuth, withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  // `withAuth` augments your `Request` with the user's token.
  function middleware(request: NextRequestWithAuth) {
    console.log("[middleware] pathname", request.nextUrl.pathname);
    console.log("[middleware] roles", request.nextauth?.token?.roles);
    console.log("[middleware] session", request.nextauth.token);

    if (request.nextauth.token?.roles) {
      const roles = request.nextauth.token?.roles;
      if (!roles.includes("ADMIN_READ")) {
        // admin 접근 페이지 설정
        if (request.nextUrl.pathname.includes("/admin")) {
          return NextResponse.redirect(new URL("/", request.url));
        }
      }
    }

    const requestHeaders = new Headers(request.headers);
    requestHeaders.set("x-pathname", request.nextUrl.pathname);

    return NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    });
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
  }
);

export const config = {
  matcher: [
    // "/admin/:path*",
    "/((?!login).*)(.+)",
  ],
};
