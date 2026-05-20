import { updateSession } from "@/lib/supabase/proxy";
import { NextResponse, type NextRequest } from "next/server";

export async function proxy(request: NextRequest) {
    const response = await updateSession(request);

    const isAuthPage = request.nextUrl.pathname.startsWith("/login") || request.nextUrl.pathname.startsWith("/register");

    const isProtectedRoute = request.nextUrl.pathname.startsWith("/dashboard") || request.nextUrl.pathname.startsWith("/meals") || request.nextUrl.pathname.startsWith("/fasting")

    const hasSession = request.cookies.get("sb-access-token");

    if (isProtectedRoute && !hasSession) {
        return NextResponse.redirect(
            new URL("/login", request.url)
        );
    }

    if (isAuthPage && hasSession) {
        return NextResponse.redirect(
            new URL("/dashboard", request.url)
        );
    }

    return response;
}

export const config = {
    matcher: [
        /*
         * Match all request paths except:
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         * - images - .svg, .png, .jpg, .jpeg, .gif, .webp
         * Feel free to modify this pattern to include more paths.
         */
        "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
    ],
};
