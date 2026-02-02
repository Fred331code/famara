import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { db } from "@/lib/db";
import Stripe from "stripe";

export async function POST(req: Request) {
    const body = await req.text();
    const signature = headers().get("Stripe-Signature") as string;

    let event: Stripe.Event;

    try {
        event = stripe.webhooks.constructEvent(
            body,
            signature,
            process.env.STRIPE_WEBHOOK_SECRET!
        );
    } catch (error: any) {
        return new NextResponse(`Webhook Error: ${error.message}`, { status: 400 });
    }

    const session = event.data.object as Stripe.Checkout.Session;

    if (event.type === "checkout.session.completed") {
        const { propertyId, userId, startDate, endDate, guests } = session.metadata || {};

        if (!propertyId || !userId || !startDate || !endDate) {
            return new NextResponse("Webhook Error: Missing metadata", { status: 400 });
        }

        await db.booking.create({
            data: {
                propertyId,
                userId,
                startDate: new Date(startDate),
                endDate: new Date(endDate),
                totalPrice: Number(session.amount_total) / 100, // Convert back to main currency unit
                status: "CONFIRMED", // Paid booking is confirmed
            }
        });
    }

    return new NextResponse(null, { status: 200 });
}
