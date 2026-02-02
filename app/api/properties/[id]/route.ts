import { NextResponse } from "next/server";
import { db } from "@/lib/db";

interface IParams {
    params: {
        id: string;
    };
}

// GET /api/properties/[id]
export async function GET(req: Request, { params }: IParams) {
    try {
        const { id } = params;

        const property = await db.property.findUnique({
            where: { id },
            include: {
                host: {
                    select: {
                        name: true,
                        image: true,
                        // email: true // Hid email for privacy
                    }
                },
                // propertyImages: true, // Uncomment if needed
                bookings: { // Only needed for availability, but could leak booking info? 
                    // Bookings are public for calendar availability usually (dates only).
                    select: { startDate: true, endDate: true, status: true }
                }
            }
        });

        if (!property) {
            return NextResponse.json({ error: "Property not found" }, { status: 404 });
        }

        // Strip private fields
        const { address, contactEmail, contactPhone, ...publicProperty } = property;

        return NextResponse.json(publicProperty);
    } catch (error) {
        console.error(`[PROPERTY_GET_${params.id}]`, error);
        return NextResponse.json({ error: "Internal Error" }, { status: 500 });
    }
}

// DELETE /api/properties/[id]
export async function DELETE(req: Request, { params }: IParams) {
    try {
        const { id } = params;

        const property = await db.property.delete({
            where: { id }
        });

        return NextResponse.json(property);
    } catch (error) {
        console.error(`[PROPERTY_DELETE_${params.id}]`, error);
        return NextResponse.json({ error: "Internal Error" }, { status: 500 });
    }
}

// PATCH /api/properties/[id]
export async function PATCH(req: Request, { params }: IParams) {
    try {
        const { id } = params;
        const body = await req.json();

        const property = await db.property.update({
            where: { id },
            data: {
                ...body
            }
        });

        return NextResponse.json(property);
    } catch (error) {
        console.error(`[PROPERTY_PATCH_${params.id}]`, error);
        return NextResponse.json({ error: "Internal Error" }, { status: 500 });
    }
}
