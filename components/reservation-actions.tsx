"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Check, X } from "lucide-react";

interface ReservationActionsProps {
    bookingId: string;
}

export function ReservationActions({ bookingId }: ReservationActionsProps) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    const updateStatus = async (status: "CONFIRMED" | "CANCELLED") => {
        setLoading(true);
        try {
            const res = await fetch(`/api/bookings/${bookingId}/status`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ status })
            });

            if (res.ok) {
                router.refresh();
            } else {
                alert("Failed to update status");
            }
        } catch (error) {
            console.error(error);
            alert("Error updating status");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex gap-2">
            <Button
                size="sm"
                variant="default"
                className="bg-green-600 hover:bg-green-700 text-white"
                onClick={() => updateStatus("CONFIRMED")}
                disabled={loading}
            >
                <Check className="w-4 h-4 mr-1" />
                Accept
            </Button>
            <Button
                size="sm"
                variant="destructive"
                onClick={() => updateStatus("CANCELLED")}
                disabled={loading}
            >
                <X className="w-4 h-4 mr-1" />
                Reject
            </Button>
        </div>
    );
}
