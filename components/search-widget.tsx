"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { MapPin, Calendar as CalendarIcon, Users, Search } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { DateRange } from "react-day-picker";

export function SearchWidget() {
    const router = useRouter();
    const [location, setLocation] = useState("");
    const [guests, setGuests] = useState("2");
    const [date, setDate] = useState<DateRange | undefined>();

    const handleSearch = () => {
        const params = new URLSearchParams();
        if (location) params.set("location", location);
        if (guests) params.set("guests", guests);
        if (date?.from) params.set("from", date.from.toISOString());
        if (date?.to) params.set("to", date.to.toISOString());

        router.push(`/accommodations?${params.toString()}`);
    };

    return (
        <div className="relative z-20 mt-12 w-full max-w-5xl shadow-2xl rounded-xl overflow-hidden">
            <Card className="border-0 rounded-xl bg-white/95 backdrop-blur-sm">
                <CardContent className="p-3 gap-3 grid grid-cols-1 md:grid-cols-[1.5fr,1.2fr,1fr,auto] items-center">
                    {/* Destination */}
                    <div className="relative flex items-center bg-slate-50 border border-slate-200 rounded-lg px-4 h-14 hover:border-blue-500 transition-colors group focus-within:ring-2 focus-within:ring-blue-200">
                        <MapPin className="w-5 h-5 text-slate-400 mr-3 group-hover:text-blue-600 transition-colors" />
                        <div className="flex flex-col items-start w-full">
                            <span className="text-xs text-slate-500 font-semibold uppercase tracking-wider">Location</span>
                            <Input
                                placeholder="Where are you going?"
                                className="border-0 bg-transparent shadow-none focus-visible:ring-0 placeholder:text-slate-400 h-6 p-0 text-base font-medium"
                                value={location}
                                onChange={(e) => setLocation(e.target.value)}
                            />
                        </div>
                    </div>

                    {/* Dates */}
                    <Popover>
                        <PopoverTrigger asChild>
                            <div className="relative flex items-center bg-slate-50 border border-slate-200 rounded-lg px-4 h-14 hover:border-blue-500 transition-colors group cursor-pointer text-left w-full">
                                <CalendarIcon className="w-5 h-5 text-slate-400 mr-3 group-hover:text-blue-600 transition-colors" />
                                <div className="flex flex-col items-start w-full overflow-hidden">
                                    <span className="text-xs text-slate-500 font-semibold uppercase tracking-wider">Dates</span>
                                    <span className={cn("text-sm font-medium truncate w-full", !date && "text-slate-400")}>
                                        {date?.from ? (
                                            date.to ? (
                                                <>
                                                    {format(date.from, "MMM dd")} - {format(date.to, "MMM dd")}
                                                </>
                                            ) : (
                                                format(date.from, "MMM dd")
                                            )
                                        ) : (
                                            "Add dates"
                                        )}
                                    </span>
                                </div>
                            </div>
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

                    {/* Guests */}
                    <div className="relative flex items-center bg-slate-50 border border-slate-200 rounded-lg px-4 h-14 hover:border-blue-500 transition-colors group focus-within:ring-2 focus-within:ring-blue-200">
                        <Users className="w-5 h-5 text-slate-400 mr-3 group-hover:text-blue-600 transition-colors" />
                        <div className="flex flex-col items-start w-full">
                            <span className="text-xs text-slate-500 font-semibold uppercase tracking-wider">Guests</span>
                            <Input
                                type="number"
                                min="1"
                                placeholder="Add guests"
                                className="border-0 bg-transparent shadow-none focus-visible:ring-0 placeholder:text-slate-400 h-6 p-0 text-base font-medium"
                                value={guests}
                                onChange={(e) => setGuests(e.target.value)}
                            />
                        </div>
                    </div>

                    {/* Search Button */}
                    <Button
                        size="lg"
                        onClick={handleSearch}
                        className="h-14 px-8 text-lg font-bold bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-900/20 rounded-lg"
                    >
                        Search
                    </Button>
                </CardContent>
            </Card>
        </div>
    );
}
