"use client";

import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { MapPin, Heart, Calendar } from "lucide-react";

export default function GuestDashboard() {
    const { data: session } = useSession();

    return (
        <div className="container py-10">
            <div className="flex flex-col md:flex-row items-center justify-between mb-10 gap-4">
                <div>
                    <h1 className="text-3xl font-bold">Welcome back, {session?.user?.name || "Guest"}</h1>
                    <p className="text-slate-500">Manage your trips and saved properties.</p>
                </div>
                <Link href="/search">
                    <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl">
                        Find a Place to Stay
                    </Button>
                </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Upcoming Trips */}
                <div className="md:col-span-2 space-y-6">
                    <h2 className="text-xl font-bold flex items-center gap-2">
                        <Calendar className="w-5 h-5 text-blue-600" />
                        Upcoming Trips
                    </h2>

                    {/* Empty State */}
                    <div className="bg-slate-50 border border-slate-100 rounded-2xl p-10 text-center">
                        <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm">
                            <MapPin className="w-8 h-8 text-slate-300" />
                        </div>
                        <h3 className="text-lg font-medium text-slate-900 mb-2">No trips booked... yet!</h3>
                        <p className="text-slate-500 mb-6 max-w-sm mx-auto">
                            Time to dust off your bags and start planning your next adventure in Famara.
                        </p>
                        <Link href="/search">
                            <Button variant="outline" className="text-blue-600 border-blue-200 hover:bg-blue-50">
                                Explore Accommodations
                            </Button>
                        </Link>
                    </div>
                </div>

                {/* Saved / Favorites */}
                <div className="space-y-6">
                    <h2 className="text-xl font-bold flex items-center gap-2">
                        <Heart className="w-5 h-5 text-red-500" />
                        Saved Properties
                    </h2>

                    <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm min-h-[200px] flex flex-col items-center justify-center text-center">
                        <p className="text-slate-400 text-sm">You haven't saved any properties yet.</p>
                    </div>
                </div>
            </div>

            {/* Recommended Experiences */}
            <div className="mt-16">
                <h2 className="text-2xl font-bold mb-6">Recommended Interactions</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Placeholder for recommendations - reused design pattern */}
                    <div className="bg-white rounded-xl overflow-hidden border border-slate-100 shadow-sm hover:shadow-md transition-all group cursor-pointer">
                        <div className="h-48 bg-slate-200 relative overflow-hidden">
                            <img src="https://images.unsplash.com/photo-1516238840914-94dfc420d62d?q=80&w=2070" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                        </div>
                        <div className="p-4">
                            <h3 className="font-bold text-lg mb-1">Kite Surfing Lessons</h3>
                            <p className="text-slate-500 text-sm line-clamp-2">Master the wind with our certified instructors.</p>
                            <Link href="/experiences/kite-surfing" className="text-blue-600 font-medium text-sm mt-3 inline-block group-hover:underline">View Experience</Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
