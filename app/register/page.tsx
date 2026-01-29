"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
    const router = useRouter();
    const [formData, setFormData] = useState({ name: "", email: "", password: "" });
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            const res = await fetch("/api/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.error || "Registration failed");
            }

            setSuccess(true);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    if (success) {
        return (
            <div className="container max-w-md mx-auto py-20 text-center">
                <h1 className="text-3xl font-bold mb-4">Check your Email</h1>
                <p className="text-muted-foreground mb-8">
                    We've sent a verification link to <strong>{formData.email}</strong>.
                    <br />
                    (Since this is dev mode, check the server terminal/console!)
                </p>
                <Button asChild variant="outline">
                    <Link href="/api/auth/signin">Go to Login</Link>
                </Button>
            </div>
        );
    }

    return (
        <div className="container max-w-md mx-auto py-20">
            <div className="text-center mb-8">
                <h1 className="text-3xl font-bold">Create Account</h1>
                <p className="text-muted-foreground">Join to list or book properties.</p>
            </div>

            <div className="bg-card border p-6 rounded-lg shadow-sm">
                <form onSubmit={handleSubmit} className="space-y-4">
                    {error && (
                        <div className="bg-red-50 text-red-600 text-sm p-3 rounded-md">
                            {error}
                        </div>
                    )}

                    <div className="space-y-2">
                        <label className="text-sm font-medium">Name</label>
                        <input
                            required
                            className="flex h-10 w-full rounded-md border border-input px-3 py-2"
                            placeholder="Your Name"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium">Email</label>
                        <input
                            required
                            type="email"
                            className="flex h-10 w-full rounded-md border border-input px-3 py-2"
                            placeholder="you@example.com"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium">Password</label>
                        <input
                            required
                            type="password"
                            className="flex h-10 w-full rounded-md border border-input px-3 py-2"
                            value={formData.password}
                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        />
                    </div>

                    <Button type="submit" className="w-full" disabled={loading}>
                        {loading ? "Creating..." : "Sign Up"}
                    </Button>
                </form>

                <div className="mt-4 text-center text-sm">
                    Already have an account?{" "}
                    <Link href="/api/auth/signin" className="underline font-medium">
                        Log in
                    </Link>
                </div>
            </div>
        </div>
    );
}
