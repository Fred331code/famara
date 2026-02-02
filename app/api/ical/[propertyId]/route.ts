
import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { generateICal } from "@/lib/ical";

export async function GET(
    request: Request,
    { params }: { params: { propertyId: string } }
) {
    try {
        const { propertyId } = params;

        const property = await db.property.findUnique({
            where: { id: propertyId },
            include: {
                bookings: {
                    where: {
                        status: {
                            in: ["CONFIRMED", "BLOCKED"] // Include blocked dates too
                        }
                    }
                }
            }
        });

        if (!property) {
            return new NextResponse("Property not found", { status: 404 });
        }

        const icalContent = generateICal(property.bookings, property.title);

        return new NextResponse(icalContent, {
            headers: {
                "Content-Type": "text/calendar; charset=utf-8",
                "Content-Disposition": `attachment; filename="calendar-${propertyId}.ics"`,
            },
        });
    } catch (error) {
        console.error("[ICAL_EXPORT]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
