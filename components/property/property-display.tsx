"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Wifi, Utensils, Waves, Sun, Tv, DoorOpen, Coffee, Microwave, Armchair, WashingMachine, Check } from "lucide-react";
import { cn } from "@/lib/utils";

const getFacilityIcon = (name: string) => {
    const lower = name.toLowerCase();
    if (lower.includes("wifi")) return Wifi;
    if (lower.includes("kitchen")) return Utensils;
    if (lower.includes("wash")) return WashingMachine;
    if (lower.includes("beach")) return Waves;
    if (lower.includes("terrace")) return Sun;
    if (lower.includes("tv")) return Tv;
    if (lower.includes("entrance")) return DoorOpen;
    if (lower.includes("coffee")) return Coffee;
    if (lower.includes("microwave")) return Microwave;
    if (lower.includes("furniture")) return Armchair;
    return Check; // Fallback
};

interface Review {
    id: string;
    rating: number;
    comment: string;
    createdAt: Date | string;
    user: {
        name: string | null;
        image: string | null;
    } | null;
}

interface Host {
    name: string | null;
    image: string | null;
    email?: string | null;
}

interface PropertyDisplayProps {
    title: string;
    location: string;
    description: string;
    overview?: string | null;
    images: string[]; // Can be URLs strings
    pricePerNight: number;
    maxGuests: number;
    facilities?: string[];
    houseRules?: string | null;
    legalInfo?: string | null;
    reviews?: Review[];
    host?: Host | null;
    preview?: boolean; // If true, disable booking buttons or interactions
    sidebar?: React.ReactNode;
}

export function PropertyDisplay({
    title,
    location,
    description,
    overview,
    images = [],
    pricePerNight,
    maxGuests,
    facilities = [],
    houseRules,
    legalInfo,
    reviews = [],
    host,
    preview = false,
    sidebar
}: PropertyDisplayProps) {
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const hasMultipleImages = images && images.length > 1;

    const nextImage = () => {
        setCurrentImageIndex((prev) => (prev + 1) % images.length);
    };

    const prevImage = () => {
        setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
    };

    const displayImage = images && images.length > 0 ? images[currentImageIndex] : null;

    return (
        <div className="container mx-auto py-0"> {/* Removed vertical padding for flexibility */}
            <div className="grid grid-cols-1 gap-8"> {/* Adjusted grid for use in different contexts */}
                {/* Main Content */}
                <div>
                    {/* Image Gallery */}
                    <div className="aspect-video bg-muted rounded-lg overflow-hidden mb-6 relative group">
                        {displayImage ? (
                            <img
                                src={displayImage}
                                alt={title}
                                className="w-full h-full object-cover transition-transform duration-500"
                            />
                        ) : (
                            <div className="flex items-center justify-center h-full text-gray-400">No Image Available</div>
                        )}

                        {preview && <div className="absolute top-2 right-2 bg-yellow-400 text-xs px-2 py-1 rounded font-bold z-20">PREVIEW MODE</div>}

                        {/* Carousel Controls */}
                        {hasMultipleImages && (
                            <>
                                <button
                                    onClick={prevImage}
                                    className="absolute left-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/80 hover:bg-white text-slate-800 opacity-0 group-hover:opacity-100 transition-opacity z-10 shadow-sm"
                                >
                                    <ChevronLeft className="w-6 h-6" />
                                </button>
                                <button
                                    onClick={nextImage}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/80 hover:bg-white text-slate-800 opacity-0 group-hover:opacity-100 transition-opacity z-10 shadow-sm"
                                >
                                    <ChevronRight className="w-6 h-6" />
                                </button>

                                {/* Dots */}
                                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
                                    {images.map((_, idx) => (
                                        <button
                                            key={idx}
                                            onClick={() => setCurrentImageIndex(idx)}
                                            className={cn(
                                                "w-2 h-2 rounded-full transition-all shadow-sm",
                                                idx === currentImageIndex
                                                    ? "bg-white scale-125 w-4"
                                                    : "bg-white/50 hover:bg-white/80"
                                            )}
                                        />
                                    ))}
                                </div>
                            </>
                        )}
                    </div>

                    <h1 className="text-3xl font-bold mb-2">{title || "Untitled Property"}</h1>
                    <p className="text-muted-foreground mb-4">{location || "Location not specified"}</p>

                    <div className="prose max-w-none mb-8">
                        <h3 className="text-xl font-semibold mb-2">Overview</h3>
                        <p className="whitespace-pre-wrap text-muted-foreground">{overview || description || "No description available."}</p>
                    </div>

                    {facilities && facilities.length > 0 && (
                        <div className="mb-8">
                            <h3 className="text-xl font-semibold mb-2">Facilities</h3>
                            <ul className="grid grid-cols-2 gap-4">
                                {facilities.map((facility, idx) => {
                                    const FacilityIcon = getFacilityIcon(facility);
                                    return (
                                        <li key={idx} className="flex items-center gap-3 text-sm text-slate-700">
                                            <FacilityIcon className="w-5 h-5 text-slate-500" />
                                            <span>{facility}</span>
                                        </li>
                                    );
                                })}
                            </ul>
                        </div>
                    )}

                    {(houseRules || legalInfo) && (
                        <div className="bg-slate-50 p-6 rounded-lg mb-8">
                            <h3 className="text-xl font-semibold mb-4">Important Info</h3>
                            {houseRules && (
                                <div className="mb-4">
                                    <h4 className="font-medium text-sm text-slate-900">House Rules</h4>
                                    <p className="text-sm text-slate-600">{houseRules}</p>
                                </div>
                            )}
                            {legalInfo && (
                                <div>
                                    <h4 className="font-medium text-sm text-slate-900">Legal Info</h4>
                                    <p className="text-sm text-slate-600">{legalInfo}</p>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Booking Widget / Sidebar */}
                    <div className="mb-8">
                        {sidebar}
                    </div>


                    {/* Reviews Section */}
                    <div>
                        <h3 className="text-xl font-semibold mb-6">Guest Reviews</h3>
                        {reviews && reviews.length > 0 ? (
                            <div className="space-y-6">
                                {reviews.map((review) => (
                                    <div key={review.id} className="border-b pb-6">
                                        <div className="flex items-center gap-2 mb-2">
                                            <div className="h-8 w-8 bg-slate-200 rounded-full flex items-center justify-center overflow-hidden">
                                                {review.user?.image ? (
                                                    // eslint-disable-next-line @next/next/no-img-element
                                                    <img src={review.user.image} alt={review.user.name || "Guest"} />
                                                ) : (
                                                    <span className="text-xs font-bold">{review.user?.name?.[0] || "G"}</span>
                                                )}
                                            </div>
                                            <div>
                                                <p className="text-sm font-medium">{review.user?.name || "Guest"}</p>
                                                <p className="text-xs text-muted-foreground">{new Date(review.createdAt).toLocaleDateString()}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-1 mb-2 text-yellow-500 text-sm">
                                            {"★".repeat(Math.min(5, Math.max(0, Math.round(review.rating))))}
                                            <span className="text-slate-300">{"★".repeat(Math.max(0, 5 - Math.min(5, Math.max(0, Math.round(review.rating)))))}</span>
                                        </div>
                                        <p className="text-slate-600">{review.comment}</p>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-muted-foreground bg-slate-50 p-6 rounded-lg text-center">
                                No reviews yet as this is a preview or new property.
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
