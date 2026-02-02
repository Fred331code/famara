"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { User, Home } from "lucide-react";

export default function RegisterLandingPage() {
    return (
        <div className="container max-w-4xl mx-auto py-20">
            <div className="text-center mb-16">
                <h1 className="text-4xl font-bold mb-4">Join Us</h1>
                <p className="text-xl text-slate-600">Choose how you want to use our platform.</p>
            </div>

            <div className="grid md:grid-cols-2 gap-8 max-w-3xl mx-auto">
                {/* Guest Option */}
                <Link href="/register/guest" className="group">
                    <div className="h-full bg-white p-10 rounded-3xl border-2 border-slate-100 hover:border-blue-600 hover:shadow-2xl transition-all duration-300 flex flex-col items-center text-center">
                        <div className="w-20 h-20 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                            <User className="w-10 h-10" />
                        </div>
                        <h2 className="text-2xl font-bold mb-3 text-slate-900">I am a Guest</h2>
                        <p className="text-slate-500 mb-8 leading-relaxed">
                            Find and book the perfect accommodation for your stay in Lanzarote.
                            Discover local experiences and manage your trips.
                        </p>
                        <Button className="w-full mt-auto bg-slate-900 group-hover:bg-blue-600 transition-colors rounded-xl h-12 text-lg">
                            Join as a Guest
                        </Button>
                    </div>
                </Link>

                {/* Host Option */}
                <Link href="/register/host" className="group">
                    <div className="h-full bg-white p-10 rounded-3xl border-2 border-slate-100 hover:border-blue-600 hover:shadow-2xl transition-all duration-300 flex flex-col items-center text-center">
                        <div className="w-20 h-20 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                            <Home className="w-10 h-10" />
                        </div>
                        <h2 className="text-2xl font-bold mb-3 text-slate-900">I am a Host</h2>
                        <p className="text-slate-500 mb-8 leading-relaxed">
                            List your property and reach thousands of guests.
                            Manage your calendar, pricing, and reservations with ease.
                        </p>
                        <Button className="w-full mt-auto bg-white border-2 border-slate-200 text-slate-900 group-hover:bg-blue-50 group-hover:border-blue-200 transition-all rounded-xl h-12 text-lg hover:text-blue-700">
                            Become a Host
                        </Button>
                    </div>
                </Link>
            </div>

            <div className="mt-16 text-center">
                <p className="text-slate-500">
                    Already have an account?{" "}
                    <Link href="/api/auth/signin" className="text-blue-600 font-bold hover:underline">
                        Log in
                    </Link>
                </p>
            </div>
        </div>
    );
}
