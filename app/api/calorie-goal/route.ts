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
            });
        }

        const response = await supabase
            .from("CalorieGoal")
            .select("*")
            .eq("userId", user.id)
            .single();

        const calorieGoal = response.data;

        const error = response.error;

        if (error && error.code !== "PGRST116") {
            return NextResponse.json({
                error: error.message,
            }, {
                status: 500,
            });
        }

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

        const existingResponse = await supabase
            .from("CalorieGoal")
            .select("*")
            .eq("userId", user.id)
            .single();

        const existingGoal = existingResponse.data;

        if (existingGoal) {
            const updateResponse = await supabase
                .from("CalorieGoal")
                .update({
                    dailyCalories: validation
                        .data
                        .dailyCalories,
                })
                .eq("userId", user.id)
                .select()
                .single();

            if (
                updateResponse.error
            ) {
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
        }

        const createResponse = await supabase
            .from("CalorieGoal")
            .insert({
                userId: user.id,

                dailyCalories: validation
                    .data
                    .dailyCalories,
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
