import { NextRequest, NextResponse } from "next/server";

export function middleware(req: NextRequest) {
    const host = req.headers.get("host");

    // Skip middleware for Next.js static files and API routes
    if (req.nextUrl.pathname.startsWith("/_next") || req.nextUrl.pathname.startsWith("/api")) {
        return NextResponse.next();
    }

    if (host?.startsWith("2025.")) {
        const url = req.nextUrl;
        console.log("Rewriting to:", `/2025${url.pathname}`);

        return NextResponse.rewrite(url);
    }

    return NextResponse.next();
}

export const config = {
    matcher: "/:path*",
};
