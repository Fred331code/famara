import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { Button } from "@/components/ui/button";
import { PropertyDisplay } from "@/components/property/property-display";
import { BookingWidget } from "@/components/booking-widget";
import { StructuredData } from "@/components/structured-data";

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
            propertyImages: true,
            reviews: {
                include: { user: { select: { name: true, image: true } } },
                orderBy: { createdAt: 'desc' }
            }
        }
    });

    if (!property) {
        notFound();
    }

    // Combine images: New System (PropertyImages) -> Legacy (images array)
    // We Map propertyImages objects to simple URL strings as expected by PropertyDisplay
    const displayImages = property.propertyImages.map(pi => pi.url);
    if (displayImages.length === 0 && property.images && property.images.length > 0) {
        displayImages.push(...property.images);
    }

    return (
        <div className="min-h-screen bg-slate-50 pb-10">
            <StructuredData property={property} />
            <div className="container mx-auto px-4 py-8">
                <PropertyDisplay
                    title={property.title}
                    location={property.location}
                    description={property.description}
                    overview={property.overview}
                    images={displayImages}
                    pricePerNight={Number(property.pricePerNight)}
                    maxGuests={property.maxGuests}
                    facilities={property.facilities}
                    houseRules={property.houseRules}
                    legalInfo={property.legalInfo}
                    reviews={property.reviews}
                    host={property.host}
                    sidebar={
                        <BookingWidget
                            propertyId={property.id}
                            pricePerNight={Number(property.pricePerNight)}
                            maxGuests={property.maxGuests}
                            guestPrice={property.guestPrice as Record<string, number> | null}
                        />
                    }
                />
            </div>
        </div>
    );
}
