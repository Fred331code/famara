
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";

export async function GET(
    req: Request,
    { params }: { params: { id: string } }
) {
    try {
        const session = await getServerSession(authOptions);

        if (!session || !session.user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const property = await db.property.findUnique({
            where: {
                id: params.id,
                hostId: session.user.id // Ensure ownership
            },
            include: {
                bookings: true,
                propertyImages: true
            }
        });

        if (!property) {
            return NextResponse.json({ error: "Property not found" }, { status: 404 });
        }

        return NextResponse.json(property);
    } catch (error) {
        console.error("[PROPERTY_GET]", error);
        return NextResponse.json({ error: "Internal Error" }, { status: 500 });
    }
}

export async function PATCH(
    req: Request,
    { params }: { params: { id: string } }
) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const body = await req.json();
        const { title, description, location, address, contactEmail, contactPhone, pricePerNight, maxGuests, images, facilities, icalUrl } = body;

        // Verify ownership
        const existingProperty = await db.property.findUnique({
            where: { id: params.id, hostId: session.user.id }
        });

        if (!existingProperty) {
            return NextResponse.json({ error: "Not found or unauthorized" }, { status: 404 });
        }

        // Lazy Migration Transaction
        const updated = await db.$transaction(async (tx) => {
            // 1. Update basic fields & clear legacy column if using new images
            const updateData: any = {
                title,
                description,
                location,
                address,
                contactEmail,
                contactPhone,
                maxGuests: maxGuests ? parseInt(maxGuests) : undefined,
                facilities,
                icalUrl
            };

            if (pricePerNight) updateData.pricePerNight = pricePerNight;

            // If images are provided (array of objects or legacy strings handled by frontend to be objects)
            // We assume frontend sends the FULL list of desired images.

            if (images && Array.isArray(images)) {
                // Check if it's the new format (objects)
                const isNewFormat = images.length > 0 && typeof images[0] === 'object';

                if (isNewFormat || images.length === 0) {
                    // Clear legacy column
                    updateData.images = [];

                    // Replace PropertyImages
                    await tx.propertyImage.deleteMany({
                        where: { propertyId: params.id }
                    });

                    if (images.length > 0) {
                        await tx.propertyImage.createMany({
                            data: images.map((img: any) => ({
                                propertyId: params.id,
                                url: img.url,
                                caption: img.caption || ""
                            }))
                        });
                    }
                }
            }

            return await tx.property.update({
                where: { id: params.id },
                data: updateData
            });
        });

        return NextResponse.json(updated);
    } catch (error) {
        console.error("[PROPERTY_PATCH]", error);
        return NextResponse.json({ error: `Internal Error: ${(error as Error).message}` }, { status: 500 });
    }
}

export async function DELETE(
    req: Request,
    { params }: { params: { id: string } }
) {
    try {
        const session = await getServerSession(authOptions);

        if (!session || !session.user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        // Verify ownership and delete
        const property = await db.property.deleteMany({
            where: {
                id: params.id,
                hostId: session.user.id
            }
        });

        if (property.count === 0) {
            return NextResponse.json({ error: "Not found or unauthorized" }, { status: 404 });
        }

        return NextResponse.json({ message: "Property deleted" });
    } catch (error) {
        console.error("[PROPERTY_DELETE]", error);
        return NextResponse.json({ error: "Internal Error" }, { status: 500 });
    }
}
