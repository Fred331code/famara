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
                        email: true
                    }
                },
                bookings: true // Include bookings if needed for availability check
            }
        });

        if (!property) {
            return NextResponse.json({ error: "Property not found" }, { status: 404 });
        }

        return NextResponse.json(property);
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
