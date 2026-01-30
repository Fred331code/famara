
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { db } from "@/lib/db";

export async function GET(req: Request) {
    try {
        const session = await getServerSession(authOptions);

        if (!session || !session.user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const properties = await db.property.findMany({
            where: {
                hostId: session.user.id
            },
            orderBy: {
                createdAt: 'desc'
            }
        });

        return NextResponse.json(properties);
    } catch (error) {
        console.error("[PROPERTIES_GET]", error);
        return NextResponse.json({ error: "Internal Error" }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);

        if (!session || !session.user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const body = await req.json();
        const {
            title,
            description,
            location,
            pricePerNight,
            maxGuests,
            images,
            facilities
        } = body;

        if (!title || !location || !pricePerNight) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        const property = await db.property.create({
            data: {
                title,
                description,
                location,
                pricePerNight,
                maxGuests: parseInt(maxGuests) || 2,
                images: images || [],
                facilities: facilities || [],
                hostId: session.user.id
            }
        });

        return NextResponse.json(property);
    } catch (error) {
        console.error("[PROPERTIES_POST]", error);
        return NextResponse.json({ error: "Internal Error" }, { status: 500 });
    }
}
