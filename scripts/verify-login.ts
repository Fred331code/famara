
import 'dotenv/config';
import { db } from '../lib/db';
import bcrypt from 'bcryptjs';

async function main() {
    const email = 'info@volcanokite';
    const password = 'Password123!';

    console.log(`Checking login for ${email}...`);

    const user = await db.user.findUnique({
        where: { email }
    });

    if (!user) {
        console.error("User not found!");
        return;
    }

    console.log("User found:", user.id, user.name, user.role);
    console.log("Stored Hash:", user.password);

    if (!user.password) {
        console.error("No password set for user!");
        return;
    }

    const isValid = await bcrypt.compare(password, user.password);
    console.log(`Password '${password}' is valid?`, isValid);

    // Test a wrong password
    const isInvalid = await bcrypt.compare("WrongPass", user.password);
    console.log(`Password 'WrongPass' is valid?`, isInvalid);
}

main()
    .catch(console.error)
    .finally(() => {
        // Did not explicitly disconnect as db is shared, but script will exit.
    });
