import { MainNav } from "@/components/main-nav";
import { SearchFilters } from "@/components/search-filters";
import { PropertyCard } from "@/components/property-card";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { SlidersHorizontal } from "lucide-react";

// Dummy data for listings (expanded)
const PROPERTIES = [
    {
        id: "1",
        title: "Eco-Lodge Famara Beach",
        location: "Caleta de Famara, Lanzarote",
        price: 120,
        rating: 4.9,
        images: ["https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?q=80&w=2671&auto=format&fit=crop"],
    },
    {
        id: "2",
        title: "Sunset Surf Villa",
        location: "Famara, Lanzarote",
        price: 250,
        rating: 4.8,
        images: ["https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?q=80&w=2670&auto=format&fit=crop"],
    },
    {
        id: "3",
        title: "Volcanic Rock Cabin",
        location: "Teguise, Lanzarote",
        price: 85,
        rating: 4.7,
        images: ["https://images.unsplash.com/photo-1470770841072-f978cf4d019e?q=80&w=2670&auto=format&fit=crop"],
    },
    {
        id: "4",
        title: "Ocean View Apartment",
        location: "San Juan, Lanzarote",
        price: 150,
        rating: 4.95,
        images: ["https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?q=80&w=2670&auto=format&fit=crop"],
    },
    {
        id: "5",
        title: "Modern Beachfront Studio",
        location: "Caleta de Famara",
        price: 95,
        rating: 4.6,
        images: ["https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?q=80&w=2580&auto=format&fit=crop"],
    },
    {
        id: "6",
        title: "Luxury White Villa",
        location: "Famara Hills",
        price: 400,
        rating: 5.0,
        images: ["https://images.unsplash.com/photo-1600596542815-27bfef402399?q=80&w=2670&auto=format&fit=crop"],
    },
];

export default function SearchPage() {
    return (
        <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
            <MainNav />

            <main className="flex-1 container mx-auto px-4 py-8">
                <div className="flex flex-col md:flex-row gap-8">
                    {/* Mobile Filter Trigger */}
                    <div className="md:hidden">
                        <Sheet>
                            <SheetTrigger asChild>
                                <Button variant="outline" className="w-full">
                                    <SlidersHorizontal className="w-4 h-4 mr-2" /> Filters
                                </Button>
                            </SheetTrigger>
                            <SheetContent side="left">
                                <div className="mt-6">
                                    <SearchFilters />
                                </div>
                            </SheetContent>
                        </Sheet>
                    </div>

                    {/* Desktop Filters Sidebar */}
                    <aside className="hidden md:block w-64 flex-shrink-0">
                        <div className="sticky top-24">
                            <SearchFilters />
                        </div>
                    </aside>

                    {/* Listings Grid */}
                    <div className="flex-1">
                        <h1 className="text-2xl font-bold text-slate-900 mb-6">
                            Accommodations in Famara ({PROPERTIES.length})
                        </h1>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {PROPERTIES.map((property) => (
                                <PropertyCard
                                    key={property.id}
                                    {...property}
                                />
                            ))}
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
