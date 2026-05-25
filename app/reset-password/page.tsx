"use client";

import { FormEvent, useState } from "react";
import { createClient } from "@/lib/supabase/client";

export default function ResetPassword() {
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    async function handleSubmit(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();

        if (password !== confirmPassword) {
            setError("Passwords do not match");
            return;
        }

        if (password.length < 6) {
            setError("Password must be at least 6 characters long");
            return;
        }

        setLoading(true);
        setError("");
        setSuccess("");

        try {
            const supabase = createClient();

            const { error: updateError } = await supabase.auth.updateUser({
                password: password,
            });

            if (updateError) {
                setError(updateError.message);
                return;
            }

            setSuccess("Password reset successfully! You can now log in.");
            setPassword("");
            setConfirmPassword("");
        } catch {
            setError("Internal server error");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="flex min-h-screen items-center justify-center">
            <form
                onSubmit={handleSubmit}
                className="flex w-full max-w-sm flex-col gap-4 rounded border p-6"
            >
                <h1 className="text-2xl font-bold">Reset Password</h1>

                <input
                    type="password"
                    placeholder="New Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="rounded border p-2"
                />

                <input
                    type="password"
                    placeholder="Confirm New Password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    className="rounded border p-2"
                />

                {error && <p className="text-sm text-red-500">{error}</p>}

                {success && <p className="text-sm text-green-600">{success}</p>}

                <button
                    type="submit"
                    disabled={loading}
                    className="rounded bg-black p-2 text-white disabled:opacity-50"
                >
                    {loading ? "Resetting..." : "Reset Password"}
                </button>
            </form>
        </div>
    );
}
