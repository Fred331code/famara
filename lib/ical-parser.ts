// Simple iCal parser to avoid node-ical build issues (BigInt errors)

export async function getIcalEvents(icalUrl: string): Promise<any[]> {
    try {
        const response = await fetch(icalUrl);
        if (!response.ok) {
            throw new Error(`Failed to fetch iCal: ${response.statusText}`);
        }
        const text = await response.text();
        return parseIcal(text);
    } catch (error) {
        console.error("Failed to parse iCal:", error);
        return [];
    }
}

function parseIcal(icalData: string): any[] {
    const events: any[] = [];

    // Unfold lines (lines starting with space are continuations)
    const lines = icalData.replace(/\r\n /g, "").split(/\r\n|\n|\r/);

    let currentEvent: any = null;

    for (const line of lines) {
        if (line.startsWith("BEGIN:VEVENT")) {
            currentEvent = { type: 'VEVENT' };
        } else if (line.startsWith("END:VEVENT")) {
            if (currentEvent) {
                events.push(currentEvent);
                currentEvent = null;
            }
        } else if (currentEvent) {
            // Simple key-value split (handling parameters like ;VALUE=DATE)
            const parts = line.split(":");
            if (parts.length < 2) continue;

            let key = parts[0];
            const value = parts.slice(1).join(":"); // Rejoin rest as value

            // Handle parameters in key (e.g. DTSTART;VALUE=DATE)
            const keyParts = key.split(";");
            const propertyName = keyParts[0];

            if (propertyName === "DTSTART") {
                currentEvent.start = parseIcalDate(value);
            } else if (propertyName === "DTEND") {
                currentEvent.end = parseIcalDate(value);
            } else if (propertyName === "SUMMARY") {
                currentEvent.summary = value;
            } else if (propertyName === "UID") {
                currentEvent.uid = value;
            }
        }
    }

    return events;
}

function parseIcalDate(dateStr: string): Date | undefined {
    if (!dateStr) return undefined;

    // YYYYMMDD
    if (/^\d{8}$/.test(dateStr)) {
        const year = parseInt(dateStr.substring(0, 4));
        const month = parseInt(dateStr.substring(4, 6)) - 1;
        const day = parseInt(dateStr.substring(6, 8));
        return new Date(Date.UTC(year, month, day));
    }

    // YYYYMMDDTHHMMSSZ or YYYYMMDDTHHMMSS
    if (dateStr.includes("T")) {
        // Remove Z if present for simpler parsing (treat as UTC usually)
        // Ideally we handle timezones, but for blocking dates, approximation is often acceptable
        // or effectively treating as local/UTC depending on context
        const cleanStr = dateStr.replace("Z", "");

        const year = parseInt(cleanStr.substring(0, 4));
        const month = parseInt(cleanStr.substring(4, 6)) - 1;
        const day = parseInt(cleanStr.substring(6, 8));
        const hour = parseInt(cleanStr.substring(9, 11));
        const minute = parseInt(cleanStr.substring(11, 13));
        const second = parseInt(cleanStr.substring(13, 15));

        return new Date(Date.UTC(year, month, day, hour, minute, second));
    }

    return undefined;
}

export function isDateBlocked(startDate: Date, endDate: Date, icalEvents: any[]): boolean {
    // Basic overlap check
    // icalEvents usually have start/end as Date objects
    for (const event of icalEvents) {
        if (!event.start || !event.end) continue;

        const eventStart = new Date(event.start);
        const eventEnd = new Date(event.end);

        // Check for overlap: 
        // (StartA <= EndB) and (EndA >= StartB)
        // Note: iCal DTEND is exclusive, so check should be (StartA < EndB) and (EndA > StartB)
        // But for safety/daily granularity, inclusive check is often used.
        // Let's stick to standard strict overlap but ensure Date objects are valid

        if (startDate < eventEnd && endDate > eventStart) {
            return true;
        }
    }
    return false;
}
