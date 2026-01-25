import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET() {
    try {
        // fast check to see if DB is responding
        await db.$queryRaw`SELECT 1`;

        return NextResponse.json({
            status: "ok",
            database: "connected",
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        console.error("Health Check Failed:", error);
        return NextResponse.json({
            status: "error",
            database: "disconnected",
            error: String(error)
        }, { status: 500 });
    }
}
