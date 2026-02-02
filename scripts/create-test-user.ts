
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const db = new PrismaClient();

async function main() {
    const email = 'test2@example.com';
    const password = await bcrypt.hash('password123', 10);

    try {
        const user = await db.user.upsert({
            where: { email },
            update: {},
            create: {
                email,
                name: 'Test User 2',
                password,
                role: 'GUEST',
            },
        });
        console.log(`User created: ${user.email}`);
    } catch (e) {
        console.error(e);
    }
}

main()
    .finally(async () => {
        await db.$disconnect();
    });
