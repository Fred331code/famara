
import { Booking } from "@prisma/client";

export function generateICal(bookings: Booking[], propertyTitle: string): string {
    const events = bookings.map((booking) => {
        // Format dates as YYYYMMDD
        const start = booking.startDate.toISOString().replace(/[-:]/g, "").split("T")[0];
        const end = booking.endDate.toISOString().replace(/[-:]/g, "").split("T")[0];

        // Unique UID (using booking ID)
        const uid = `${booking.id}@hotelinlanzarote.com`;

        return `BEGIN:VEVENT
UID:${uid}
DTSTART;VALUE=DATE:${start}
DTEND;VALUE=DATE:${end}
SUMMARY:Booked - ${propertyTitle}
STATUS:CONFIRMED
END:VEVENT`;
    }).join("\n");

    return `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//Famara Booking//NONSGML v1.0//EN
CALSCALE:GREGORIAN
METHOD:PUBLISH
X-WR-CALNAME:${propertyTitle} (Availability)
${events}
END:VCALENDAR`;
}
