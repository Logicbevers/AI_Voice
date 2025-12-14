import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(request: NextRequest) {
    const token = await getToken({
        req: request,
        secret: process.env.NEXTAUTH_SECRET,
    });

    const isAuthPage = request.nextUrl.pathname.startsWith("/login") ||
        request.nextUrl.pathname.startsWith("/signup");

    const isProtectedPage = request.nextUrl.pathname.startsWith("/dashboard") ||
        request.nextUrl.pathname.startsWith("/profile") ||
        request.nextUrl.pathname.startsWith("/create") ||
        request.nextUrl.pathname.startsWith("/videos") ||
        request.nextUrl.pathname.startsWith("/templates") ||
        request.nextUrl.pathname.startsWith("/avatars") ||
        request.nextUrl.pathname.startsWith("/assets") ||
        request.nextUrl.pathname.startsWith("/settings");

    // Redirect authenticated users away from auth pages
    if (isAuthPage && token) {
        return NextResponse.redirect(new URL("/dashboard", request.url));
    }

    // Redirect unauthenticated users to login
    if (isProtectedPage && !token) {
        const loginUrl = new URL("/login", request.url);
        loginUrl.searchParams.set("callbackUrl", request.nextUrl.pathname);
        return NextResponse.redirect(loginUrl);
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        "/dashboard/:path*",
        "/profile/:path*",
        "/create/:path*",
        "/videos/:path*",
        "/templates/:path*",
        "/avatars/:path*",
        "/assets/:path*",
        "/settings/:path*",
        "/login",
        "/signup",
    ],
};
