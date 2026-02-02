"use client";

import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Home, Users, DollarSign, Plus } from "lucide-react";

export default function HostDashboard() {
    const { data: session } = useSession();

    return (
        <div className="container py-10">
            <div className="flex flex-col md:flex-row items-center justify-between mb-10 gap-4">
                <div>
                    <h1 className="text-3xl font-bold">Host Dashboard</h1>
                    <p className="text-slate-500">Welcome back, {session?.user?.name || "Host"}. Here's what's happening.</p>
                </div>
                <Link href="/host/properties/new">
                    <Button size="lg" className="bg-slate-900 hover:bg-slate-800 text-white rounded-xl">
                        <Plus className="w-5 h-5 mr-2" />
                        List a New Property
                    </Button>
                </Link>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center">
                            <Home className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="text-sm text-slate-500 font-medium">Total Properties</p>
                            <h3 className="text-2xl font-bold text-slate-900">0</h3>
                        </div>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-green-50 text-green-600 flex items-center justify-center">
                            <DollarSign className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="text-sm text-slate-500 font-medium">Total Earnings</p>
                            <h3 className="text-2xl font-bold text-slate-900">€0.00</h3>
                        </div>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-purple-50 text-purple-600 flex items-center justify-center">
                            <Users className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="text-sm text-slate-500 font-medium">Active Bookings</p>
                            <h3 className="text-2xl font-bold text-slate-900">0</h3>
                        </div>
                    </div>
                </div>
            </div>

            {/* Recent Activity / Listings */}
            <div className="space-y-6">
                <h2 className="text-xl font-bold">Your Listings</h2>

                <div className="bg-slate-50 border border-slate-100 rounded-2xl p-10 text-center">
                    <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm">
                        <Home className="w-8 h-8 text-slate-300" />
                    </div>
                    <h3 className="text-lg font-medium text-slate-900 mb-2">No properties listed yet</h3>
                    <p className="text-slate-500 mb-6 max-w-sm mx-auto">
                        Start earning by creating your first listing on Famara Booking.
                    </p>
                    <Link href="/host/properties/new">
                        <Button variant="outline" className="text-slate-900 border-slate-200 hover:bg-white">
                            Create Layout
                        </Button>
                    </Link>
                </div>
            </div>
        </div>
    );
}
