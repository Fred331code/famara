import Link from "next/link";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Star, MapPin } from "lucide-react";

interface PropertyCardProps {
    id: string;
    title: string;
    location: string;
    price: number;
    rating: number;
    imageUrl: string;
}

export function PropertyCard({ id, title, location, price, rating, imageUrl }: PropertyCardProps) {
    return (
        <Card className="overflow-hidden group cursor-pointer border-0 shadow-md hover:shadow-xl transition-all duration-300">
            {/* Image Container */}
            <div className="relative aspect-[4/3] overflow-hidden">
                <img
                    src={imageUrl}
                    alt={title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-md flex items-center gap-1 shadow-sm">
                    <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                    <span className="text-xs font-bold text-slate-900">{rating}</span>
                </div>
            </div>

            <CardContent className="p-4">
                <h3 className="font-bold text-lg text-slate-900 line-clamp-1 group-hover:text-blue-600 transition-colors">
                    {title}
                </h3>
                <div className="flex items-center text-slate-500 mt-1 mb-3">
                    <MapPin className="w-3 h-3 mr-1" />
                    <span className="text-xs">{location}</span>
                </div>
                <div className="flex items-baseline gap-1">
                    <span className="text-lg font-bold text-blue-900">€{price}</span>
                    <span className="text-sm text-slate-500">/ night</span>
                </div>
            </CardContent>

            <CardFooter className="p-4 pt-0">
                <Button className="w-full bg-slate-900 group-hover:bg-blue-600 transition-colors" asChild>
                    <Link href={`/properties/${id}`}>
                        View Details
                    </Link>
                </Button>
            </CardFooter>
        </Card>
    );
}
