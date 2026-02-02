
import 'dotenv/config';
import { db } from '../lib/db';
import bcrypt from 'bcryptjs';

async function main() {
    console.log("Seeding VolcanoKite...");

    // 1. Create User
    const email = 'info@volcanokite.com';
    const password = await bcrypt.hash('Password123!', 10);

    const user = await db.user.upsert({
        where: { email },
        update: {},
        create: {
            email,
            name: 'VolcanoKite',
            password,
            role: 'HOST',
            isVerified: true,
            emailVerified: new Date(),
            image: "https://cf.bstatic.com/xdata/images/hotel/max500/505615941.jpg?k=05b556328f9371d065ac422d75cea6ade9a4203cc3d7ab44b335b41f8d6a7b15&o="
        },
    });
    console.log(`User created/found: ${user.email} (${user.id})`);

    // 2. Create Property
    const propertyTitle = "VolcanoKite Apartments";
    const property = await db.property.create({
        data: {
            title: propertyTitle,
            location: "Famara, Spain",
            address: "7 Calle Mar de Leva, 35558 Famara, Spain",
            pricePerNight: 90, // Estimated price
            maxGuests: 2,
            description: "VolcanoKite Apartments in Caleta de Famara offers comfortable accommodations with a terrace and free WiFi. The units feature a private entrance and a quiet street view. The apartment includes a washing machine, a fully equipped kitchen with a coffee machine, microwave, refrigerator, and dining area. The living space is equipped with a big sofa and a flat-screen TV. Outside, there is a cozy terrace facing west, perfect for enjoying sunsets. The property is managed by VolcanoKite, a local kite surf and wing foil school.",
            overview: "Excellent location – rated 9.7/10! Just a 9-minute walk from Famara Beach.",
            hostId: user.id,
            facilities: [
                "Wifi",
                "Kitchen",
                "Washing machine",
                "Terrace",
                "Beach nearby",
                "TV",
                "Private entrance",
                "Coffee machine",
                "Microwave",
                "Outdoor furniture"
            ],
            images: [
                "https://cf.bstatic.com/xdata/images/hotel/max1024x768/505603621.jpg?k=3cfa5b82f395554a8414f6a05e45ed1791b1e0085cedb61b6041fa0a72bf3400&o=",
                "https://cf.bstatic.com/xdata/images/hotel/max500/505615941.jpg?k=05b556328f9371d065ac422d75cea6ade9a4203cc3d7ab44b335b41f8d6a7b15&o=",
                "https://cf.bstatic.com/xdata/images/hotel/max500/505615934.jpg?k=bead212c80985069e6b9be93732071e2392a7179798ed60e3032412617533d19&o=",
                "https://cf.bstatic.com/xdata/images/hotel/max300/505615930.jpg?k=249399119b7b2b93881c48eae445095cbc41f06c4d050d258917a350bfa83807&o=",
                "https://cf.bstatic.com/xdata/images/hotel/max300/505615932.jpg?k=457d23e34068517300c5ab93efede67df62263b1371fd2efcb2a5eaa32e091be&o="
            ],
            icalUrl: "" // None for now
        }
    });
    console.log(`Property created: ${property.title} (${property.id})`);

    // 3. Create Reviews
    const reviews = [
        {
            guest: "Jaroslaw",
            rating: 9, // 8.7 rounded
            text: "Quiet and it has all you need. It was perfect for solo holidays."
        },
        {
            guest: "Ana",
            rating: 9,
            text: "Amazing location, a few minutes to the beach, shops and restaurants, yet very quiet and peaceful. The apartment is nice, clean and comfortable, good value for money."
        },
        {
            guest: "Ashley",
            rating: 9,
            text: "Great and super friendly hosts and good location, bed is comfortable everything works well and apartment was super clean."
        },
        {
            guest: "Sarah",
            rating: 9,
            text: "This is an ideal place for a solo traveller or a couple. It is within short walking distance of Famara Beach, town and great hikes along the coastal path."
        }
    ];

    // Create a dummy guest user for reviews if not exists (or reuse one)
    const guestEmail = 'guest@example.com';
    const guestUser = await db.user.upsert({
        where: { email: guestEmail },
        update: {},
        create: {
            email: guestEmail,
            name: "Verified Guest",
            password: await bcrypt.hash('password', 10),
            role: "GUEST"
        }
    });

    for (const r of reviews) {
        await db.review.create({
            data: {
                propertyId: property.id,
                userId: guestUser.id,
                rating: r.rating,
                comment: `${r.text} - ${r.guest}` // Append name since we reuse one user
            }
        });
    }
    console.log(`Created ${reviews.length} reviews`);
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        // Shared db instance usually doesn't need explicit disconnect in scripts if managed by lib, 
        // but if we were using a standalone client we would. 
        // For correctness with the shared pattern we can omit explicit disconnect or handle it if lib exports it.
    });
