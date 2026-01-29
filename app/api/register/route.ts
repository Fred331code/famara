import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import bcrypt from "bcryptjs";
import crypto from "crypto";

export async function POST(req: Request) {
    try {
        const { name, email, password } = await req.json();

        if (!email || !password || !name) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        const existingUser = await db.user.findUnique({
            where: { email }
        });

        if (existingUser) {
            return NextResponse.json({ error: "User already exists" }, { status: 400 });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const verificationToken = crypto.randomBytes(32).toString("hex");

        const user = await db.user.create({
            data: {
                name,
                email,
                password: hashedPassword,
                verificationToken,
                isVerified: false,
                role: 'HOST' // Defaulting to HOST for this flow, or could be GUEST
            }
        });

        // SIMULATE EMAIL SENDING
        console.log("------------------------------------------");
        console.log("📧 SIMULATED EMAIL - VERIFICATION LINK");
        console.log(`To: ${email}`);
        console.log(`Link: ${process.env.NEXTAUTH_URL}/api/verify-email?token=${verificationToken}`);
        console.log("------------------------------------------");

        return NextResponse.json(user);
    } catch (error) {
        console.error("[REGISTER_POST]", error);
        return NextResponse.json({ error: "Internal Error" }, { status: 500 });
    }
}
