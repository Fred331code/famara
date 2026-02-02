import { db } from "@/lib/db";
import { PropertyCard } from "@/components/property-card";
import { MainNav } from "@/components/main-nav";
import { format } from "date-fns";

export const dynamic = 'force-dynamic';

export default async function AccommodationsPage({
    searchParams
}: {
    searchParams: { location?: string; guests?: string; from?: string; to?: string }
}) {
    const { location, guests, from, to } = searchParams;

    // Build query filters
    const where: any = {};

    if (location) {
        where.location = {
            contains: location,
            mode: 'insensitive'
        };
    }

    if (guests) {
        where.maxGuests = {
            gte: parseInt(guests)
        };
    }

    if (from && to) {
        where.bookings = {
            none: {
                OR: [
                    { startDate: { lte: new Date(to) }, endDate: { gte: new Date(from) } }
                ],
                status: {
                    in: ['CONFIRMED', 'PENDING']
                }
            }
        };
    }

    const properties = await db.property.findMany({
        where,
        include: {
            propertyImages: true
        },
        orderBy: {
            createdAt: 'desc'
        }
    });

    return (
        <div className="min-h-screen bg-slate-50">

            <div className="container px-4 py-8">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold mb-2">Find your perfect accommodation</h1>
                    <p className="text-slate-500">
                        {from && to ? `Showing availability for ${format(new Date(from), "MMM dd")} - ${format(new Date(to), "MMM dd")}` : "Explore the best properties in Famara"}
                    </p>
                </div>

                {/* Filter / Search Bar Placeholder */}
                <div className="bg-white p-4 rounded-lg shadow-sm mb-8 flex gap-4 items-end max-w-2xl">
                    <form className="flex gap-4 w-full">
                        <div className="flex-1 space-y-1">
                            <label className="text-xs font-semibold uppercase text-slate-500">Location</label>
                            <input
                                name="location"
                                placeholder="Where are you going?"
                                defaultValue={location}
                                className="w-full border-b border-slate-200 py-1 focus:outline-none focus:border-black transition-colors"
                            />
                        </div>
                        <div className="w-24 space-y-1">
                            <label className="text-xs font-semibold uppercase text-slate-500">Guests</label>
                            <input
                                name="guests"
                                type="number"
                                placeholder="2"
                                min="1"
                                defaultValue={guests}
                                className="w-full border-b border-slate-200 py-1 focus:outline-none focus:border-black transition-colors"
                            />
                        </div>
                        {/* Hidden Date Inputs to preserve filter if searching from this small bar */}
                        {from && <input type="hidden" name="from" value={from} />}
                        {to && <input type="hidden" name="to" value={to} />}

                        <button className="bg-black text-white px-6 py-2 rounded-md font-medium text-sm hover:bg-slate-800 transition">
                            Search
                        </button>
                    </form>
                </div>

                {properties.length === 0 ? (
                    <div className="text-center py-20 text-slate-500">
                        <p className="text-lg">No properties found matching your criteria.</p>
                        <a href="/accommodations" className="text-blue-600 hover:underline mt-2 inline-block">Clear filters</a>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {properties.map((property) => {
                            // Image Logic: Prioritize new PropertyImages, fall back to legacy array
                            const allImages = property.propertyImages.map(pi => pi.url);
                            if (property.images && property.images.length > 0) {
                                allImages.push(...property.images);
                            }
                            if (allImages.length === 0) allImages.push('/placeholder.jpg');

                            return (
                                <PropertyCard
                                    key={property.id}
                                    id={property.id}
                                    title={property.title}
                                    location={property.location}
                                    price={Number(property.pricePerNight)}
                                    rating={5} // Placeholder rating
                                    images={allImages}
                                />
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}
