import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
    function middleware(req) {
        // If the user attempts to access /host routes but is not a HOST, redirect them
        if (req.nextUrl.pathname.startsWith("/host") && req.nextauth.token?.role !== "HOST") {
            return NextResponse.redirect(new URL("/", req.url));
        }
    },
    {
        callbacks: {
            authorized: ({ token }) => !!token,
        },
    }
);

export const config = {
    matcher: ["/host/:path*", "/trips/:path*"]
};
