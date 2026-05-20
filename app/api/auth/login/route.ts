import { createClient } from "@/lib/supabase/server";
import { loginSchema } from "@/lib/validations/login";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const validation = loginSchema.safeParse(body);

        if (!validation.success) {
            return NextResponse.json({
                error: validation.error.flatten(),
            }, {
                status: 422,
            })
        }

        const { email, password } = validation.data;

        const supabase = await createClient();

        const { error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        if (error) {
            return NextResponse.json(
                {
                    error: error.message,
                },
                {
                    status: 401,
                }
            );
        }

        return NextResponse.json(
            {
                message: "Login successful",
            },
            {
                status: 200,
            }
        );

    } catch {
        return NextResponse.json(
            {
                error: "Internal server error",
            },
            {
                status: 500,
            }
        );
    }
}
