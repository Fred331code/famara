
import { db } from "@/lib/db";
import { notFound } from "next/navigation";
import { MapPin, User, Star, Check, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BookingForm } from "@/components/booking-form";

export const dynamic = 'force-dynamic';

export default async function PropertyDetailsPage({
    params
}: {
    params: { id: string }
}) {
    const property = await db.property.findUnique({
        where: { id: params.id },
        include: {
            host: {
                select: { name: true, image: true, createdAt: true }
            }
        }
    });

    if (!property) {
        return notFound();
    }

    const images = property.images && property.images.length > 0 ? property.images : ['/placeholder.jpg'];

    return (
        <div className="min-h-screen bg-white">
            {/* Header / Title Section */}
            <div className="container pt-8 pb-4">
                <h1 className="text-3xl font-bold text-slate-900 mb-2">{property.title}</h1>
                <div className="flex items-center gap-4 text-sm text-slate-600">
                    <div className="flex items-center gap-1 font-medium text-slate-900">
                        <Star className="w-4 h-4 fill-slate-900" />
                        <span>5.0</span>
                        <span className="underline cursor-pointer">7 reviews</span>
                    </div>
                    <span>•</span>
                    <div className="flex items-center gap-1 font-medium underline cursor-pointer">
                        <MapPin className="w-4 h-4" />
                        {property.location}
                    </div>
                </div>
            </div>

            {/* Image Grid (Simple for now: 1 main + others hidden or grid) */}
            <div className="container mb-12">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 rounded-xl overflow-hidden h-[400px]">
                    <div className="h-full">
                        <img
                            src={images[0]}
                            alt={property.title}
                            className="w-full h-full object-cover hover:opacity-95 transition-opacity cursor-pointer"
                        />
                    </div>
                    <div className="hidden md:grid grid-cols-2 gap-2">
                        {images.slice(1, 5).map((img, i) => (
                            <div key={i} className="h-full">
                                <img src={img} alt={`Gallery ${i}`} className="w-full h-full object-cover hover:opacity-95 transition-opacity cursor-pointer" />
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Content Split */}
            <div className="container grid grid-cols-1 lg:grid-cols-3 gap-12 pb-20">
                {/* Left Column: Details */}
                <div className="lg:col-span-2 space-y-8">
                    <div className="flex justify-between items-center pb-6 border-b border-slate-200">
                        <div>
                            <h2 className="text-xl font-semibold mb-1">Entire place hosted by {property.host.name}</h2>
                            <p className="text-slate-500">{property.maxGuests} guests • 2 bedrooms • 1 bath</p>
                        </div>
                        <div className="h-12 w-12 rounded-full bg-slate-200 overflow-hidden flex items-center justify-center">
                            {property.host.image ? (
                                <img src={property.host.image} alt={property.host.name || "Host"} />
                            ) : (
                                <User className="w-6 h-6 text-slate-400" />
                            )}
                        </div>
                    </div>

                    <div className="pb-6 border-b border-slate-200">
                        <h3 className="font-semibold text-lg mb-4">About this place</h3>
                        <p className="text-slate-600 leading-relaxed whitespace-pre-wrap">
                            {property.description}
                        </p>
                    </div>

                    {property.facilities && property.facilities.length > 0 && (
                        <div className="pb-6 border-b border-slate-200">
                            <h3 className="font-semibold text-lg mb-4">What this place offers</h3>
                            <div className="grid grid-cols-2 gap-4">
                                {property.facilities.map((fac, i) => (
                                    <div key={i} className="flex items-center gap-3">
                                        <Check className="w-4 h-4 text-slate-600" />
                                        <span>{fac}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* Right Column: Booking Card */}
                <div className="relative">
                    <div className="sticky top-24 border rounded-xl p-6 shadow-xl bg-white">
                        <div className="flex justify-between items-end mb-6">
                            <div>
                                <span className="text-2xl font-bold">€{Number(property.pricePerNight)}</span>
                                <span className="text-slate-500"> / night</span>
                            </div>
                            <div className="flex items-center gap-1 text-sm font-semibold">
                                <Star className="w-3 h-3 fill-black" />
                                <span>5.0</span>
                            </div>
                        </div>

                        <div className="border rounded-lg mb-4 overflow-hidden">
                            <div className="flex border-b">
                                <div className="w-1/2 p-3 border-r">
                                    <div className="text-[10px] font-bold uppercase text-slate-800">Check-in</div>
                                    <div className="text-sm text-slate-500">Add date</div>
                                </div>
                                <div className="w-1/2 p-3">
                                    <div className="text-[10px] font-bold uppercase text-slate-800">Checkout</div>
                                    <div className="text-sm text-slate-500">Add date</div>
                                </div>
                            </div>
                            <div className="p-3">
                                <div className="text-[10px] font-bold uppercase text-slate-800">Guests</div>
                                <div className="text-sm text-slate-500">1 guest</div>
                            </div>
                        </div>

                        <Button className="w-full bg-rose-600 hover:bg-rose-700 text-lg py-6 font-semibold">
                            Reserve
                        </Button>

                        <p className="text-center text-xs text-slate-500 mt-4">You won't be charged yet</p>

                        <div className="mt-6 flex justify-between text-slate-600">
                            <span className="underline">€{Number(property.pricePerNight)} x 5 nights</span>
                            <span>€{Number(property.pricePerNight) * 5}</span>
                        </div>
                        <div className="mt-3 flex justify-between text-slate-600">
                            <span className="underline">Cleaning fee</span>
                            <span>€50</span>
                        </div>
                        <div className="mt-6 pt-4 border-t flex justify-between font-bold text-lg">
                            <span>Total</span>
                            <span>€{Number(property.pricePerNight) * 5 + 50}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
