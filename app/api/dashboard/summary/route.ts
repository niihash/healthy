import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

function getLast7Days() {
    const days = [];

    for (let i = 6; i >= 0; i--) {
        const date = new Date();

        date.setDate(date.getDate() - i);

        days.push(date.toISOString().split("T")[0]);
    }

    return days;
}

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

        const sevenDaysAgo = new Date();

        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

        const [mealsResponse, fastingResponse, goalResponse,] = await Promise.all([
            supabase
                .from("Meal")
                .select("*")
                .eq("userId", user.id)
                .gte("consumedAt", sevenDaysAgo.toISOString()),

            supabase
                .from("FastingSession")
                .select("*")
                .eq("userId", user.id)
                .eq("isActive", false)
                .gte("startedAt", sevenDaysAgo.toISOString()),

            supabase
                .from("CalorieGoal")
                .select("*")
                .eq("userId", user.id)
                .single(),
        ]);

        if (mealsResponse.error) {
            return NextResponse.json({
                error: mealsResponse.error.message,
            }, {
                status: 500,
            });
        }

        if (fastingResponse.error) {
            return NextResponse.json({
                error: fastingResponse.error.message,
            }, {
                status: 500,
            });
        }

        const meals = mealsResponse.data || [];

        const fastingSessions = fastingResponse.data || [];

        const calorieGoal = goalResponse.data;

        const days = getLast7Days();

        const dailyCalories = days.map(
            (day) => {
                const calories = meals
                    .filter((meal) => {
                        const mealDate = new Date(meal.consumedAt)
                            .toISOString()
                            .split("T")[0];

                        return (mealDate === day);
                    })
                    .reduce((total, meal) => total + meal.calories, 0);

                return {
                    date: day,
                    calories,
                };
            }
        );

        const dailyFasting = days.map(
            (day) => {
                const totalMinutes = fastingSessions
                    .filter((session) => {
                        const sessionDate = new Date(session.startedAt).toISOString().split("T")[0];

                        return (sessionDate === day);
                    })
                    .reduce((total, session) => total + (session.durationMinutes || 0), 0);

                return {
                    date: day,
                    hours: Number((totalMinutes / 60).toFixed(1)),
                };
            }
        );

        const totalCalories = dailyCalories.reduce((total, day) => total + day.calories, 0);

        const averageCalories = Math.round(totalCalories / 7);

        const completedFasts = fastingSessions.length;

        const totalFastingMinutes = fastingSessions.reduce((total, session) => total + (session.durationMinutes || 0), 0);

        const averageFastingHours = completedFasts > 0 ? Number((totalFastingMinutes / completedFasts / 60).toFixed(1)) : 0;

        return NextResponse.json({
            dailyCalories,

            dailyFasting,

            dailyGoal: calorieGoal?.dailyCalories || null,

            averageCalories,

            completedFasts,

            averageFastingHours,
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
