"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState, } from "react";

type FastingSession = {
    id: string;
    plannedType: string;
    startedAt: string;
    endedAt: string | null;
    durationMinutes: number | null;
    isActive: boolean;
};

export default function FastingPage() {
    const router = useRouter();

    const [currentSession, setCurrentSession] = useState<FastingSession | null>(null);

    const [history, setHistory] = useState<FastingSession[]>([]);

    const [plannedType, setPlannedType] = useState("FAST_16_8");

    const [loading, setLoading] = useState(true);

    const [saving, setSaving] = useState(false);

    const [error, setError] = useState("");

    const [now, setNow] = useState(0);

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
        async function loadData() {
            try {
                const [currentResponse, historyResponse,] = await Promise.all([
                    fetch("/api/fasting/current"),

                    fetch("/api/fasting/history"),
                ]);

                const currentData = await currentResponse.json();

                const historyData = await historyResponse.json();

                if (!currentResponse.ok) {
                    setError(currentData.error || "Failed to load current fasting session");
                    return;
                }

                if (!historyResponse.ok) {
                    setError(historyData.error || "Failed to load fasting history");
                    return;
                }

                setCurrentSession(currentData);

                setHistory(historyData);
            } catch {
                setError("Internal server error");
            } finally {
                setLoading(false);
            }
        }

        loadData();
    }, []);

    useEffect(() => {
        const interval = setInterval(() => { setNow(Date.now()); }, 1000);

        return () => clearInterval(interval);
    }, []);

    const elapsedTime =
        useMemo(() => {
            if (!currentSession) {
                return "00:00:00";
            }

            const startedAt = new Date(currentSession.startedAt).getTime();

            const diff = now - startedAt;

            const totalSeconds = Math.floor(diff / 1000);

            const hours = Math.floor(totalSeconds / 3600);

            const minutes = Math.floor((totalSeconds % 3600) / 60);

            const seconds = totalSeconds % 60;

            return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
        }, [currentSession, now]);

    async function handleStart() {
        setSaving(true);
        setError("");

        try {
            const response = await fetch(
                "/api/fasting/start",
                {
                    method: "POST",

                    headers: {
                        "Content-Type": "application/json",
                    },

                    body: JSON.stringify({
                        plannedType,
                    }),
                }
            );

            const data = await response.json();

            if (!response.ok) {
                setError(data.error || "Failed to start fasting");
                return;
            }

            setCurrentSession(data);
        } catch {
            setError("Internal server error");
        } finally {
            setSaving(false);
        }
    }

    async function handleEnd() {
        setSaving(true);
        setError("");

        try {
            const response = await fetch(
                "/api/fasting/end",
                {
                    method: "POST",
                }
            );

            const data = await response.json();

            if (!response.ok) {
                setError(data.error || "Failed to end fasting");
                return;
            }

            setCurrentSession(null);

            setHistory((prev) => [
                data,
                ...prev,
            ]);
        } catch {
            setError("Internal server error");
        } finally {
            setSaving(false);
        }
    }

    if (loading) {
        return (
            <div className="p-6">
                Loading fasting data...
            </div>
        );
    }

    return (
        <div className="p-6">
            <div className="mx-auto max-w-5xl">
                <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div>
                        <h1 className="text-3xl font-bold">
                            Fasting
                        </h1>

                        <p className="text-muted-foreground">
                            Gerencie suas sessões de jejum
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

                        <button
                            onClick={handleLogout}
                            className="rounded bg-red-500 px-3 py-2 text-sm text-white"
                        >
                            Logout
                        </button>
                    </div>
                </div>

                {error && (
                    <p className="mb-4 text-red-500">
                        {error}
                    </p>
                )}

                <div className="mb-8 rounded border p-6">
                    {currentSession ? (
                        <div className="flex flex-col gap-4">
                            <div>
                                <h2 className="text-xl font-semibold">
                                    Active Session
                                </h2>
                            </div>

                            <p>
                                Type:{" "}
                                {
                                    currentSession.plannedType
                                }
                            </p>

                            <p>
                                Started At:{" "}
                                {new Date(
                                    currentSession.startedAt
                                ).toLocaleString()}
                            </p>

                            <p className="text-4xl font-bold">
                                {elapsedTime}
                            </p>

                            <button
                                onClick={
                                    handleEnd
                                }
                                disabled={
                                    saving
                                }
                                className="rounded bg-black p-2 text-white disabled:opacity-50"
                            >
                                {saving
                                    ? "Ending..."
                                    : "End Fasting"}
                            </button>
                        </div>
                    ) : (
                        <div className="flex flex-col gap-4">
                            <h2 className="text-xl font-semibold">
                                Start Fasting
                            </h2>

                            <select
                                value={
                                    plannedType
                                }
                                onChange={(
                                    e
                                ) =>
                                    setPlannedType(
                                        e
                                            .target
                                            .value
                                    )
                                }
                                className="rounded border p-2"
                            >
                                <option value="FAST_16_8">
                                    16:8
                                </option>

                                <option value="FAST_18_6">
                                    18:6
                                </option>

                                <option value="FAST_20_4">
                                    20:4
                                </option>

                                <option value="FAST_24H">
                                    24H
                                </option>

                                <option value="CUSTOM">
                                    Custom
                                </option>
                            </select>

                            <button
                                onClick={
                                    handleStart
                                }
                                disabled={
                                    saving
                                }
                                className="rounded bg-black p-2 text-white disabled:opacity-50"
                            >
                                {saving
                                    ? "Starting..."
                                    : "Start Fasting"}
                            </button>
                        </div>
                    )}
                </div>

                <div>
                    <h2 className="mb-4 text-2xl font-bold">
                        History
                    </h2>

                    {history.length ===
                        0 ? (
                        <p>
                            No fasting history
                            found.
                        </p>
                    ) : (
                        <div className="flex flex-col gap-4">
                            {history.map(
                                (
                                    session
                                ) => (
                                    <div
                                        key={
                                            session.id
                                        }
                                        className="rounded border p-4"
                                    >
                                        <p>
                                            Type:{" "}
                                            {
                                                session.plannedType
                                            }
                                        </p>

                                        <p>
                                            Duration:{" "}
                                            {
                                                session.durationMinutes
                                            }{" "}
                                            minutes
                                        </p>

                                        <p>
                                            Started:{" "}
                                            {new Date(
                                                session.startedAt
                                            ).toLocaleString()}
                                        </p>

                                        <p>
                                            Ended:{" "}
                                            {session.endedAt
                                                ? new Date(
                                                    session.endedAt
                                                ).toLocaleString()
                                                : "-"}
                                        </p>
                                    </div>
                                )
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
