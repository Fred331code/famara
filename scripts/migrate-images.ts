
import { PrismaClient } from '@prisma/client';
import 'dotenv/config';

const prisma = new PrismaClient({});

async function main() {
    console.log("Starting image migration...");

    const properties = await prisma.property.findMany({
        where: {
            images: {
                isEmpty: false
            }
        }
    });

    console.log(`Found ${properties.length} properties with images.`);

    for (const prop of properties) {
        console.log(`Migrating images for property: ${prop.title} (${prop.id})`);

        for (const url of prop.images) {
            // Check if already exists to avoid dupes if run multiple times
            const existing = await prisma.propertyImage.findFirst({
                where: {
                    propertyId: prop.id,
                    url: url
                }
            });

            if (!existing) {
                await prisma.propertyImage.create({
                    data: {
                        propertyId: prop.id,
                        url: url,
                        caption: "Uploaded Image" // Default caption
                    }
                });
                console.log(`  + Created PropertyImage for ${url}`);
            } else {
                console.log(`  . Skipped existing ${url}`);
            }
        }
    }

    console.log("Migration complete.");
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
