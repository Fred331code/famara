
import 'dotenv/config';
import { db } from '../lib/db';

async function main() {
    console.log("Checking properties...");
    const properties = await db.property.findMany();
    for (const p of properties) {
        console.log(`Property: ${p.title} (ID: ${p.id})`);
        console.log(` - iCal URL: ${p.icalUrl}`);
        console.log(` - Price: ${p.pricePerNight}`);
    }
}

main()
    .finally(async () => {
        // Shared instance doesn't strictly need disconnect for scripts but good practice if we were creating it.
        // For shared db from lib, we might not want to disconnect if it interferes with other things, but here it is fine.
        // actually lib/db doesn't export a disconnect.
    });
