
import 'dotenv/config';
import { db } from '../lib/db';

async function main() {
    console.log("Verifying property deletion...");

    // 1. Find a host
    const host = await db.user.findFirst({ where: { role: 'HOST' } });
    if (!host) throw new Error("No host found");

    // 2. Create a dummy property
    const property = await db.property.create({
        data: {
            title: "Test Delete Property",
            location: "Test Location",
            address: "Test Address",
            pricePerNight: 100,
            hostId: host.id,
            description: "To be deleted",
        }
    });
    console.log(`Created property: ${property.id}`);

    // 3. Create a dependency (Review)
    const review = await db.review.create({
        data: {
            propertyId: property.id,
            userId: host.id, // Host reviewing own property just for foreign key test
            rating: 5,
            comment: "Test review"
        }
    });
    console.log(`Created review: ${review.id}`);

    // 4. Try to delete the property
    try {
        await db.property.delete({
            where: { id: property.id }
        });
        console.log("Successfully deleted property!");
    } catch (e) {
        console.error("Failed to delete property:", e);
        process.exit(1);
    }
}

main()
    .catch(console.error);
