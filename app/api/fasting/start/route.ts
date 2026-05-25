import { prisma } from "@/lib/prisma";
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

        const activeSession = await prisma.fastingSession.findFirst({
            where: {
                userId: user.id,
                isActive: true,
            },
        });

        if (activeSession) {
            return NextResponse.json({
                error: "Existe uma sessao de jejum ativa no momento",
            }, {
                status: 409,
            });
        }

        const fastingSession = await prisma.fastingSession.create({
            data: {
                userId: user.id,
                plannedType: validation.data.plannedType,
                startedAt: new Date(),
                isActive: true,
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
