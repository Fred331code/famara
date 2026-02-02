"use client";

import { useState, Suspense } from "react";
import { signIn, getSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff } from "lucide-react";
import Link from "next/link";

function LoginForm() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const verified = searchParams.get("verified");
    const callbackUrl = searchParams.get("callbackUrl") || "/";

    const [formData, setFormData] = useState({ email: "", password: "" });
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            const res = await signIn("credentials", {
                redirect: false,
                email: formData.email,
                password: formData.password,
                callbackUrl,
            });

            if (!res?.ok) {
                if (res?.error === "CredentialsSignin") {
                    setError("Invalid credentials.");
                } else {
                    setError(res?.error || "Login failed");
                }
            } else {
                // Fetch the updated session to get the role
                const session = await getSession();
                const role = session?.user?.role;

                if (callbackUrl === "/" || callbackUrl === "/login") {
                    if (role === "HOST") {
                        router.push("/host/dashboard");
                    } else if (role === "GUEST") {
                        router.push("/guest/dashboard");
                    } else {
                        router.push("/");
                    }
                } else {
                    router.push(callbackUrl);
                }

                router.refresh();
            }
        } catch (err: any) {
            setError("Something went wrong.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container max-w-md mx-auto py-20">
            <div className="text-center mb-8">
                <h1 className="text-3xl font-bold">Welcome Back</h1>
                <p className="text-muted-foreground">Login to manage your bookings or properties.</p>
            </div>

            <div className="bg-card border p-6 rounded-lg shadow-sm">
                {verified && (
                    <div className="bg-green-50 text-green-700 text-sm p-3 rounded-md mb-4 text-center font-medium">
                        Email Verified! You can now login.
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    {error && (
                        <div className="bg-red-50 text-red-600 text-sm p-3 rounded-md">
                            {error}
                        </div>
                    )}

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
                        <div className="relative">
                            <input
                                required
                                type={showPassword ? "text" : "password"}
                                className="flex h-10 w-full rounded-md border border-input px-3 py-2 pr-10"
                                value={formData.password}
                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-700 focus:outline-none"
                            >
                                {showPassword ? (
                                    <EyeOff className="h-4 w-4" />
                                ) : (
                                    <Eye className="h-4 w-4" />
                                )}
                            </button>
                        </div>
                    </div>

                    <div className="flex justify-end">
                        <Link href="/forgot-password" className="text-sm text-muted-foreground hover:underline">
                            Forgot Password?
                        </Link>
                    </div>

                    <Button type="submit" className="w-full" disabled={loading}>
                        {loading ? "Logging in..." : "Login"}
                    </Button>
                </form>

                <div className="mt-4 text-center text-sm">
                    Don't have an account?{" "}
                    <Link href="/register" className="underline font-medium">
                        Sign Up
                    </Link>
                </div>
            </div>
        </div>
    );
}

export default function LoginPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <LoginForm />
        </Suspense>
    );
}
