import { createClient } from "@/lib/supabase/server";

import { NextResponse } from "next/server";

export async function POST() {
    try {
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
            .order("startedAt", {
                ascending: false,
            })
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

        if (!activeSession) {
            return NextResponse.json({
                error: "Nenhuma sessão ativa encontrada",
            }, {
                status: 404,
            });
        }

        const endedAt = new Date();

        const startedAt = new Date(activeSession.startedAt);

        const durationMinutes = Math.floor((endedAt.getTime() - startedAt.getTime()) / 1000 / 60);

        const updateResponse = await supabase
            .from("FastingSession")
            .update({
                endedAt,

                durationMinutes,

                isActive: false,
            })
            .eq("id", activeSession.id)
            .eq("userId", user.id)
            .select()
            .single();

        if (updateResponse.error) {
            return NextResponse.json({
                error: updateResponse
                    .error
                    .message,
            }, {
                status: 500,
            });
        }

        return NextResponse.json(
            updateResponse.data, {
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
