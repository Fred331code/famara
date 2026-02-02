require('dotenv').config();
const { Pool } = require('pg');
const { PrismaPg } = require('@prisma/adapter-pg');
const { PrismaClient } = require('@prisma/client');

async function main() {
    const connectionString = process.env.DATABASE_URL;
    if (!connectionString) {
        console.error("DATABASE_URL not found");
        return;
    }

    const pool = new Pool({ connectionString });
    const adapter = new PrismaPg(pool);
    const db = new PrismaClient({ adapter });

    // 1. Get the first property
    const property = await db.property.findFirst();
    if (!property) {
        console.log("No properties found.");
        return;
    }

    console.log(`Updating property: ${property.title} (${property.id})`);
    const basePrice = Number(property.pricePerNight);
    console.log(`Base Price: ${basePrice}`);

    // 2. Set dynamic pricing: 1 guest = 50% discount (just for testing visibility)
    const guestPrice = {
        "1": basePrice * 0.5,
        "2": basePrice * 0.8
    };

    await db.property.update({
        where: { id: property.id },
        data: { guestPrice }
    });

    console.log("Updated guestPrice:", guestPrice);

    // 3. Verify fetch
    const updated = await db.property.findUnique({
        where: { id: property.id }
    });

    console.log("Fetched guestPrice from DB:", updated.guestPrice);
}

main()
    .catch(e => console.error(e))
    .finally(() => process.exit());
