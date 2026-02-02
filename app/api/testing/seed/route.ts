
import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import bcrypt from "bcryptjs";

export async function GET() {
    try {
        console.log("Seeding VolcanoKite via API...");

        // 1. Create User
        const email = 'info@volcanokite.com';
        // Check if user exists first to be safe
        const existingUser = await db.user.findUnique({ where: { email } });

        let user;
        const password = await bcrypt.hash('Password123!', 10);

        if (!existingUser) {
            user = await db.user.create({
                data: {
                    email,
                    name: 'VolcanoKite',
                    password,
                    role: 'HOST',
                    isVerified: true,
                    emailVerified: new Date(),
                    image: "https://cf.bstatic.com/xdata/images/hotel/max500/505615941.jpg?k=05b556328f9371d065ac422d75cea6ade9a4203cc3d7ab44b335b41f8d6a7b15&o="
                }
            });
            console.log("User created");
        } else {
            user = await db.user.update({
                where: { email },
                data: {
                    password, // Update password just in case
                    isVerified: true
                }
            });
            console.log("User updated");
        }

        // 2. Create Property
        const propertyTitle = "VolcanoKite Apartments";
        let property = await db.property.findFirst({
            where: { hostId: user.id, title: propertyTitle }
        });

        if (!property) {
            property = await db.property.create({
                data: {
                    title: propertyTitle,
                    location: "Famara, Spain",
                    address: "7 Calle Mar de Leva, 35558 Famara, Spain",
                    pricePerNight: 90,
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
                    icalUrl: ""
                }
            });

            console.log("Property created");
        }

        // --- NEW: Create Brisa Home Property ---
        const brisaTitle = "VolcanoKite Brisa Home";
        let brisaProperty = await db.property.findFirst({
            where: { hostId: user.id, title: brisaTitle }
        });

        if (!brisaProperty) {
            brisaProperty = await db.property.create({
                data: {
                    title: brisaTitle,
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
            console.log("Brisa Home Property created");
        }
        // ----------------------------------------


        return NextResponse.json({ success: true, message: "Seeding complete" });
    } catch (error) {
        console.error("Seeding failed:", error);
        return NextResponse.json({ error: "Seeding failed" }, { status: 500 });
    }
}
