import { prisma } from "@/lib/prisma";
import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function GET() {
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

        const fastingSessions = await prisma.fastingSession.findMany({
            where: {
                userId: user.id,
                isActive: false,
            },
            orderBy: {
                startedAt: "desc",
            },
        });

        return NextResponse.json(
            fastingSessions, {
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
