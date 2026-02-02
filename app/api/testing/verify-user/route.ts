
import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET() {
    try {
        await db.user.update({
            where: { email: "test2@example.com" },
            data: {
                emailVerified: new Date(),
                isVerified: true
            }
        });
        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ error: (error as Error).message }, { status: 500 });
    }
}
