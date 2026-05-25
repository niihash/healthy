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

        const response = await supabase
            .from("FastingSession")
            .select("*")
            .eq("userId", user.id)
            .eq("isActive", false)
            .order("startedAt", {
                ascending: false,
            });

        const fastingSessions = response.data;

        const error = response.error;

        if (error) {
            return NextResponse.json({
                error: error.message,
            }, {
                status: 500,
            });
        }

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
