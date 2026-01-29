import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { Button } from "@/components/ui/button";

interface PropertyPageProps {
    params: {
        id: string;
    };
}

export const dynamic = 'force-dynamic';

export default async function PropertyPage({ params }: PropertyPageProps) {
    const property = await db.property.findUnique({
        where: { id: params.id },
        include: {
            host: { select: { name: true, email: true, image: true } },
            reviews: {
                include: { user: { select: { name: true, image: true } } },
                orderBy: { createdAt: 'desc' }
            }
        }
    });

    if (!property) {
        notFound();
    }

    return (
        <div className="container mx-auto py-10">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Left Column: Images and Details */}
                <div>
                    {/* Image Gallery Placeholder */}
                    <div className="aspect-video bg-muted rounded-lg overflow-hidden mb-6">
                        {property.images && property.images.length > 0 ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                                src={property.images[0]}
                                alt={property.title}
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            <div className="flex items-center justify-center h-full text-gray-400">No Image Available</div>
                        )}
                    </div>

                    <h1 className="text-3xl font-bold mb-2">{property.title}</h1>
                    <p className="text-muted-foreground mb-4">{property.location}</p>

                    <div className="prose max-w-none mb-8">
                        <h3 className="text-xl font-semibold mb-2">Overview</h3>
                        <p className="whitespace-pre-wrap text-muted-foreground">{property.overview || property.description}</p>
                    </div>

                    {property.facilities && property.facilities.length > 0 && (
                        <div className="mb-8">
                            <h3 className="text-xl font-semibold mb-2">Facilities</h3>
                            <ul className="grid grid-cols-2 gap-2">
                                {property.facilities.map((facility, idx) => (
                                    <li key={idx} className="flex items-center text-sm text-muted-foreground">
                                        • {facility}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}

                    {(property.houseRules || property.legalInfo) && (
                        <div className="bg-slate-50 p-6 rounded-lg">
                            <h3 className="text-xl font-semibold mb-4">Important Info</h3>
                            {property.houseRules && (
                                <div className="mb-4">
                                    <h4 className="font-medium text-sm text-slate-900">House Rules</h4>
                                    <p className="text-sm text-slate-600">{property.houseRules}</p>
                                </div>
                            )}
                            {property.legalInfo && (
                                <div>
                                    <h4 className="font-medium text-sm text-slate-900">Legal Info</h4>
                                    <p className="text-sm text-slate-600">{property.legalInfo}</p>
                                </div>
                            )}
                        </div>
                    )}
                    )}

                    {/* Reviews Section */}
                    <div className="mt-12">
                        <h3 className="text-xl font-semibold mb-6">Guest Reviews</h3>
                        {property.reviews && property.reviews.length > 0 ? (
                            <div className="space-y-6">
                                {property.reviews.map((review) => (
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
                                            {"★".repeat(review.rating)}
                                            <span className="text-slate-300">{"★".repeat(5 - review.rating)}</span>
                                        </div>
                                        <p className="text-slate-600">{review.comment}</p>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-muted-foreground bg-slate-50 p-6 rounded-lg text-center">
                                No reviews yet. Be the first to stay!
                            </div>
                        )}
                    </div>
                </div>

                {/* Right Column: Booking Card */}
                <div>
                    <div className="sticky top-24 border rounded-lg p-6 shadow-sm bg-card">
                        <div className="flex justify-between items-end mb-6">
                            <div>
                                <span className="text-2xl font-bold">${Number(property.pricePerNight)}</span>
                                <span className="text-muted-foreground"> / night</span>
                            </div>
                            <div className="text-right">
                                <p className="text-sm">Max {property.maxGuests} Guests</p>
                            </div>
                        </div>

                        <div className="space-y-4">
                            {/* Placeholder for Date Picker */}
                            <div className="border rounded-md p-3 text-center text-muted-foreground">
                                Select Dates (Coming Soon)
                            </div>
                        </div>

                        <Button size="lg" className="w-full mt-6">
                            Request to Book
                        </Button>

                        <p className="text-xs text-center text-muted-foreground mt-4">
                            You won't be charged yet
                        </p>

                        {property.host && (
                            <div className="mt-8 pt-6 border-t flex items-center gap-4">
                                <div className="h-10 w-10 bg-slate-200 rounded-full flex items-center justify-center">
                                    {property.host.image ? (
                                        // eslint-disable-next-line @next/next/no-img-element
                                        <img src={property.host.image} alt={property.host.name || "Host"} className="rounded-full" />
                                    ) : (
                                        <span className="text-xs font-bold">{property.host.name?.[0] || "H"}</span>
                                    )}
                                </div>
                                <div>
                                    <p className="text-sm font-medium">Hosted by {property.host.name}</p>
                                    <p className="text-xs text-muted-foreground">Joined {new Date().getFullYear()}</p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
