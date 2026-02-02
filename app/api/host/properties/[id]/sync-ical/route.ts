import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";

// Helper to parse YYYYMMDD or YYYYMMDDTHHMMSSZ
function parseIcalDate(val: string) {
    if (!val) return null;
    const clean = val.split(";")[0]; // Handle params if missed
    const year = parseInt(clean.substring(0, 4));
    const month = parseInt(clean.substring(4, 6)) - 1;
    const day = parseInt(clean.substring(6, 8));

    // Check for time
    if (clean.includes("T")) {
        const timePart = clean.split("T")[1];
        const hour = parseInt(timePart.substring(0, 2));
        const min = parseInt(timePart.substring(2, 4));
        const sec = parseInt(timePart.substring(4, 6));
        // Assume UTC if Z present, else local (simplified)
        // For booking blocks, dates are usually what matters most.
        return new Date(Date.UTC(year, month, day, hour, min, sec));
    }

    // Date only
    return new Date(year, month, day);
}

export async function POST(
    req: Request,
    { params }: { params: { id: string } }
) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const property = await db.property.findUnique({
            where: { id: params.id },
        });

        if (!property) {
            return NextResponse.json({ error: "Property not found" }, { status: 404 });
        }

        if (property.hostId !== session.user.id) {
            return NextResponse.json({ error: "Forbidden" }, { status: 403 });
        }

        const body = await req.json();
        let { icalUrl } = body;

        // Update URL if provided
        if (icalUrl) {
            // Basic validation
            if (!icalUrl.startsWith("http")) {
                return NextResponse.json({ error: "Invalid URL" }, { status: 400 });
            }
            await db.property.update({
                where: { id: params.id },
                data: { icalUrl }
            });
        } else {
            icalUrl = property.icalUrl;
        }

        if (!icalUrl) {
            return NextResponse.json({ error: "No iCal URL provided" }, { status: 400 });
        }

        // Fetch and Parse iCal manually to handle Headers/CORS better
        const response = await fetch(icalUrl, {
            headers: {
                "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
            }
        });
        if (!response.ok) {
            console.error(`iCal fetch failed: ${response.status} ${response.statusText}`);
            throw new Error(`Failed to fetch iCal: ${response.statusText}`);
        }

        const icsData = await response.text();

        // Manual Parsing
        const events: any[] = [];
        const lines = icsData.split(/\r\n|\n|\r/);

        let inEvent = false;
        let currentEvent: any = {};

        for (const line of lines) {
            if (line.startsWith("BEGIN:VEVENT")) {
                inEvent = true;
                currentEvent = {};
            } else if (line.startsWith("END:VEVENT")) {
                inEvent = false;
                if (currentEvent.start && currentEvent.end) {
                    events.push(currentEvent);
                }
            } else if (inEvent) {
                if (line.startsWith("DTSTART")) {
                    const val = line.split(":")[1];
                    currentEvent.start = parseIcalDate(val);
                } else if (line.startsWith("DTEND")) {
                    const val = line.split(":")[1];
                    currentEvent.end = parseIcalDate(val);
                }
            }
        }

        console.log(`Parsed ${events.length} events manually`);

        let blockedCount = 0;

        for (const event of events) {
            const start = event.start;
            const end = event.end;

            if (!start || !end || isNaN(start.getTime()) || isNaN(end.getTime())) {
                continue;
            }

            if (end < new Date()) continue;

            const existing = await db.booking.findFirst({
                where: {
                    propertyId: params.id,
                    startDate: { lt: end },
                    endDate: { gt: start },
                    OR: [
                        { status: "CONFIRMED" },
                        { status: "BLOCKED" }
                    ]
                }
            });

            if (!existing) {
                await db.booking.create({
                    data: {
                        propertyId: params.id,
                        userId: session.user.id,
                        startDate: start,
                        endDate: end,
                        totalPrice: 0,
                        status: "BLOCKED"
                    }
                });
                blockedCount++;
            }
        }

        return NextResponse.json({ success: true, blocked: blockedCount });

    } catch (error: any) {
        console.error("SYNC_ICAL_ERROR", error);
        console.error("Stack:", error.stack);
        return NextResponse.json({ error: `Sync failed: ${error.message}` }, { status: 500 });
    }
}
