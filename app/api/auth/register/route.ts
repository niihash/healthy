import { createClient } from "@/lib/supabase/server"
import { registerSchema } from "@/lib/validations/register"
import { NextResponse } from "next/server"

export async function POST(request: Request) {
    try {
        const body = await request.json();

        const validation = registerSchema.safeParse(body);

        if (!validation.success) {
            return NextResponse.json({
                error: validation.error.flatten(),
            }, {
                status: 422,
            });
        }

        const { email, password } = validation.data;

        const supabase = await createClient();

        const { error } = await supabase.auth.signUp({
            email, password,
        });

        if (error) {
            return NextResponse.json({
                error: error.message,
            }, {
                status: 400,
            });
        }

        return NextResponse.json({
            message: "Usuário cadastrado com sucesso",
        }, {
            status: 201,
        });
    } catch {
        return NextResponse.json({
            error: "Internal server error",
        }, {
            status: 500,
        });
    }
}
