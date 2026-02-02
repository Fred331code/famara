
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { format } from "date-fns";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default async function HostReservationsPage() {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
        redirect("/login?callbackUrl=/host/reservations");
    }

    const properties = await db.property.findMany({
        where: { hostId: session.user.id },
        select: { id: true }
    });

    const propertyIds = properties.map(p => p.id);

    const bookings = await db.booking.findMany({
        where: {
            propertyId: { in: propertyIds },
            status: { not: 'BLOCKED' } // Hide internal blocks
        },
        include: {
            property: {
                include: { propertyImages: true }
            },
            user: true
        },
        orderBy: {
            startDate: 'desc'
        }
    });

    const pending = bookings.filter(b => b.status === 'PENDING');
    const upcoming = bookings.filter(b => b.status === 'CONFIRMED' && new Date(b.endDate) >= new Date());
    const past = bookings.filter(b => new Date(b.endDate) < new Date() && b.status !== 'CANCELLED' && b.status !== 'PENDING');
    const cancelled = bookings.filter(b => b.status === 'CANCELLED');

    return (
        <div className="container px-4 py-10 max-w-5xl">
            <h1 className="text-3xl font-bold mb-8">Reservations</h1>

            <div className="space-y-12">
                {pending.length > 0 && (
                    <section>
                        <h2 className="text-xl font-semibold mb-4 text-blue-600">Pending Approval</h2>
                        <div className="space-y-4">
                            {pending.map(b => (
                                <ReservationRow key={b.id} booking={b} showActions />
                            ))}
                        </div>
                    </section>
                )}

                <section>
                    <h2 className="text-xl font-semibold mb-4">Upcoming</h2>
                    {upcoming.length === 0 ? (
                        <p className="text-slate-500 italic">No upcoming confirmed reservations.</p>
                    ) : (
                        <div className="space-y-4">
                            {upcoming.map(b => <ReservationRow key={b.id} booking={b} />)}
                        </div>
                    )}
                </section>

                {past.length > 0 && (
                    <section>
                        <h2 className="text-xl font-semibold mb-4 text-slate-600">Past</h2>
                        <div className="space-y-4 opacity-75">
                            {past.map(b => <ReservationRow key={b.id} booking={b} />)}
                        </div>
                    </section>
                )}

                {cancelled.length > 0 && (
                    <section>
                        <h2 className="text-xl font-semibold mb-4 text-slate-600">Cancelled</h2>
                        <div className="space-y-4 opacity-60">
                            {cancelled.map(b => <ReservationRow key={b.id} booking={b} />)}
                        </div>
                    </section>
                )}
            </div>
        </div>
    );
}

import { ReservationActions } from "@/components/reservation-actions";

function ReservationRow({ booking, showActions = false }: { booking: any, showActions?: boolean }) {
    return (
        <div className="flex flex-col md:flex-row md:items-center justify-between p-4 border rounded-lg bg-white shadow-sm hover:shadow transition gap-4">
            <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded overflow-hidden flex-shrink-0 bg-slate-100">
                    <img
                        src={(booking.property.propertyImages && booking.property.propertyImages.length > 0) ? booking.property.propertyImages[0].url : (booking.property.images[0] || "/placeholder.jpg")}
                        alt=""
                        className="w-full h-full object-cover"
                    />
                </div>
                <div>
                    <div className="font-bold text-lg">{booking.user.name || booking.user.email}</div>
                    <div className="text-sm text-slate-500 mb-1">{booking.property.title}</div>
                    <div className="text-sm font-medium">
                        {format(new Date(booking.startDate), "MMM dd")} - {format(new Date(booking.endDate), "MMM dd, yyyy")}
                    </div>
                </div>
            </div>

            <div className="flex flex-col md:flex-row items-center gap-4">
                <div className="text-right">
                    <div className="font-bold mb-1">€{booking.totalPrice}</div>
                    <span className={`px-2 py-1 rounded text-xs font-bold ${booking.status === 'CONFIRMED' ? 'bg-green-100 text-green-800' :
                        booking.status === 'PENDING' ? 'bg-blue-100 text-blue-800' :
                            'bg-red-100 text-red-800'
                        }`}>
                        {booking.status}
                    </span>
                </div>

                {showActions && (
                    <ReservationActions bookingId={booking.id} />
                )}
            </div>
        </div>
    );
}
