
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { CheckCircle } from "lucide-react";

export default function BookingSuccessPage() {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-slate-50">
            <div className="bg-white p-8 rounded-2xl shadow-xl text-center max-w-md w-full">
                <div className="flex justify-center mb-6">
                    <CheckCircle className="w-16 h-16 text-green-500" />
                </div>

                <h1 className="text-2xl font-bold text-slate-900 mb-2">Booking Confirmed!</h1>
                <p className="text-slate-600 mb-8">
                    Your reservation has been successfully created. We've sent a confirmation email to your inbox.
                </p>

                <div className="space-y-3">
                    <Link href="/accommodations" className="block">
                        <Button className="w-full bg-slate-900 hover:bg-slate-800">
                            Browse more accommodations
                        </Button>
                    </Link>

                    <Link href="/" className="block">
                        <Button variant="outline" className="w-full">
                            Return Home
                        </Button>
                    </Link>
                </div>
            </div>
        </div>
    );
}
