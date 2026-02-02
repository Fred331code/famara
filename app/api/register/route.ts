import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY || "re_123456789");

export async function POST(req: Request) {
    try {
        const { name, email, password, role } = await req.json();

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
                role: (role === 'HOST' || role === 'GUEST') ? role : 'GUEST'
            }
        });

        // SEND EMAIL VIA RESEND
        const confirmLink = `${process.env.NEXTAUTH_URL}/api/verify-email?token=${verificationToken}`;

        await resend.emails.send({
            from: "onboarding@resend.dev",
            to: email,
            subject: "Verify your email - Famara Booking",
            html: `<p>Click <a href="${confirmLink}">here</a> to verify your email.</p>`
        });

        return NextResponse.json(user);
    } catch (error) {
        console.error("[REGISTER_POST]", error);
        return NextResponse.json({ error: "Internal Error" }, { status: 500 });
    }
}
