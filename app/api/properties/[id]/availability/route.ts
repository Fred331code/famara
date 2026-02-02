
import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(
    req: Request,
    { params }: { params: { id: string } }
) {
    try {
        const bookings = await db.booking.findMany({
            where: {
                propertyId: params.id,
                status: {
                    in: ["CONFIRMED", "BLOCKED"] // Only confirmed bookings and host blocks
                },
                endDate: {
                    gte: new Date() // Only future/current bookings
                }
            },
            select: {
                startDate: true,
                endDate: true,
                status: true
            }
        });

        return NextResponse.json(bookings);
    } catch (error) {
        console.error("AVAILABILITY_GET_ERROR", error);
        return NextResponse.json({ error: "Internal Error" }, { status: 500 });
    }
}
