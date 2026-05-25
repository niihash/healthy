"use client";

import { FormEvent, useState } from "react";

export default function ForgotPassword() {
    const [email, setEmail] = useState("");

    const [loading, setLoading] = useState(false);

    const [error, setError] = useState("");

    const [success, setSuccess] = useState("");

    async function handleSubmit(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();

        setLoading(true);

        setError("");
        setSuccess("");

        try {
            const response = await fetch(
                "/api/auth/forgot-password",
                {
                    method: "POST",

                    headers: {
                        "Content-Type": "application/json",
                    },

                    body: JSON.stringify({
                        email,
                    }),
                }
            );

            const data = await response.json();

            if (!response.ok) {
                setError(data.error || "Failed to send email");

                return;
            }

            setSuccess(
                "Recovery email sent"
            );
        } catch {
            setError("Internal server error");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="flex min-h-screen items-center justify-center">
            <form
                onSubmit={
                    handleSubmit
                }
                className="flex w-full max-w-sm flex-col gap-4 rounded border p-6"
            >
                <h1 className="text-2xl font-bold">
                    Recover Password
                </h1>

                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) =>
                        setEmail(
                            e.target.value
                        )
                    }
                    className="rounded border p-2"
                />

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
                    disabled={loading}
                    className="rounded bg-black p-2 text-white disabled:opacity-50"
                >
                    {loading
                        ? "Sending..."
                        : "Send recovery email"}
                </button>
            </form>
        </div>
    );
}
