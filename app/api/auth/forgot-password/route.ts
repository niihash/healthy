import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function POST(
    request: Request
) {
    try {
        const body = await request.json();

        const { email } = body;

        if (!email) {
            return NextResponse.json({
                error: "Email is required",
            }, {
                status: 422,
            });
        }

        const supabase = await createClient();

        const { error } = await supabase.auth.resetPasswordForEmail(
            email, {
            redirectTo:
                process.env.NODE_ENV === "production" ? "https://healthy.niihash.com/reset-password" : "http://localhost:3000/reset-password",
        });

        if (error) {
            return NextResponse.json({
                error: error.message,
            }, {
                status: 500,
            });
        }

        return NextResponse.json({
            message: "Recovery email sent",
        }, {
            status: 200,
        });
    } catch {
        return NextResponse.json({
            error: "Internal server error",
        }, {
            status: 500,
        });
    }
}
