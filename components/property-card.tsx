"use client";

import { useState } from "react";
import Link from "next/link";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Star, MapPin, ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface PropertyCardProps {
    id: string;
    title: string;
    location: string;
    price: number;
    rating: number;
    images: string[];
}

export function PropertyCard({ id, title, location, price, rating, images = [] }: PropertyCardProps) {
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    const hasMultipleImages = images.length > 1;

    const nextImage = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setCurrentImageIndex((prev) => (prev + 1) % images.length);
    };

    const prevImage = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
    };

    return (
        <Card className="relative overflow-hidden group cursor-pointer border border-slate-100 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-500 hover:-translate-y-1">
            {/* Main Card Link - Overlay */}
            <Link href={`/properties/${id}`} className="absolute inset-0 z-0">
                <span className="sr-only">View {title}</span>
            </Link>

            {/* Image Container */}
            <div className="relative aspect-[4/3] overflow-hidden bg-slate-100 z-10 pointer-events-none">
                <img
                    src={images[currentImageIndex] || "/placeholder.jpg"}
                    alt={title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />

                {/* Rating Badge */}
                <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-md px-3 py-1 rounded-full flex items-center gap-1.5 shadow-sm border border-slate-100/50 z-10">
                    <Star className="w-3.5 h-3.5 text-yellow-500 fill-yellow-500" />
                    <span className="text-xs font-bold text-slate-900">{rating}</span>
                </div>

                {/* Carousel Controls - Pointer events allowed */}
                {hasMultipleImages && (
                    <div className="pointer-events-auto">
                        <button
                            onClick={prevImage}
                            className="absolute left-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/90 hover:bg-white text-slate-800 opacity-0 group-hover:opacity-100 transition-opacity z-20 shadow-sm backdrop-blur-sm"
                        >
                            <ChevronLeft className="w-4 h-4" />
                        </button>
                        <button
                            onClick={nextImage}
                            className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/90 hover:bg-white text-slate-800 opacity-0 group-hover:opacity-100 transition-opacity z-20 shadow-sm backdrop-blur-sm"
                        >
                            <ChevronRight className="w-4 h-4" />
                        </button>

                        {/* Dots */}
                        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5 z-20">
                            {images.slice(0, 5).map((_, idx) => (
                                <button
                                    key={idx}
                                    onClick={(e) => {
                                        e.preventDefault();
                                        setCurrentImageIndex(idx);
                                    }}
                                    className={cn(
                                        "w-1.5 h-1.5 rounded-full transition-all shadow-sm",
                                        idx === currentImageIndex
                                            ? "bg-white scale-125 w-2 h-2"
                                            : "bg-white/60 hover:bg-white/80"
                                    )}
                                />
                            ))}
                        </div>
                    </div>
                )}
            </div>

            <CardContent className="p-6 relative z-10 pointer-events-none flex flex-col gap-2">
                <div className="flex items-center text-slate-500 mb-1">
                    <MapPin className="w-3.5 h-3.5 mr-1.5 text-blue-500" />
                    <span className="text-xs font-medium uppercase tracking-wide">{location}</span>
                </div>
                <h3 className="font-bold text-xl text-slate-900 line-clamp-1 group-hover:text-blue-600 transition-colors">
                    {title}
                </h3>
                <div className="flex items-baseline gap-1 mt-2">
                    <span className="text-2xl font-bold text-slate-900">€{price}</span>
                    <span className="text-sm text-slate-500 font-medium">/ night</span>
                </div>
            </CardContent>

            <CardFooter className="p-6 pt-0 relative z-10 pointer-events-none">
                <div className="w-full bg-slate-50 text-slate-900 group-hover:bg-slate-900 group-hover:text-white h-12 px-6 py-3 inline-flex items-center justify-between whitespace-nowrap rounded-xl text-sm font-bold transition-all duration-300">
                    View Property
                    <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all" />
                </div>
            </CardFooter>
        </Card>
    );
}
