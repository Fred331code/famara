
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

        return NextResponse.json({ success: true, message: "Seeding complete" });
    } catch (error) {
        console.error("Seeding failed:", error);
        return NextResponse.json({ error: "Seeding failed" }, { status: 500 });
    }
}
