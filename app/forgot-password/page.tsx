
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState("");
    const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
    const [message, setMessage] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus("loading");
        setMessage("");

        try {
            const res = await fetch("/api/auth/forgot-password", {
                method: "POST",
                body: JSON.stringify({ email }),
                headers: { "Content-Type": "application/json" }
            });

            if (res.ok) {
                setStatus("success");
                setMessage("If an account exists, a reset link has been sent.");
            } else {
                setStatus("error");
                setMessage("Something went wrong. Please try again.");
            }
        } catch (error) {
            setStatus("error");
            setMessage("Something went wrong.");
        }
    };

    return (
        <div className="container max-w-md mx-auto py-20">
            <div className="bg-card border p-6 rounded-lg shadow-sm">
                <h1 className="text-2xl font-bold mb-4 text-center">Forgot Password</h1>

                {status === "success" ? (
                    <div className="text-center">
                        <div className="bg-green-50 text-green-700 p-4 rounded mb-4">
                            {message}
                        </div>
                        <p className="text-sm text-muted-foreground">
                            Check your email for the reset link.
                        </p>
                        <div className="mt-4">
                            <Link href="/login">
                                <Button variant="outline">Back to Login</Button>
                            </Link>
                        </div>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <p className="text-sm text-muted-foreground text-center mb-4">
                            Enter your email to receive a password reset link.
                        </p>

                        {status === "error" && (
                            <div className="bg-red-50 text-red-600 p-3 rounded text-sm">
                                {message}
                            </div>
                        )}

                        <div className="space-y-2">
                            <label className="text-sm font-medium">Email</label>
                            <input
                                required
                                type="email"
                                className="flex h-10 w-full rounded-md border border-input px-3 py-2"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>

                        <Button type="submit" className="w-full" disabled={status === "loading"}>
                            {status === "loading" ? "Sending..." : "Send Reset Link"}
                        </Button>

                        <div className="text-center mt-4">
                            <Link href="/login" className="text-sm underline">
                                Back to Login
                            </Link>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
}
