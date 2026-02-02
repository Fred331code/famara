"use client";

import { Suspense } from "react";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { CheckCircle } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useSession } from "next-auth/react";

export default function TripsPage() {
    return (
        <Suspense fallback={<div className="container mx-auto py-20 px-4 text-center">Loading...</div>}>
            <TripsContent />
        </Suspense>
    );
}

function TripsContent() {
    const searchParams = useSearchParams();
    const success = searchParams.get("success");
    const { data: session } = useSession();

    return (
        <div className="container mx-auto py-20 px-4 text-center">
            {success ? (
                <div className="max-w-md mx-auto space-y-6 animate-fade-in-up">
                    <div className="flex justify-center">
                        <CheckCircle className="w-20 h-20 text-green-500" />
                    </div>
                    <h1 className="text-3xl font-bold text-slate-900">Booking Confirmed!</h1>
                    <p className="text-slate-600">
                        Thank you for your payment. Your trip has been booked successfully.
                        You will receive a confirmation email shortly.
                    </p>
                    <div className="pt-4">
                        <Button asChild size="lg" className="bg-blue-600 hover:bg-blue-700">
                            <Link href="/">Back to Home</Link>
                        </Button>
                    </div>
                </div>
            ) : (
                <div className="max-w-md mx-auto space-y-6">
                    <h1 className="text-3xl font-bold text-slate-900">My Trips</h1>
                    <p className="text-slate-600">
                        View and manage your upcoming accommodations.
                    </p>
                    <div className="bg-slate-50 p-8 rounded-lg border border-dashed border-slate-300">
                        <p className="text-slate-500 mb-4">You don't have any booked trips yet.</p>
                        <Button asChild variant="outline">
                            <Link href="/accommodations">Find an Accommodation</Link>
                        </Button>
                    </div>
                </div>
            )}
        </div>
    );
}
