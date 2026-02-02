
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);

        if (!session || !session.user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const body = await req.json();
        const { propertyId, startDate, endDate, totalPrice } = body;

        if (!propertyId || !startDate || !endDate || !totalPrice) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        const start = new Date(startDate);
        const end = new Date(endDate);

        if (start >= end) {
            return NextResponse.json({ error: "End date must be after start date" }, { status: 400 });
        }

        // Check availability
        // Find any booking for this property that overlaps with the requested range
        // Existing Start < Requested End  AND  Existing End > Requested Start
        const conflictingBooking = await db.booking.findFirst({
            where: {
                propertyId,
                OR: [
                    {
                        startDate: { lt: end },
                        endDate: { gt: start }
                    }
                ],
                NOT: {
                    status: "CANCELLED" // Ignore cancelled bookings
                }
            }
        });

        if (conflictingBooking) {
            return NextResponse.json({ error: "Dates are already booked" }, { status: 409 });
        }

        const booking = await db.booking.create({
            data: {
                propertyId,
                userId: session.user.id,
                startDate: start,
                endDate: end,
                totalPrice,
                status: "PENDING" // Require Host Approval
            }
        });

        return NextResponse.json(booking);
    } catch (error) {
        console.error("[BOOKING_POST]", error);
        return NextResponse.json({ error: "Internal Error" }, { status: 500 });
    }
}
