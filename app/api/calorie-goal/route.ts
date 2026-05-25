import { prisma } from "@/lib/prisma";
import { createClient } from "@/lib/supabase/server";
import { calorieGoalSchema } from "@/lib/validations/calorieGoal";
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
            })
        }

        const calorieGoal = await prisma.calorieGoal.findUnique({
            where: { userId: user.id },
        });

        return NextResponse.json(
            calorieGoal, {
            status: 200,
        });
    } catch {
        return NextResponse.json({
            error: "Internal server error.",
        }, {
            status: 500,
        });
    }
}

export async function PUT(request: Request) {
    try {
        const body = await request.json();

        const validation = calorieGoalSchema.safeParse(body);

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

        const calorieGoal = await prisma.calorieGoal.upsert({
            where: {
                userId: user.id,
            },
            update: {
                dailyCalories: validation.data.dailyCalories,
            },
            create: {
                userId: user.id,
                dailyCalories: validation.data.dailyCalories,
            },
        });

        return NextResponse.json(
            calorieGoal,
            {
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
