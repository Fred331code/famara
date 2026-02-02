
import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import crypto from "crypto";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY || "re_123456789");

export async function POST(req: Request) {
    try {
        const { email } = await req.json();

        if (!email) {
            return NextResponse.json({ error: "Email is required" }, { status: 400 });
        }

        const user = await db.user.findUnique({
            where: { email }
        });

        if (!user) {
            // Return success even if user doesn't exist to prevent enumeration
            return NextResponse.json({ message: "If an account exists, a reset link has been sent." });
        }

        const resetToken = crypto.randomBytes(32).toString("hex");
        const resetTokenExpiry = new Date(Date.now() + 3600000); // 1 hour

        await db.user.update({
            where: { id: user.id },
            data: {
                resetToken,
                resetTokenExpiry
            }
        });

        const resetLink = `${process.env.NEXTAUTH_URL}/reset-password?token=${resetToken}`;

        const { data, error } = await resend.emails.send({
            from: "onboarding@resend.dev",
            to: email,
            subject: "Reset your password - Famara Booking",
            html: `<p>Click <a href="${resetLink}">here</a> to reset your password. This link expires in 1 hour.</p>`
        });

        if (error) {
            console.error("[RESEND_ERROR]", error);
            // Don't fail the request, just log it. Or fail if you prefer strict handling.
        } else {
            console.log("[RESEND_SUCCESS]", data);
        }

        return NextResponse.json({ message: "If an account exists, a reset link has been sent." });
    } catch (error) {
        console.error("[FORGOT_PASSWORD]", error);
        return NextResponse.json({ error: "Internal Error" }, { status: 500 });
    }
}
