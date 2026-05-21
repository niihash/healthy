import { prisma } from "@/lib/prisma";
import { createClient } from "@/lib/supabase/server";
import { updateMealSchema } from "@/lib/validations/updateMeal";
import { NextResponse } from "next/server";

type Params = { params: Promise<{ id: string }> };

export async function GET(request: Request, { params }: Params) {
    try {
        const { id } = await params;

        const supabase = await createClient();

        const { data: { user }, } = await supabase.auth.getUser();

        if (!user) {
            return NextResponse.json({
                error: "Unauthorized",
            }, {
                status: 401,
            });
        }

        const meal = await prisma.meal.findFirst({
            where: {
                id,
                userId: user.id,
            },
        });

        if (!meal) {
            return NextResponse.json({
                error: "Meal not found",
            }, {
                status: 404,
            });
        }


        return NextResponse.json(
            meal, {
            status: 200,
        });
    } catch {
        return NextResponse.json({
            error:
                "Internal server error",
        }, {
            status: 500,
        });
    }
}

export async function PATCH(request: Request, { params }: Params) {
    try {
        const { id } = await params;

        const body = await request.json();

        const validation = updateMealSchema.safeParse(body);

        if (!validation.success) {
            return NextResponse.json({
                error:
                    validation.error.flatten(),
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

        const meal = await prisma.meal.findFirst({
            where: {
                id,
                userId: user.id,
            },
        });

        if (!meal) {
            return NextResponse.json({
                error: "Meal not found",
            }, {
                status: 404,
            });
        }

        const updatedMeal = await prisma.meal.update({
            where: {
                id,
            },
            data: validation.data,
        });

        return NextResponse.json(
            updatedMeal, {
            status: 200,
        });
    } catch {
        return NextResponse.json({
            error:
                "Internal server error",
        }, {
            status: 500,
        });
    }
}

export async function DELETE(request: Request, { params }: Params) {
    try {
        const { id } = await params;

        const supabase = await createClient();

        const { data: { user }, } = await supabase.auth.getUser();

        if (!user) {
            return NextResponse.json({
                error: "Unauthorized",
            }, {
                status: 401,
            });
        }

        const meal = await prisma.meal.findFirst({
            where: {
                id,
                userId: user.id,
            },
        });

        if (!meal) {
            return NextResponse.json({
                error: "Meal not found",
            }, {
                status: 404,
            });
        }

        await prisma.meal.delete({
            where: {
                id,
            },
        });

        return NextResponse.json({
            message:
                "Meal deleted successfully",
        }, {
            status: 200,
        });
    } catch {
        return NextResponse.json({
            error:
                "Internal server error",
        }, {
            status: 500,
        });
    }
}
