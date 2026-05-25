import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { token, password } = body;

        if (!token || !password) {
            return NextResponse.json(
                { error: "Token and password are required" },
                { status: 422 }
            );
        }

        if (password.length < 6) {
            return NextResponse.json(
                { error: "Password must be at least 6 characters long" },
                { status: 422 }
            );
        }

        const supabase = await createClient();

        const { error: verifyError } = await supabase.auth.verifyOtp({
            token_hash: token,
            type: "recovery",
        });

        if (verifyError) {
            return NextResponse.json(
                { error: "Invalid or expired recovery token" },
                { status: 400 }
            );
        }

        const { error: updateError } = await supabase.auth.updateUser({
            password: password,
        });

        if (updateError) {
            return NextResponse.json(
                { error: updateError.message },
                { status: 500 }
            );
        }

        return NextResponse.json(
            { message: "Password updated successfully" },
            { status: 200 }
        );

    } catch (err) {
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}
