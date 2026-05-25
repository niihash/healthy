"use client";

import { FormEvent, useState, useEffect } from "react";

export default function CalorieGoal() {
    const [dailyCalories, setDailyCalories] = useState("");

    const [loading, setLoading] = useState(true);

    const [saving, setSaving] = useState(false);

    const [error, setError] = useState("");

    const [success, setSuccess] = useState("");

    useEffect(() => {
        async function loadGoal() {
            try {
                const response = await fetch("/api/calorie-goal");

                const data = await response.json();

                if (!response.ok) {
                    setError(data.error || "Failed to load calorie goal");
                    return;
                }

                if (data) {
                    setDailyCalories(String(data.dailyCalories));
                }
            } catch {
                setError("Internal server error");
            } finally {
                setLoading(false);
            }
        }

        loadGoal();
    }, []);

    async function handleSubmit(
        e: FormEvent<HTMLFormElement>
    ) {
        e.preventDefault();

        setSaving(true);

        setError("");
        setSuccess("");

        try {
            const response = await fetch(
                "/api/calorie-goal",
                {
                    method: "PUT",

                    headers: {
                        "Content-Type": "application/json",
                    },

                    body: JSON.stringify({
                        dailyCalories: Number(dailyCalories),
                    }),
                }
            );

            const data = await response.json();

            if (!response.ok) {
                setError(data.error || "Failed to save calorie goal");
                return;
            }

            setSuccess("Calorie goal saved successfully");
        } catch {
            setError("Internal server error");
        } finally {
            setSaving(false);
        }
    }

    if (loading) {
        return (
            <div className="p-6">
                Loading calorie goal...
            </div>
        );
    }

    return (
        <div className="p-6">
            <div className="mx-auto max-w-lg">
                <h1 className="mb-6 text-3xl font-bold">
                    Calorie Goal
                </h1>

                <form
                    onSubmit={handleSubmit}
                    className="flex flex-col gap-4">
                    <div className="flex flex-col gap-1">
                        <label>
                            Daily Calories
                        </label>

                        <input
                            type="number"
                            value={dailyCalories}
                            onChange={(e) =>
                                setDailyCalories(
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

                    {success && (
                        <p className="text-sm text-green-600">
                            {success}
                        </p>
                    )}

                    <button
                        type="submit"
                        disabled={saving}
                        className="rounded bg-black p-2 text-white disabled:opacity-50"
                    >
                        {saving ? "Saving..." : "Save Goal"}
                    </button>
                </form>
            </div>
        </div>
    );
}
