import { prisma } from "@/lib/prisma";
import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";
import { ca } from "zod/locales";

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

        const activeSession = await prisma.fastingSession.findFirst({
            where: {
                userId: user.id,
                isActive: true,
            },
        });

        if (!activeSession) {
            return NextResponse.json({
                error: "Nenhuma sessao ativa encontrada",
            }, {
                status: 404,
            });
        }

        const endedAt = new Date();

        const durationMinutes = Math.floor((endedAt.getTime() - activeSession.startedAt.getTime()) / 1000 / 60);

        const fastingSession = await prisma.fastingSession.update({
            where: {
                id: activeSession.id,
            },
            data: {
                endedAt,
                durationMinutes,
                isActive: false,
            },
        });

        return NextResponse.json(
            fastingSession, {
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
