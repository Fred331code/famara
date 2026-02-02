import { NextResponse } from "next/server";
import { db } from "@/lib/db";

// GET /api/properties
// Fetch all properties
export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const startDateParam = searchParams.get("from");
        const endDateParam = searchParams.get("to");

        let dateFilter: any = {};

        if (startDateParam && endDateParam) {
            const start = new Date(startDateParam);
            const end = new Date(endDateParam);

            // Simple validation
            if (!isNaN(start.getTime()) && !isNaN(end.getTime())) {
                dateFilter = {
                    bookings: {
                        none: {
                            status: "CONFIRMED",
                            OR: [
                                { startDate: { lte: end.toISOString() }, endDate: { gte: start.toISOString() } }, // Overlaps
                            ]
                        }
                    }
                };
            }
        }

        const properties = await db.property.findMany({
            where: {
                ...dateFilter
            },
            include: {
                host: {
                    select: {
                        name: true,
                        image: true
                    }
                }
            },
            orderBy: {
                createdAt: 'desc'
            }
        });

        // Strip private fields
        const safeProperties = properties.map(p => {
            const { address, contactEmail, contactPhone, ...safe } = p;
            return safe;
        });

        return NextResponse.json(safeProperties);
    } catch (error) {
        console.error("[PROPERTIES_GET]", error);
        return NextResponse.json({ error: "Internal Error" }, { status: 500 });
    }
}

// POST /api/properties
// Create a new property
export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { title, description, location, pricePerNight, hostId } = body;

        // Basic validation
        if (!title || !description || !location || !pricePerNight) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        // For now, if no hostId is provided, we find or create a default host
        // This allows testing without full auth integration
        let finalHostId = hostId;
        if (!finalHostId) {
            const defaultHost = await db.user.upsert({
                where: { email: "host@famara.com" },
                update: {},
                create: {
                    email: "host@famara.com",
                    name: "Default Host",
                    role: "HOST"
                }
            });
            finalHostId = defaultHost.id;
        }

        const property = await db.property.create({
            data: {
                title,
                description,
                location,
                pricePerNight,
                hostId: finalHostId,
                images: body.images || []
            }
        });

        return NextResponse.json(property);
    } catch (error) {
        console.error("[PROPERTIES_POST]", error);
        return NextResponse.json({ error: "Internal Error" }, { status: 500 });
    }
}
