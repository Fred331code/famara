
import 'dotenv/config';
import { db } from '../lib/db';

async function main() {
    console.log("Seeding VolcanoKite Brisa Home...");

    // 1. Find the existing Host User
    const email = 'info@volcanokite.com';
    const user = await db.user.findUnique({
        where: { email }
    });

    if (!user) {
        console.error("Host user not found. Please run seed-volcanokite.ts first.");
        return;
    }
    console.log(`Host found: ${user.email} (${user.id})`);

    // 2. Create Property: VolcanoKite Brisa Home
    const propertyTitle = "VolcanoKite Brisa Home";

    // Check if property already exists to avoid duplicates
    const existingProperty = await db.property.findFirst({
        where: { title: propertyTitle, hostId: user.id }
    });

    let property;
    if (existingProperty) {
        console.log("Property already exists, updating...");
        property = await db.property.update({
            where: { id: existingProperty.id },
            data: {
                location: "Famara, Spain",
                address: "14B Calle Brisa, 35558 Famara, Spain",
                pricePerNight: 120, // Estimated price for a 3-bedroom home
                maxGuests: 6, // 3 bedrooms
                description: "VolcanoKite Briza Home in Caleta de Famara offers a spacious holiday home with three bedrooms and two bathrooms. The property features a sun terrace and free WiFi, ensuring a comfortable stay. Guests can enjoy a lounge, indoor play area, outdoor seating area, and family rooms. The home includes a fully equipped kitchen, washing machine, and TV, catering to all needs. Located 14 mi from Lanzarote Airport, the property is an 8-minute walk from Famara Beach. Nearby attractions include Campesino Monument and Lagomar Museum, each 9.3 mi away.",
                overview: "Wonderful stay! Rated 9.4/10. Spacious 3-bedroom home with sun terrace.",
                facilities: [
                    "Beachfront",
                    "Wifi",
                    "Terrace",
                    "Washing machine",
                    "Kitchen",
                    "Coffee machine",
                    "Family rooms",
                    "TV",
                    "Outdoor furniture",
                    "Key access"
                ],
                images: [
                    "https://cf.bstatic.com/xdata/images/hotel/max1024x768/527075704.jpg?k=1e119d8b067940fed84d170dc356c1f7432a82fa4e15145b84ef253e94d0d988&o=",
                    "https://cf.bstatic.com/xdata/images/hotel/max500/527080760.jpg?k=efc5c599e9a1ef6a24e0034a085c26e28092d718f136b921784ff438d81ad436&o=",
                    "https://cf.bstatic.com/xdata/images/hotel/max500/527075981.jpg?k=4ecab9a5b28b4573e532eee0ec428af36504de45e7617747a3f7df443f4c6a80&o=",
                    "https://cf.bstatic.com/xdata/images/hotel/max300/527076002.jpg?k=68a740e4b3f797a86d9711e73fbb7dbfa4dea8fdcfb10d9cbd89d849afbdd1a0&o=",
                    "https://cf.bstatic.com/xdata/images/hotel/max300/527397425.jpg?k=482787da505bd3f93baab95adca5bf3e7b910a26fb128c36d446669e376c391b&o="
                ],
                icalUrl: ""
            }
        });
    } else {
        property = await db.property.create({
            data: {
                title: propertyTitle,
                location: "Famara, Spain",
                address: "14B Calle Brisa, 35558 Famara, Spain",
                pricePerNight: 120,
                maxGuests: 6,
                description: "VolcanoKite Briza Home in Caleta de Famara offers a spacious holiday home with three bedrooms and two bathrooms. The property features a sun terrace and free WiFi, ensuring a comfortable stay. Guests can enjoy a lounge, indoor play area, outdoor seating area, and family rooms. The home includes a fully equipped kitchen, washing machine, and TV, catering to all needs. Located 14 mi from Lanzarote Airport, the property is an 8-minute walk from Famara Beach. Nearby attractions include Campesino Monument and Lagomar Museum, each 9.3 mi away.",
                overview: "Wonderful stay! Rated 9.4/10. Spacious 3-bedroom home with sun terrace.",
                hostId: user.id,
                facilities: [
                    "Beachfront",
                    "Wifi",
                    "Terrace",
                    "Washing machine",
                    "Kitchen",
                    "Coffee machine",
                    "Family rooms",
                    "TV",
                    "Outdoor furniture",
                    "Key access"
                ],
                images: [
                    "https://cf.bstatic.com/xdata/images/hotel/max1024x768/527075704.jpg?k=1e119d8b067940fed84d170dc356c1f7432a82fa4e15145b84ef253e94d0d988&o=",
                    "https://cf.bstatic.com/xdata/images/hotel/max500/527080760.jpg?k=efc5c599e9a1ef6a24e0034a085c26e28092d718f136b921784ff438d81ad436&o=",
                    "https://cf.bstatic.com/xdata/images/hotel/max500/527075981.jpg?k=4ecab9a5b28b4573e532eee0ec428af36504de45e7617747a3f7df443f4c6a80&o=",
                    "https://cf.bstatic.com/xdata/images/hotel/max300/527076002.jpg?k=68a740e4b3f797a86d9711e73fbb7dbfa4dea8fdcfb10d9cbd89d849afbdd1a0&o=",
                    "https://cf.bstatic.com/xdata/images/hotel/max300/527397425.jpg?k=482787da505bd3f93baab95adca5bf3e7b910a26fb128c36d446669e376c391b&o="
                ],
                icalUrl: ""
            }
        });
    }
    console.log(`Property created/updated: ${property.title} (${property.id})`);

    // 3. Create Reviews
    const reviews = [
        {
            guest: "Jonathan",
            rating: 10,
            text: "Amazing location, property and host. Location is perfect. You can enjoy your morning coffee at the seashore 30 seconds away. Property is very spacious with everything you need to cook, plenty of towels and comfortable bedding."
        },
        {
            guest: "Moritz",
            rating: 10,
            text: "perfect stay for surfing. has everything you need, nice location, parking right in front of the apartment, 5mins walk to famara beach, clean, enough room and Javier is a super nice host and cool guy!"
        },
        {
            guest: "Teva",
            rating: 10,
            text: "Super appartement! très propre et fonctionnel, avec tout le nécessaire (2 salles de bain/ machine à laver/ cuisine complète/ frigo qui fais des glaçons!). La terrasse sur le toit offre une très belle vue sur les montagnes et un aperçu sur l’océan."
        },
        {
            guest: "Lenka",
            rating: 10,
            text: "Exceptional"
        }
    ];

    // Reuse guest user
    const guestEmail = 'guest@example.com';
    const guestUser = await db.user.findUnique({ where: { email: guestEmail } });

    if (guestUser) {
        for (const r of reviews) {
            // Check if similar review exists to avoid dupes on re-run
            const existingReview = await db.review.findFirst({
                where: {
                    propertyId: property.id,
                    userId: guestUser.id,
                    comment: { contains: r.text.substring(0, 20) }
                }
            });

            if (!existingReview) {
                // Scale rating: Booking.com is 1-10, our internal UI expects clamping but maybe we should store normalized?
                // For now, I'll store as is since I added clamping in UI. 
                // Wait, 10 might look weird if clamped to 5. 
                // Let's store it as 5 scale for now to be safe? 
                // Actually the user fix clamped it visualy. So 10 becomes 5 stars. That works.

                await db.review.create({
                    data: {
                        propertyId: property.id,
                        userId: guestUser.id,
                        rating: Math.round(r.rating / 2), // Let's normalize to 5-star scale for DB consistency mostly
                        comment: `${r.text} - ${r.guest}`
                    }
                });
            }
        }
        console.log(`Added reviews for ${property.title}`);
    } else {
        console.log("Guest user not found, skipping reviews.");
    }

}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(() => {
        // leaving connection open as it is shared
    });
