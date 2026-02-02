"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format, differenceInDays } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { DateRange } from "react-day-picker";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface BookingWidgetProps {
    propertyId: string;
    pricePerNight: number;
    maxGuests: number;
    guestPrice?: Record<string, number> | null;
}

export function BookingWidget({ propertyId, pricePerNight, maxGuests, guestPrice }: BookingWidgetProps) {
    const router = useRouter();
    const [date, setDate] = useState<DateRange | undefined>();
    const [guests, setGuests] = useState("1");
    const [loading, setLoading] = useState(false);

    // Calculate effective price based on guest count
    const effectivePricePerNight = (guestPrice && guestPrice[guests])
        ? guestPrice[guests]
        : pricePerNight;

    const nights = date?.from && date?.to ? differenceInDays(date.to, date.from) : 0;
    const totalPrice = nights * effectivePricePerNight;

    const handleBooking = async () => {
        if (!date?.from || !date?.to) return;

        setLoading(true);
        try {
            const res = await fetch("/api/checkout", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    propertyId,
                    startDate: date.from.toISOString(),
                    endDate: date.to.toISOString(),
                    totalPrice,
                    guests
                }),
            });

            const text = await res.text();
            let data;
            try {
                data = JSON.parse(text);
            } catch (e) {
                console.error("Server returned non-JSON response:", text);
                throw new Error("Server Error: The server returned an invalid response. Please check the browser console for details.");
            }

            if (!res.ok) {
                if (res.status === 401) {
                    router.push(`/login?callbackUrl=/properties/${propertyId}`);
                    return;
                }
                throw new Error(data.error || "Something went wrong");
            }

            const { url } = data;
            window.location.href = url;

        } catch (error: any) {
            console.error(error);
            alert(error.message || "Something went wrong");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Card className="border shadow-lg">
            <CardHeader className="pb-4">
                <div className="flex justify-between items-baseline">
                    <CardTitle className="text-2xl font-bold">€{effectivePricePerNight}</CardTitle>
                    <span className="text-muted-foreground">/ night</span>
                </div>
                {effectivePricePerNight !== pricePerNight && (
                    <div className="text-sm text-green-600 font-medium">
                        Discount applied for {guests} guest{Number(guests) > 1 ? 's' : ''}!
                    </div>
                )}
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="grid gap-2">
                    <Label htmlFor="dates">Dates</Label>
                    <Popover>
                        <PopoverTrigger asChild>
                            <Button
                                id="dates"
                                variant={"outline"}
                                className={`w-full justify-start text-left font-normal ${!date && "text-muted-foreground"}`}
                            >
                                <CalendarIcon className="mr-2 h-4 w-4" />
                                {date?.from ? (
                                    date.to ? (
                                        `${format(date.from, "MMM dd")} - ${format(date.to, "MMM dd")}`
                                    ) : (
                                        format(date.from, "MMM dd")
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
                                disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
                            />
                        </PopoverContent>
                    </Popover>
                </div>

                <div className="grid gap-2">
                    <Label htmlFor="guests">Guests</Label>
                    <Input
                        id="guests"
                        type="number"
                        min="1"
                        max={maxGuests}
                        value={guests}
                        onChange={(e) => setGuests(e.target.value)}
                    />
                </div>

                {nights > 0 && (
                    <div className="pt-4 border-t">
                        <div className="flex justify-between text-sm mb-2">
                            <span>€{effectivePricePerNight} x {nights} nights</span>
                            <span>€{totalPrice}</span>
                        </div>
                        <div className="flex justify-between font-bold text-lg">
                            <span>Total</span>
                            <span>€{totalPrice}</span>
                        </div>
                    </div>
                )}
            </CardContent>
            <CardFooter>
                <Button
                    className="w-full bg-blue-600 hover:bg-blue-700"
                    size="lg"
                    onClick={handleBooking}
                    disabled={!date?.from || !date?.to || loading || nights <= 0}
                >
                    {loading ? "Processing..." : "Reserve"}
                </Button>
            </CardFooter>
        </Card>
    );
}
