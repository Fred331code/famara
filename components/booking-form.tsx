
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { addDays, differenceInCalendarDays, format } from "date-fns";
import { DateRange } from "react-day-picker";
import { Calendar as CalendarIcon, Loader2 } from "lucide-react";
import { useSession } from "next-auth/react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";

interface BookingFormProps {
    propertyId: string;
    pricePerNight: number;
}

export function BookingForm({ propertyId, pricePerNight }: BookingFormProps) {
    const router = useRouter();
    const { data: session } = useSession();

    // Default to today and tomorrow
    const [date, setDate] = useState<DateRange | undefined>({
        from: new Date(),
        to: addDays(new Date(), 5),
    });

    // Availability state
    const [disabledDates, setDisabledDates] = useState<any[]>([]);

    useEffect(() => {
        const fetchAvailability = async () => {
            try {
                const res = await fetch(`/api/properties/${propertyId}/availability`);
                if (res.ok) {
                    const data = await res.json();
                    const dates = data.map((range: any) => ({
                        from: new Date(range.startDate),
                        to: new Date(range.endDate)
                    }));
                    setDisabledDates(dates);
                }
            } catch (error) {
                console.error("Failed to fetch availability", error);
            }
        };
        fetchAvailability();
    }, [propertyId]);

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    // Calculate nights and price
    const nights = date?.from && date?.to
        ? differenceInCalendarDays(date.to, date.from)
        : 0;

    const totalPrice = nights * pricePerNight;
    const taxes = 50; // Flat cleaning fee for demo
    const grandTotal = totalPrice + taxes;

    const onBook = async () => {
        if (!session) {
            router.push("/login?callbackUrl=" + window.location.pathname);
            return;
        }

        if (!date?.from || !date?.to) {
            setError("Please select check-in and check-out dates");
            return;
        }

        setLoading(true);
        setError("");

        try {
            const res = await fetch("/api/bookings", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    propertyId,
                    startDate: date.from,
                    endDate: date.to,
                    totalPrice: grandTotal
                })
            });

            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.error || "Booking failed");
            }

            router.push("/bookings/success");
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="border rounded-xl p-6 shadow-xl bg-white sticky top-24">
            <div className="flex justify-between items-end mb-6">
                <div>
                    <span className="text-2xl font-bold">€{pricePerNight}</span>
                    <span className="text-slate-500"> / night</span>
                </div>
            </div>

            {error && (
                <div className="bg-red-50 text-red-600 p-3 rounded text-sm mb-4">
                    {error}
                </div>
            )}

            <div className="grid gap-2 mb-4">
                <Popover>
                    <PopoverTrigger asChild>
                        <Button
                            id="date"
                            variant={"outline"}
                            className={cn(
                                "w-full justify-start text-left font-normal h-auto py-3",
                                !date && "text-muted-foreground"
                            )}
                        >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {date?.from ? (
                                date.to ? (
                                    <>
                                        <div className="flex flex-col text-left">
                                            <span className="text-xs font-semibold uppercase text-slate-500">Dates</span>
                                            <span>
                                                {format(date.from, "MMM dd")} - {format(date.to, "MMM dd")}
                                            </span>
                                        </div>
                                    </>
                                ) : (
                                    format(date.from, "LLL dd, y")
                                )
                            ) : (
                                <span>Pick a date</span>
                            )}
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                            initialFocus
                            mode="range"
                            defaultMonth={date?.from}
                            selected={date}
                            onSelect={setDate}
                            numberOfMonths={2}
                            disabled={[
                                { before: new Date() },
                                ...disabledDates
                            ]}
                        />
                    </PopoverContent>
                </Popover>
            </div>

            <Button
                onClick={onBook}
                disabled={loading || nights <= 0}
                className="w-full bg-rose-600 hover:bg-rose-700 text-lg py-6 font-semibold"
            >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Reserve"}
            </Button>

            <p className="text-center text-xs text-slate-500 mt-4">You won't be charged yet</p>

            {nights > 0 && (
                <>
                    <div className="mt-6 space-y-3 text-slate-600 text-sm">
                        <div className="flex justify-between">
                            <span className="underline">€{pricePerNight} x {nights} nights</span>
                            <span>€{totalPrice}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="underline">Cleaning fee</span>
                            <span>€{taxes}</span>
                        </div>
                    </div>
                    <Separator className="my-4" />
                    <div className="flex justify-between font-bold text-lg">
                        <span>Total</span>
                        <span>€{grandTotal}</span>
                    </div>
                </>
            )}
        </div>
    );
}
