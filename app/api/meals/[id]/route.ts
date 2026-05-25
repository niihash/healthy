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

        const { data: meal, error, } = await supabase
            .from("Meal")
            .select("*")
            .eq("id", id)
            .eq("userId", user.id)
            .single();

        if (error || !meal) {
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

        const response = await supabase
            .from("Meal")
            .select("*")
            .eq("id", id)
            .eq("userId", user.id)
            .single();

        const meal = response.data;

        const findError = response.error;

        if (findError || !meal) {
            return NextResponse.json({
                error: "Meal not found",
            }, {
                status: 404,
            });
        }

        const responseUpdate = await supabase
            .from("Meal")
            .update(validation.data)
            .eq("id", id)
            .eq("userId", user.id)
            .select()
            .single();

        const updateMeal = responseUpdate.data;

        const updateError = responseUpdate.error;

        if (updateError) {
            return NextResponse.json({
                error: updateError.message,
            }, {
                status: 500,
            });
        }

        return NextResponse.json(
            updateMeal, {
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

        const response = await supabase
            .from("Meal")
            .select("*")
            .eq("id", id)
            .eq("userId", user.id)
            .single()

        const meal = response.data;

        const findError = response.error;

        if (!meal) {
            return NextResponse.json({
                error: "Meal not found",
            }, {
                status: 404,
            });
        }

        const responseDelete = await supabase
            .from("Meal")
            .delete()
            .eq("id", id)
            .eq("userId", user.id)

        const deleteError = responseDelete.error;

        if (deleteError) {
            return NextResponse.json({
                error: deleteError.message,
            }, {
                status: 500,
            });
        }

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
