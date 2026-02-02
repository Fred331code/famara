import { Property, Review, User, PropertyImage } from "@prisma/client";

interface StructuredDataProps {
    property: Property & {
        propertyImages: PropertyImage[];
        reviews: (Review & { user: { name: string | null } })[];
        host: { name: string | null };
    };
}

export function StructuredData({ property }: StructuredDataProps) {
    const images = property.propertyImages.length > 0
        ? property.propertyImages.map(img => img.url)
        : property.images;

    const schema = {
        "@context": "https://schema.org",
        "@type": "VacationRental",
        "name": property.title,
        "description": property.overview || property.description,
        "image": images,
        "identifier": property.id,
        "address": {
            "@type": "PostalAddress",
            "addressLocality": property.location,
            "addressCountry": "ES" // Assuming Famara is mostly Lanzarote/Spain based on context, but could be dynamic
        },
        "priceRange": `€${property.pricePerNight} per night`,
        "aggregateRating": property.reviews.length > 0 ? {
            "@type": "AggregateRating",
            "ratingValue": property.reviews.reduce((acc, r) => acc + r.rating, 0) / property.reviews.length,
            "reviewCount": property.reviews.length
        } : undefined,
        "offers": {
            "@type": "Offer",
            "price": property.pricePerNight.toString(),
            "priceCurrency": "EUR",
            "availability": "https://schema.org/InStock"
        },
        "host": {
            "@type": "Person",
            "name": property.host.name
        }
    };

    return (
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
    );
}
