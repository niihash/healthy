"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

type Meal = {
    id: string;
    description: string;
    calories: number;
    mealType: string;
    consumedAt: string;
};

export default function Meals() {
    const router = useRouter();

    const [meals, setMeals] = useState<Meal[]>([]);

    const [loading, setLoading] = useState(true);

    const [error, setError] = useState("");

    async function handleLogout() {
        try {
            await fetch(
                "/api/auth/logout",
                {
                    method: "POST",
                }
            );

            router.push("/login");

            router.refresh();
        } catch (error) {
            console.error(error);
        }
    }

    useEffect(() => {
        async function loadMeals() {
            try {
                const response = await fetch("/api/meals");

                const data = await response.json();

                if (!response.ok) {
                    setError(data.error || "Failed to load meals");
                    return;
                }

                setMeals(data);
            } catch {
                setError("Internal server error");
            } finally {
                setLoading(false);
            }
        }

        loadMeals();
    }, []);

    if (loading) {
        return (
            <div className="p-6">
                Loading meals...
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-6 text-red-500">
                {error}
            </div>
        );
    }

    return (
        <div className="p-6">
            <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                    <h1 className="text-3xl font-bold">
                        Meals
                    </h1>

                    <p className="text-muted-foreground">
                        Gerencie suas refeições
                    </p>
                </div>

                <div className="flex flex-wrap items-center gap-2">
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

                    <Link
                        href="/meals/create"
                        className="rounded bg-black px-3 py-2 text-sm text-white"
                    >
                        + Add Meal
                    </Link>

                    <button
                        onClick={handleLogout}
                        className="rounded bg-red-500 px-3 py-2 text-sm text-white"
                    >
                        Logout
                    </button>
                </div>
            </div>

            {meals.length === 0 ? (
                <p>No meals found.</p>
            ) : (
                <div className="flex flex-col gap-4">
                    {meals.map((meal) => (
                        <div
                            key={meal.id}
                            className="rounded border p-4"
                        >
                            <div className="flex items-start justify-between">
                                <div>
                                    <h2 className="text-lg font-semibold">
                                        {meal.description}
                                    </h2>

                                    <p>
                                        Calories:{" "}
                                        {meal.calories}
                                    </p>

                                    <p>
                                        Type:{" "}
                                        {meal.mealType}
                                    </p>

                                    <p>
                                        Consumed at:{" "}
                                        {new Date(
                                            meal.consumedAt
                                        ).toLocaleString()}
                                    </p>
                                </div>

                                <Link
                                    href={`/meals/edit/${meal.id}`}
                                    className="rounded border px-3 py-2 text-sm"
                                >
                                    Edit
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
