import { MainNav } from "@/components/main-nav";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { PropertyCard } from "@/components/property-card";
import { SearchBar } from "@/components/search-bar";
import { MapPin, Calendar as CalendarIcon, Users, ArrowRight } from "lucide-react";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";

import { db } from "@/lib/db";

const LANZAROTE_DUMMIES = [
    {
        id: "dummy-1",
        title: "Villa Manrique Style",
        location: "Tahiche, Lanzarote",
        pricePerNight: 200,
        rating: 4.9,
        images: [
            "https://images.unsplash.com/photo-1613490493576-7fde63acd811?q=80&w=2671&auto=format&fit=crop", // Modern Beach Villa
        ],
    },
    {
        id: "dummy-2",
        title: "Papagayo Beach Resort",
        location: "Playa Blanca, Lanzarote",
        pricePerNight: 350,
        rating: 4.8,
        images: [
            "https://images.unsplash.com/photo-1582719508461-905c673771fd?q=80&w=2525&auto=format&fit=crop", // Pool villa
        ],
    }
];

export default async function Home() {
    const session = await getServerSession(authOptions);

    if (session?.user?.role === 'HOST') {
        redirect('/host/properties');
    }

    // Fetch up to 2 real properties
    const realProperties = await db.property.findMany({
        take: 2,
        orderBy: { createdAt: 'desc' },
        select: {
            id: true,
            title: true,
            location: true,
            pricePerNight: true,
            images: true, // Assuming we still use the string[] images field for now, or propertyImages
            // We need to map DB shape to PropertyCard shape
        }
    });

    const formattedRealProperties = realProperties.map(p => ({
        id: p.id,
        title: p.title,
        location: p.location,
        price: Number(p.pricePerNight),
        rating: 5.0, // Hardcoded for now or fetch reviews
        images: p.images || []
    }));

    const featuredProperties = [...formattedRealProperties, ...LANZAROTE_DUMMIES.map(d => ({
        ...d,
        price: d.pricePerNight
    }))].slice(0, 4);

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
            <main className="flex-1">
                {/* Hero Section */}
                <section className="relative h-[600px] w-full flex flex-col items-center justify-center text-center px-4 overflow-hidden">
                    {/* Background Image */}
                    <div className="absolute inset-0 z-0">
                        <img
                            src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=2673&auto=format&fit=crop"
                            alt="Lanzarote Landscape"
                            className="w-full h-full object-cover brightness-50"
                        />
                    </div>

                    <div className="relative z-10 max-w-4xl space-y-6 animate-fade-in-up">
                        <h1 className="text-4xl md:text-7xl font-extrabold text-white tracking-tight drop-shadow-lg">
                            Hotel In Lanzarote
                        </h1>
                        <p className="text-xl md:text-2xl text-blue-100 max-w-2xl mx-auto font-medium drop-shadow-md">
                            Discover the unique volcanic charm and luxury accommodations of the island.
                        </p>
                    </div>

                    {/* Search Bar Widget */}
                    <SearchBar />
                </section>

                {/* Featured Properties Section */}
                <section className="container mx-auto px-4 py-20">
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h2 className="text-3xl font-bold text-slate-900">Featured Accommodations</h2>
                            <p className="text-slate-500 mt-2">Top rated accommodations in Lanzarote</p>
                        </div>
                        <Button variant="ghost" className="text-blue-600 hover:text-blue-700 font-semibold group">
                            View all accommodations <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                        </Button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
                        {featuredProperties.map((property) => (
                            <PropertyCard
                                key={property.id}
                                {...property}
                            />
                        ))}
                    </div>
                </section>
            </main>


        </div>
    );
}
