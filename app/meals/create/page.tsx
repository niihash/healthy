"use client";

import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";

export default function createMeal() {
    const router = useRouter();

    const [description, setDescription] = useState("");

    const [calories, setCalories] = useState("");

    const [mealType, setMealType] = useState("BREAKFAST");

    const [consumedAt, setConsumedAt] = useState("");

    const [loading, setLoading] = useState(false);

    const [error, setError] = useState("");

    async function handleSubmit(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();

        setLoading(true);
        setError("");

        try {
            const response = await fetch(
                "/api/meals",
                {
                    method: "POST",

                    headers: {
                        "Content-Type": "application/json",
                    },

                    body: JSON.stringify({
                        description,

                        calories: Number(calories),

                        mealType,

                        consumedAt,
                    }),
                }
            );

            const data = await response.json();

            if (!response.ok) {
                setError(data.error || "Failed to create meal");

                return;
            }

            router.push("/meals");
        } catch {
            setError("Internal server error");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="p-6">
            <div className="mx-auto max-w-lg">
                <h1 className="mb-6 text-3xl font-bold">
                    Create Meal
                </h1>

                <form
                    onSubmit={handleSubmit}
                    className="flex flex-col gap-4"
                >
                    <div className="flex flex-col gap-1">
                        <label>
                            Description
                        </label>

                        <input
                            type="text"
                            value={description}
                            onChange={(e) =>
                                setDescription(
                                    e.target.value
                                )
                            }
                            className="rounded border p-2"
                        />
                    </div>

                    <div className="flex flex-col gap-1">
                        <label>
                            Calories
                        </label>

                        <input
                            type="number"
                            value={calories}
                            onChange={(e) =>
                                setCalories(
                                    e.target.value
                                )
                            }
                            className="rounded border p-2"
                        />
                    </div>

                    <div className="flex flex-col gap-1">
                        <label>
                            Meal Type
                        </label>

                        <select
                            value={mealType}
                            onChange={(e) =>
                                setMealType(
                                    e.target.value
                                )
                            }
                            className="rounded border p-2"
                        >
                            <option value="BREAKFAST">
                                Breakfast
                            </option>

                            <option value="LUNCH">
                                Lunch
                            </option>

                            <option value="SNACK">
                                Snack
                            </option>

                            <option value="DINNER">
                                Dinner
                            </option>

                            <option value="SUPPER">
                                Supper
                            </option>
                        </select>
                    </div>

                    <div className="flex flex-col gap-1">
                        <label>
                            Consumed At
                        </label>

                        <input
                            type="datetime-local"
                            value={consumedAt}
                            onChange={(e) =>
                                setConsumedAt(
                                    e.target.value
                                )
                            }
                            className="rounded border p-2"
                        />
                    </div>

                    {error && (
                        <p className="text-sm text-red-500">
                            {error}
                        </p>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className="rounded bg-black p-2 text-white disabled:opacity-50"
                    >
                        {loading ? "Creating..." : "Create Meal"}
                    </button>
                </form>
            </div>
        </div>
    );
}
