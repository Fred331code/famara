import Link from "next/link";
import { db } from "@/lib/db";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export const dynamic = 'force-dynamic';

export default async function PropertiesPage() {
    const properties = await db.property.findMany({
        orderBy: {
            createdAt: 'desc'
        },
        include: {
            host: { select: { name: true } }
        }
    });

    return (
        <div className="container mx-auto py-10">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold">Properties</h1>
                <Button asChild>
                    {/* Placeholder for future create page */}
                    <Link href="/properties/new">Add Property</Link>
                </Button>
            </div>

            {properties.length === 0 ? (
                <div className="text-center py-12">
                    <p className="text-muted-foreground">No properties found.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {properties.map((property) => (
                        <Card key={property.id} className="flex flex-col">
                            <div className="relative aspect-video bg-muted w-full overflow-hidden rounded-t-lg">
                                {/* Placeholder Image Logic - using first image or placeholder */}
                                {property.images && property.images.length > 0 ? (
                                    // eslint-disable-next-line @next/next/no-img-element
                                    <img
                                        src={property.images[0]}
                                        alt={property.title}
                                        className="object-cover w-full h-full hover:scale-105 transition-transform"
                                    />
                                ) : (
                                    <div className="flex items-center justify-center h-full bg-gray-200 text-gray-400">
                                        No Image
                                    </div>
                                )}
                            </div>
                            <CardHeader>
                                <div className="flex justify-between items-start">
                                    <CardTitle className="line-clamp-1">{property.title}</CardTitle>
                                    <span className="font-bold text-lg">${Number(property.pricePerNight)}</span>
                                </div>
                                <CardDescription className="line-clamp-1">{property.location}</CardDescription>
                            </CardHeader>
                            <CardContent className="flex-grow">
                                <p className="text-sm text-muted-foreground line-clamp-2">
                                    {property.description}
                                </p>
                                {property.host?.name && (
                                    <p className="text-xs text-muted-foreground mt-2">Hosted by {property.host.name}</p>
                                )}
                            </CardContent>
                            <CardFooter>
                                <Button asChild className="w-full">
                                    <Link href={`/properties/${property.id}`}>View Details</Link>
                                </Button>
                            </CardFooter>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
}
