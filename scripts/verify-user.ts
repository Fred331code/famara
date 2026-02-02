
import { PrismaClient } from '@prisma/client';

const db = new PrismaClient();

async function main() {
    const email = 'test2@example.com';
    console.log(`Verifying user: ${email}`);

    try {
        const user = await db.user.update({
            where: { email },
            data: {
                emailVerified: new Date(),
                isVerified: true
            }
        });
        console.log(`User verified: ${user.email}`);
    } catch (e) {
        console.error(e);
    }
}

main()
    .finally(async () => {
        await db.$disconnect();
    });
