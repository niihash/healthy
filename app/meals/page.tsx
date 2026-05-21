"use client";

import { useEffect, useState } from "react";

type Meal = {
    id: string;
    description: string;
    calories: number;
    mealType: string;
    consumedAt: string;
};

export default function Meals() {

    const [meals, setMeals] = useState<Meal[]>([]);

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState("");

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
            <div className="mb-6 flex items-center justify-between">
                <h1 className="text-3xl font-bold">
                    Meals
                </h1>
            </div>

            {meals.length === 0 ? (
                <p>No meals found.</p>
            ) : (
                <div className="flex flex-col gap-4">
                    {meals.map((meal) => (
                        <div key={meal.id} className="rounded border p-4">
                            <h2 className="text-lg font-semibold">
                                {
                                    meal.description
                                }
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
                    ))}
                </div>
            )}
        </div>
    );
}
