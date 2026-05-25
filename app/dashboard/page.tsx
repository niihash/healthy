"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

type Meal = {
    id: string;
    description: string;
    calories: number;
    consumedAt: string;
};

type CalorieGoal = {
    dailyCalories: number;
};

type FastingSession = {
    id: string;
    plannedType: string;
    startedAt: string;
    endedAt: string | null;
    isActive: boolean;
};

type DailyCalories = {
    date: string;
    calories: number;
};

type DailyFasting = {
    date: string;
    hours: number;
};

type DashboardSummary = {
    dailyCalories: DailyCalories[];

    dailyFasting: DailyFasting[];

    dailyGoal: number | null;

    averageCalories: number;

    completedFasts: number;

    averageFastingHours: number;
};

export default function Dashboard() {
    const router = useRouter();

    const [meals, setMeals] = useState<Meal[]>([]);

    const [goal, setGoal] = useState<CalorieGoal | null>(null);

    const [fasting, setFasting] = useState<FastingSession | null>(null);

    const [loading, setLoading] = useState(true);

    const [summary, setSummary] = useState<DashboardSummary | null>(null);

    async function handleLogout() {
        try {
            await fetch(
                "/api/auth/logout", {
                method: "POST",
            });

            router.push("/login");

            router.refresh();
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        async function loadData() {
            try {
                const [mealsResponse, goalResponse, fastingResponse, summaryResponse] = await Promise.all([
                    fetch("/api/meals"),

                    fetch("/api/calorie-goal"),

                    fetch("/api/fasting/current"),

                    fetch("/api/dashboard/summary"),
                ]);

                const mealsData = await mealsResponse.json();

                const goalData = await goalResponse.json();

                const fastingData = await fastingResponse.json();

                const summaryData = await summaryResponse.json();

                setMeals(mealsData);

                setGoal(goalData);

                setFasting(fastingData);

                setSummary(summaryData);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        }

        loadData();
    }, []);

    if (loading) {
        return (
            <div className="p-6">
                Loading...
            </div>
        );
    }

    const todayCalories = meals.reduce((total, meal) => total + meal.calories, 0);

    const progress = goal?.dailyCalories ? ((todayCalories / goal.dailyCalories) * 100).toFixed(0) : 0;

    return (
        <main className="space-y-6 p-6">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                    <h1 className="text-3xl font-bold">
                        Dashboard
                    </h1>

                    <p className="text-muted-foreground">
                        Resumo do seu dia
                    </p>
                </div>
                <nav>
                    <Link
                        href="/dashboard"
                        className="rounded border px-3 py-2 text-sm"
                    >
                        Dashboard
                    </Link>

                    <Link
                        href="/meals"
                        className="rounded border px-3 py-2 text-sm"
                    >
                        Meals
                    </Link>

                    <Link
                        href="/calorie-goal"
                        className="rounded border px-3 py-2 text-sm"
                    >
                        Goal
                    </Link>

                    <Link
                        href="/fasting"
                        className="rounded border px-3 py-2 text-sm"
                    >
                        Fasting
                    </Link>

                    <button onClick={handleLogout} className="rounded bg-red-500 px-3 py-2 text-sm text-white">
                        Logout
                    </button>
                </nav>
            </div>

            <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-6">
                <div className="rounded-xl border p-4">
                    <h2 className="text-sm text-muted-foreground">
                        Calorias hoje
                    </h2>

                    <p className="mt-2 text-3xl font-bold">
                        {todayCalories}
                    </p>

                    <p className="text-sm text-muted-foreground">
                        /
                        {" "}
                        {goal?.dailyCalories ??
                            0}
                        {" "}
                        kcal
                    </p>

                    <div className="mt-4 h-3 overflow-hidden rounded bg-gray-200">
                        <div
                            className="h-full bg-black"
                            style={{
                                width: `${Math.min(
                                    Number(
                                        progress
                                    ),
                                    100
                                )}%`,
                            }}
                        />
                    </div>
                </div>

                <div className="rounded-xl border p-4">
                    <h2 className="text-sm text-muted-foreground">
                        Refeições hoje
                    </h2>

                    <p className="mt-2 text-3xl font-bold">
                        {meals.length}
                    </p>
                </div>

                <div className="rounded-xl border p-4">
                    <h2 className="text-sm text-muted-foreground">
                        Jejum atual
                    </h2>

                    <p className="mt-2 text-lg font-bold">
                        {fasting
                            ? fasting.plannedType
                            : "Nenhum"}
                    </p>
                </div>

                <div className="rounded-xl border p-4">
                    <h2 className="text-sm text-muted-foreground">
                        Meta atingida
                    </h2>

                    <p className="mt-2 text-3xl font-bold">
                        {progress}%
                    </p>
                </div>

                <div className="rounded-xl border p-4">
                    <h2 className="text-sm text-muted-foreground">
                        Média semanal
                    </h2>

                    <p className="mt-2 text-3xl font-bold">
                        {summary?.averageCalories ?? 0}
                    </p>

                    <p className="text-sm text-muted-foreground">
                        kcal/dia
                    </p>
                </div>

                <div className="rounded-xl border p-4">
                    <h2 className="text-sm text-muted-foreground">
                        Jejuns concluídos
                    </h2>

                    <p className="mt-2 text-3xl font-bold">
                        {summary?.completedFasts ?? 0}
                    </p>

                    <p className="text-sm text-muted-foreground">
                        últimos 7 dias
                    </p>
                </div>

                <div className="rounded-xl border p-4">
                    <h2 className="text-sm text-muted-foreground">
                        Média de jejum
                    </h2>

                    <p className="mt-2 text-3xl font-bold">
                        {
                            summary?.averageFastingHours ??
                            0
                        }h
                    </p>

                    <p className="text-sm text-muted-foreground">
                        por sessão
                    </p>
                </div>
            </section>

            <section className="grid gap-6 xl:grid-cols-2">
                <div className="rounded-xl border p-4">
                    <h2 className="mb-4 text-xl font-semibold">
                        Calorias últimos 7 dias
                    </h2>

                    <div className="space-y-3">
                        {summary?.dailyCalories.map(
                            (day) => {
                                const percentage =
                                    goal?.dailyCalories
                                        ? (
                                            day.calories /
                                            goal.dailyCalories
                                        ) * 100
                                        : 0;

                                return (
                                    <div
                                        key={day.date}
                                    >
                                        <div className="mb-1 flex items-center justify-between text-sm">
                                            <span>
                                                {new Date(
                                                    day.date
                                                ).toLocaleDateString()}
                                            </span>

                                            <span>
                                                {
                                                    day.calories
                                                }
                                                {" "}
                                                kcal
                                            </span>
                                        </div>

                                        <div className="h-3 overflow-hidden rounded bg-gray-200">
                                            <div
                                                className="h-full bg-black"
                                                style={{
                                                    width: `${Math.min(
                                                        percentage,
                                                        100
                                                    )}%`,
                                                }}
                                            />
                                        </div>
                                    </div>
                                );
                            }
                        )}
                    </div>
                </div>

                <div className="rounded-xl border p-4">
                    <h2 className="mb-4 text-xl font-semibold">
                        Jejum últimos 7 dias
                    </h2>

                    <div className="space-y-3">
                        {summary?.dailyFasting.map(
                            (day) => (
                                <div
                                    key={day.date}
                                >
                                    <div className="mb-1 flex items-center justify-between text-sm">
                                        <span>
                                            {new Date(
                                                day.date
                                            ).toLocaleDateString()}
                                        </span>

                                        <span>
                                            {
                                                day.hours
                                            }h
                                        </span>
                                    </div>

                                    <div className="h-3 overflow-hidden rounded bg-gray-200">
                                        <div
                                            className="h-full bg-black"
                                            style={{
                                                width: `${Math.min(
                                                    day.hours *
                                                    4,
                                                    100
                                                )}%`,
                                            }}
                                        />
                                    </div>
                                </div>
                            )
                        )}
                    </div>
                </div>
            </section>

            <section className="rounded-xl border p-4">
                <h2 className="mb-4 text-xl font-semibold">
                    Últimas refeições
                </h2>

                <div className="space-y-3">
                    {meals
                        .slice(0, 5)
                        .map((meal) => (
                            <div
                                key={meal.id}
                                className="flex items-center justify-between rounded border p-3"
                            >
                                <div>
                                    <p className="font-medium">
                                        {
                                            meal.description
                                        }
                                    </p>

                                    <p className="text-sm text-muted-foreground">
                                        {new Date(
                                            meal.consumedAt
                                        ).toLocaleString()}
                                    </p>
                                </div>

                                <p className="font-bold">
                                    {
                                        meal.calories
                                    }
                                    {" "}
                                    kcal
                                </p>
                            </div>
                        ))}
                </div>
            </section>

            <footer className="text-center text-sm text-muted-foreground">
                Este aplicativo não substitui
                orientação médica ou
                nutricional.
            </footer>
        </main>
    );
}
