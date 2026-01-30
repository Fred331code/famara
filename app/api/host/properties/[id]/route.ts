
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
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
        const { title, description, location, pricePerNight, maxGuests, images, facilities } = await req.json();

        if (!session || !session.user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        // Verify ownership first
        const existingProperty = await db.property.findUnique({
            where: { id: params.id, hostId: session.user.id }
        });

        if (!existingProperty) {
            return NextResponse.json({ error: "Not found or unauthorized" }, { status: 404 });
        }

        const property = await db.property.update({
            where: {
                id: params.id
            },
            data: {
                title,
                description,
                location,
                pricePerNight,
                maxGuests: maxGuests ? parseInt(maxGuests) : undefined,
                images,
                facilities
            }
        });

        return NextResponse.json(property);
    } catch (error) {
        console.error("[PROPERTY_PATCH]", error);
        return NextResponse.json({ error: "Internal Error" }, { status: 500 });
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
