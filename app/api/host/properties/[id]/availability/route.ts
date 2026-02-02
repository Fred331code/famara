
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";

export async function POST(
    req: Request,
    { params }: { params: { id: string } }
) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { startDate, endDate } = await req.json();

        if (!startDate || !endDate) {
            return NextResponse.json({ error: "Dates required" }, { status: 400 });
        }

        // Verify ownership
        const property = await db.property.findUnique({
            where: { id: params.id, hostId: session.user.id }
        });

        if (!property) {
            return NextResponse.json({ error: "Property not found" }, { status: 404 });
        }

        // Check availability
        const overlap = await db.booking.findFirst({
            where: {
                propertyId: params.id,
                startDate: { lt: new Date(endDate) },
                endDate: { gt: new Date(startDate) },
                NOT: { status: "CANCELLED" }
            }
        });

        if (overlap) {
            return NextResponse.json({ error: "Dates already booked/blocked" }, { status: 409 });
        }

        // Create Block
        const block = await db.booking.create({
            data: {
                propertyId: params.id,
                userId: session.user.id,
                startDate: new Date(startDate),
                endDate: new Date(endDate),
                totalPrice: 0,
                status: "BLOCKED"
            }
        });

        return NextResponse.json(block);

    } catch (error) {
        console.error("BLOCK_DATE_ERROR", error);
        return NextResponse.json({ error: "Internal Error" }, { status: 500 });
    }
}

export async function DELETE(
    req: Request,
    { params }: { params: { id: string } }
) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { searchParams } = new URL(req.url);
        const bookingId = searchParams.get("bookingId");

        if (!bookingId) {
            return NextResponse.json({ error: "Booking ID required" }, { status: 400 });
        }

        // Verify ownership of the BLOCK (it should be the host's "booking")
        // OR the host owns the property. Correct logic: Host owns property.

        const booking = await db.booking.findUnique({
            where: { id: bookingId },
            include: { property: true }
        });

        if (!booking) {
            return NextResponse.json({ error: "Booking not found" }, { status: 404 });
        }

        if (booking.property.hostId !== session.user.id) {
            return NextResponse.json({ error: "Forbidden" }, { status: 403 });
        }

        if (booking.status !== "BLOCKED") {
            // Maybe allow cancelling confirmed bookings too?
            // For now, let's stick to "Unblocking" logic which is deleting a block.
            // If it's a confirmed booking, maybe we should use PATCH status=CANCELLED logic.
            // But for this simplified endpoint, let's just allow deleting BLOCKED records.
            return NextResponse.json({ error: "Can only remove blocks here" }, { status: 400 });
        }

        await db.booking.delete({
            where: { id: bookingId }
        });

        return NextResponse.json({ success: true });

    } catch (error) {
        console.error("UNBLOCK_DATE_ERROR", error);
        return NextResponse.json({ error: "Internal Error" }, { status: 500 });
    }
}
