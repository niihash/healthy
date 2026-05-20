"use client";

import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";

export default function Login() {
    const router = useRouter();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    async function handleSubmit(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();

        setLoading(true);
        setError("");

        try {
            const response = await fetch(
                "/api/auth/login",
                {
                    method: "POST",
                    headers: {
                        "Content-Type":
                            "application/json",
                    },
                    body: JSON.stringify({
                        email,
                        password,
                    }),
                }
            );

            const data = await response.json();

            if (!response.ok) {
                setError(
                    data.error ||
                    "Invalid credentials"
                );
                return;
            }

            router.push("/dashboard");
        } catch {
            setError("Internal server error");
        } finally {
            setLoading(false);
        }

        return (
            <div className="flex min-h-screen items-center justify-center">
                <form
                    onSubmit={handleSubmit}
                    className="flex w-full max-w-sm flex-col gap-4 rounded border p-6"
                >
                    <h1 className="text-2xl font-bold">
                        Login
                    </h1>

                    <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) =>
                            setEmail(e.target.value)
                        }
                        className="rounded border p-2"
                    />

                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) =>
                            setPassword(e.target.value)
                        }
                        className="rounded border p-2"
                    />

                    {error && (
                        <p className="text-sm text-red-500">
                            {error}
                        </p>
                    )}

                    <button type="submit" disabled={loading} className="rounded bg-black p-2 text-white disabled:opacity-50">
                        {loading ? "Loading..." : "Login"}
                    </button>
                </form>
            </div>
        )
    }
}
