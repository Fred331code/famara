import { MainNav } from "@/components/main-nav";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { PropertyCard } from "@/components/property-card";
import { MapPin, Calendar as CalendarIcon, Users, ArrowRight } from "lucide-react";

const FEATURED_PROPERTIES = [
    {
        id: "1",
        title: "Eco-Lodge Famara Beach",
        location: "Caleta de Famara, Lanzarote",
        price: 120,
        rating: 4.9,
        imageUrl: "https://images.unsplash.com/photo-1510798831971-661eb04b3739?q=80&w=2674&auto=format&fit=crop",
    },
    {
        id: "2",
        title: "Sunset Surf Villa",
        location: "Famara, Lanzarote",
        price: 250,
        rating: 4.8,
        imageUrl: "https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?q=80&w=2670&auto=format&fit=crop",
    },
    {
        id: "3",
        title: "Volcanic Rock Cabin",
        location: "Teguise, Lanzarote",
        price: 85,
        rating: 4.7,
        imageUrl: "https://images.unsplash.com/photo-1470770841072-f978cf4d019e?q=80&w=2670&auto=format&fit=crop",
    },
    {
        id: "4",
        title: "Ocean View Apartment",
        location: "San Juan, Lanzarote",
        price: 150,
        rating: 4.95,
        imageUrl: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?q=80&w=2670&auto=format&fit=crop",
    },
];

export default function Home() {
    return (
        <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
            <MainNav />

            <main className="flex-1">
                {/* Hero Section */}
                <section className="relative h-[600px] w-full flex flex-col items-center justify-center text-center px-4 overflow-hidden">
                    {/* Background Image */}
                    <div className="absolute inset-0 z-0">
                        <img
                            src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=2673&auto=format&fit=crop"
                            alt="Famara Beach"
                            className="w-full h-full object-cover brightness-50"
                        />
                    </div>

                    <div className="relative z-10 max-w-4xl space-y-6 animate-fade-in-up">
                        <h1 className="text-4xl md:text-7xl font-extrabold text-white tracking-tight drop-shadow-lg">
                            Famara awaits.
                        </h1>
                        <p className="text-xl md:text-2xl text-blue-100 max-w-2xl mx-auto font-medium drop-shadow-md">
                            Discover the best surf, stays, and experiences in Lanzarote.
                        </p>
                    </div>

                    {/* Search Bar Widget */}
                    <div className="relative z-20 mt-12 w-full max-w-5xl shadow-2xl rounded-xl overflow-hidden">
                        <Card className="border-0 rounded-xl bg-white/95 backdrop-blur-sm">
                            <CardContent className="p-3 gap-3 grid grid-cols-1 md:grid-cols-[1.5fr,1fr,1fr,auto] items-center">
                                {/* Destination */}
                                <div className="relative flex items-center bg-slate-50 border border-slate-200 rounded-lg px-4 h-14 hover:border-blue-500 transition-colors group focus-within:ring-2 focus-within:ring-blue-200">
                                    <MapPin className="w-5 h-5 text-slate-400 mr-3 group-hover:text-blue-600 transition-colors" />
                                    <div className="flex flex-col items-start w-full">
                                        <span className="text-xs text-slate-500 font-semibold uppercase tracking-wider">Location</span>
                                        <Input
                                            placeholder="Where are you going?"
                                            className="border-0 bg-transparent shadow-none focus-visible:ring-0 placeholder:text-slate-400 h-6 p-0 text-base font-medium"
                                        />
                                    </div>
                                </div>

                                {/* Dates Placeholder */}
                                <div className="relative flex items-center bg-slate-50 border border-slate-200 rounded-lg px-4 h-14 hover:border-blue-500 transition-colors group cursor-pointer">
                                    <CalendarIcon className="w-5 h-5 text-slate-400 mr-3 group-hover:text-blue-600 transition-colors" />
                                    <div className="flex flex-col items-start">
                                        <span className="text-xs text-slate-500 font-semibold uppercase tracking-wider">Dates</span>
                                        <span className="text-sm text-slate-700 font-medium">Add dates</span>
                                    </div>
                                </div>

                                {/* Guests Placeholder */}
                                <div className="relative flex items-center bg-slate-50 border border-slate-200 rounded-lg px-4 h-14 hover:border-blue-500 transition-colors group cursor-pointer">
                                    <Users className="w-5 h-5 text-slate-400 mr-3 group-hover:text-blue-600 transition-colors" />
                                    <div className="flex flex-col items-start">
                                        <span className="text-xs text-slate-500 font-semibold uppercase tracking-wider">Guests</span>
                                        <span className="text-sm text-slate-700 font-medium">Add guests</span>
                                    </div>
                                </div>

                                {/* Search Button */}
                                <Button size="lg" className="h-14 px-8 text-lg font-bold bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-900/20 rounded-lg">
                                    Search
                                </Button>
                            </CardContent>
                        </Card>
                    </div>
                </section>

                {/* Featured Properties Section */}
                <section className="container mx-auto px-4 py-20">
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h2 className="text-3xl font-bold text-slate-900">Featured Stays</h2>
                            <p className="text-slate-500 mt-2">Highly rated places to stay in Famara</p>
                        </div>
                        <Button variant="ghost" className="text-blue-600 hover:text-blue-700 font-semibold group">
                            View all stays <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                        </Button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                        {FEATURED_PROPERTIES.map((property) => (
                            <PropertyCard
                                key={property.id}
                                {...property}
                            />
                        ))}
                    </div>
                </section>

                {/* Categories Section */}
                <section className="bg-slate-100 py-20">
                    <div className="container mx-auto px-4">
                        <h2 className="text-2xl font-bold text-slate-900 mb-8">Browse by property type</h2>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                            {["Hotels", "Apartments", "Resorts", "Villas"].map((type, i) => (
                                <div key={type} className="group cursor-pointer bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition-all">
                                    <div className="aspect-[4/3] rounded-lg bg-slate-200 mb-4 overflow-hidden">
                                        <img
                                            src={`https://images.unsplash.com/photo-${1560000000000 + i}?q=80&w=400&auto=format&fit=crop`}
                                            alt={type}
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                        />
                                    </div>
                                    <h3 className="font-semibold text-slate-800 text-center">{type}</h3>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            </main>

            <footer className="bg-slate-900 text-slate-400 py-12">
                <div className="container mx-auto px-4 text-center">
                    <p>© 2026 Famara Booking. All rights reserved.</p>
                </div>
            </footer>
        </div>
    );
}
