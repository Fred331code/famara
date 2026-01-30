
"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import Link from "next/link";

function ResetPasswordForm() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const token = searchParams.get("token");

    const [password, setPassword] = useState("");
    const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
    const [message, setMessage] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!token) {
            setStatus("error");
            setMessage("Invalid or missing token.");
            return;
        }

        setStatus("loading");

        try {
            const res = await fetch("/api/auth/reset-password", {
                method: "POST",
                body: JSON.stringify({ token, newPassword: password }),
                headers: { "Content-Type": "application/json" }
            });

            const data = await res.json();

            if (res.ok) {
                setStatus("success");
                setMessage("Password updated successfully!");
                setTimeout(() => router.push("/login"), 3000);
            } else {
                setStatus("error");
                setMessage(data.error || "Something went wrong.");
            }
        } catch (error) {
            setStatus("error");
            setMessage("Something went wrong.");
        }
    };

    if (!token) {
        return (
            <div className="container max-w-md mx-auto py-20 text-center">
                <div className="bg-red-50 text-red-600 p-4 rounded mb-4">
                    Missing or invalid reset token.
                </div>
                <Link href="/forgot-password">
                    <Button variant="outline">Request a new link</Button>
                </Link>
            </div>
        );
    }

    return (
        <div className="container max-w-md mx-auto py-20">
            <div className="bg-card border p-6 rounded-lg shadow-sm">
                <h1 className="text-2xl font-bold mb-4 text-center">Reset Password</h1>

                {status === "success" ? (
                    <div className="text-center">
                        <div className="bg-green-50 text-green-700 p-4 rounded mb-4">
                            {message}
                        </div>
                        <p className="text-sm text-muted-foreground">
                            Redirecting to login...
                        </p>
                        <Link href="/login">
                            <Button className="mt-4">Login Now</Button>
                        </Link>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="space-y-4">
                        {status === "error" && (
                            <div className="bg-red-50 text-red-600 p-3 rounded text-sm">
                                {message}
                            </div>
                        )}

                        <div className="space-y-2">
                            <label className="text-sm font-medium">New Password</label>
                            <input
                                required
                                type="password"
                                className="flex h-10 w-full rounded-md border border-input px-3 py-2"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                minLength={6}
                            />
                        </div>

                        <Button type="submit" className="w-full" disabled={status === "loading"}>
                            {status === "loading" ? "Updating..." : "Update Password"}
                        </Button>
                    </form>
                )}
            </div>
        </div>
    );
}

export default function ResetPasswordPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <ResetPasswordForm />
        </Suspense>
    );
}
