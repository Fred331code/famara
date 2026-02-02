"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function GuestRegisterPage() {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        role: "GUEST"
    });
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
                <div className="bg-blue-50 p-8 rounded-2xl border border-blue-100">
                    <h1 className="text-3xl font-bold mb-4 text-blue-800">Welcome!</h1>
                    <p className="text-slate-600 mb-8">
                        We've sent a verification link to <strong>{formData.email}</strong>.
                        <br />
                        Please check your email to activate your account and start booking.
                    </p>
                    <Button asChild variant="default" className="w-full bg-blue-600 text-white hover:bg-blue-500">
                        <Link href="/api/auth/signin">Go to Login</Link>
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div className="container max-w-md mx-auto py-20">
            <div className="text-center mb-8">
                <h1 className="text-3xl font-bold mb-2">Join Famara Booking</h1>
                <p className="text-muted-foreground">Create an account to book your perfect stay.</p>
            </div>

            <div className="bg-white border border-slate-200 p-8 rounded-2xl shadow-lg">
                <form onSubmit={handleSubmit} className="space-y-4">
                    {error && (
                        <div className="bg-red-50 text-red-600 text-sm p-3 rounded-md border border-red-100">
                            {error}
                        </div>
                    )}

                    <div className="space-y-2">
                        <label className="text-sm font-medium">Full Name</label>
                        <input
                            required
                            className="flex h-10 w-full rounded-xl border border-input px-3 py-2 bg-slate-50 focus:bg-white transition-colors"
                            placeholder="Your Name"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium">Email Address</label>
                        <input
                            required
                            type="email"
                            className="flex h-10 w-full rounded-xl border border-input px-3 py-2 bg-slate-50 focus:bg-white transition-colors"
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
                            className="flex h-10 w-full rounded-xl border border-input px-3 py-2 bg-slate-50 focus:bg-white transition-colors"
                            value={formData.password}
                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        />
                    </div>

                    <div className="pt-4">
                        <Button type="submit" className="w-full h-12 text-lg bg-slate-900 hover:bg-slate-800 text-white rounded-xl" disabled={loading}>
                            {loading ? "Creating..." : "Create Account"}
                        </Button>
                    </div>
                </form>

                <div className="mt-6 text-center text-sm border-t border-slate-100 pt-6">
                    <p className="text-slate-500 mb-2">Already have an account?</p>
                    <Link href="/api/auth/signin" className="text-blue-600 font-bold hover:underline">
                        Log in here
                    </Link>
                </div>
            </div>
        </div>
    );
}
