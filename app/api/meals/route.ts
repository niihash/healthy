import { prisma } from "@/lib/prisma";
import { createClient } from "@/lib/supabase/server";
import { createMealSchema } from "@/lib/validations/createMeal";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
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

        const meals = await prisma.meal.findMany({
            where: {
                userId: user.id,
            },
            orderBy: {
                consumedAt: "desc",
            }
        });

        return NextResponse.json(
            meals, {
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

export async function POST(request: Request) {
    try {
        const body = await request.json();

        const validation = createMealSchema.safeParse(body);

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

        const meal = await prisma.meal.create({
            data: {
                userId: user.id,
                description: validation.data.description,
                calories: validation.data.calories,
                mealType: validation.data.mealType,
                consumedAt: validation.data.consumedAt,
            },
        });

        return NextResponse.json(
            meal,
            {
                status: 201,
            }
        );
    } catch {
        return NextResponse.json({
            error: "Internal server error",
        }, {
            status: 500,
        });
    }
}
