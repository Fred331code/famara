import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const token = searchParams.get("token");

    if (!token) {
        return NextResponse.json({ error: "Missing token" }, { status: 400 });
    }

    const user = await db.user.findFirst({
        where: { verificationToken: token }
    });

    if (!user) {
        return NextResponse.json({ error: "Invalid token" }, { status: 400 });
    }

    await db.user.update({
        where: { id: user.id },
        data: {
            isVerified: true,
            verificationToken: null // Consume token
        }
    });

    // Redirect to login with success message
    return redirect("/login?verified=true");
}
