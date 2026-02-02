
import 'dotenv/config';
import { db } from '../lib/db';

async function main() {
    console.log("Checking users...");

    const user1 = await db.user.findUnique({ where: { email: 'info@volcanokite' } });
    console.log(`info@volcanokite: ${user1 ? 'EXISTS' : 'NOT FOUND'}`);

    const user2 = await db.user.findUnique({ where: { email: 'info@volcanokite.com' } });
    console.log(`info@volcanokite.com: ${user2 ? 'EXISTS' : 'NOT FOUND'}`);

    if (user1 && !user2) {
        console.log("Updating email to info@volcanokite.com...");
        await db.user.update({
            where: { email: 'info@volcanokite' },
            data: { email: 'info@volcanokite.com' }
        });
        console.log("Email updated successfully.");
    }
}

main()
    .catch(console.error);
