import { createClient } from "@/lib/supabase/server";

import { startFastingSchema } from "@/lib/validations/startFasting";

import { NextResponse } from "next/server";

export async function POST(request: Request) {
    try {
        const body = await request.json();

        const validation = startFastingSchema.safeParse(body);

        if (!validation.success) {
            return NextResponse.json({
                error: validation.error.flatten(),
            }, {
                status: 422,
            });
        }

        const supabase = await createClient();

        const { data: { user }, } = await supabase.auth.getUser();

        if (!user) {
            return NextResponse.json({
                error: "Unauthorized",
            }, {
                status: 401,
            });
        }

        const activeResponse = await supabase
            .from("FastingSession")
            .select("*")
            .eq("userId", user.id)
            .eq("isActive", true)
            .limit(1)
            .maybeSingle();

        const activeSession = activeResponse.data;

        if (activeResponse.error) {
            return NextResponse.json({
                error: activeResponse
                    .error
                    .message,
            }, {
                status: 500,
            });
        }

        if (activeSession) {
            return NextResponse.json({
                error: "Existe uma sessão de jejum ativa no momento",
            }, {
                status: 409,
            });
        }

        const createResponse = await supabase
            .from("FastingSession")
            .insert({
                userId: user.id,

                plannedType: validation
                    .data
                    .plannedType,

                startedAt: new Date(),

                isActive: true,
            })
            .select()
            .single();

        if (createResponse.error) {
            return NextResponse.json({
                error: createResponse
                    .error
                    .message,
            }, {
                status: 500,
            });
        }

        return NextResponse.json(
            createResponse.data, {
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
