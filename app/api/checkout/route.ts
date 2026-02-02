import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { stripe } from "@/lib/stripe";
import { db } from "@/lib/db";
import { getIcalEvents, isDateBlocked } from "@/lib/ical-parser";

export async function POST(req: Request) {
    try {
        console.log("CHECKOUT: Request received");
        const session = await getServerSession(authOptions);
        console.log("CHECKOUT: Session", session?.user?.id);

        if (!session || !session.user || !session.user.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { propertyId, startDate, endDate, totalPrice, guests } = await req.json();
        console.log("CHECKOUT: Payload", { propertyId, startDate, endDate });

        if (!propertyId || !startDate || !endDate || !totalPrice) {
            const missing = [];
            if (!propertyId) missing.push("propertyId");
            if (!startDate) missing.push("startDate");
            if (!endDate) missing.push("endDate");
            if (!totalPrice) missing.push("totalPrice");
            return NextResponse.json({ error: `Missing required fields: ${missing.join(", ")}` }, { status: 400 });
        }

        const property = await db.property.findUnique({
            where: { id: propertyId }
        });
        console.log("CHECKOUT: Property found", property?.id);

        if (!property) {
            return NextResponse.json({ error: "Property not found" }, { status: 404 });
        }

        // Check for availability
        const overlap = await db.booking.findFirst({
            where: {
                propertyId,
                status: "CONFIRMED", // Only check confirmed bookings
                OR: [
                    { startDate: { lte: endDate, gte: startDate } },
                    { endDate: { lte: endDate, gte: startDate } },
                    { startDate: { lte: startDate }, endDate: { gte: endDate } }
                ]
            }
        });

        if (overlap) {
            return NextResponse.json({ error: "Property is not available for these dates" }, { status: 409 });
        }



        // Check iCal availability
        // Check iCal availability
        if (property.icalUrl) {
            console.log("CHECKOUT: Checking iCal", property.icalUrl);
            const icalEvents = await getIcalEvents(property.icalUrl);
            console.log("CHECKOUT: iCal Events fetched", icalEvents.length);
            const isBlocked = isDateBlocked(new Date(startDate), new Date(endDate), icalEvents);
            console.log("CHECKOUT: isBlocked", isBlocked);

            if (isBlocked) {
                return NextResponse.json({ error: "Property is unavailable (External Calendar)" }, { status: 409 });
            }
        }

        console.log("CHECKOUT: Creating Stripe Session...");

        // Create Stripe checkout session
        const checkoutSession = await stripe.checkout.sessions.create({
            mode: "payment",
            customer_email: session.user.email || undefined,
            client_reference_id: session.user.id,
            payment_method_types: ["card"],
            line_items: [
                {
                    price_data: {
                        currency: "eur",
                        product_data: {
                            name: `Stay at ${property.title}`,
                            description: `${startDate.split("T")[0]} to ${endDate.split("T")[0]} (${guests} guests)`,
                            images: property.images.length > 0 ? [property.images[0]] : [],
                        },
                        unit_amount: Math.round(totalPrice * 100), // Stripe expects cents
                    },
                    quantity: 1,
                },
            ],
            metadata: {
                propertyId,
                userId: session.user.id,
                startDate,
                endDate,
                guests: guests.toString(),
            },
            success_url: `${process.env.NEXTAUTH_URL}/trips?success=true`,
            cancel_url: `${process.env.NEXTAUTH_URL}/properties/${propertyId}?canceled=true`,
        });

        return NextResponse.json({ url: checkoutSession.url });
    } catch (error) {
        console.error("[STRIPE_CHECKOUT]", error);
        return NextResponse.json({ error: `Internal Error: ${(error as Error).message}` }, { status: 500 });
    }
}
