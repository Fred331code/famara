"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { contactExperience } from "@/app/actions/contact";
import { useToast } from "@/components/ui/use-toast"; // Assuming useToast exists, or I might need to create simplified alert if not
import { Loader2 } from "lucide-react";

interface Props {
    experienceTitle: string;
    price: string;
}

export function ExperienceReservationDialog({ experienceTitle, price }: Props) {
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    // We'll use simple alert if toast doesn't exist, but let's try to be clean
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);

        const formData = new FormData(e.currentTarget);
        formData.append("experienceTitle", experienceTitle);

        const result = await contactExperience(formData);

        setLoading(false);

        if (result.success) {
            setSuccess(true);
            setTimeout(() => {
                setOpen(false);
                setSuccess(false);
            }, 3000);
        } else {
            alert("Something went wrong. Please try again.");
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button className="w-full h-12 text-lg">
                    Reserve Now
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Request Reservation</DialogTitle>
                    <DialogDescription>
                        {experienceTitle} - {price}
                        <br />
                        Fill in your details and we will contact you to confirm availability.
                    </DialogDescription>
                </DialogHeader>

                {success ? (
                    <div className="py-6 text-center space-y-2">
                        <h3 className="text-xl font-bold text-green-600">Request Sent!</h3>
                        <p className="text-slate-500">We will be in touch shortly.</p>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label htmlFor="name">Name</Label>
                            <Input id="name" name="name" placeholder="John Doe" required />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input id="email" name="email" type="email" placeholder="john@example.com" required />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="phone">Phone Number</Label>
                            <Input id="phone" name="phone" type="tel" placeholder="+34 600..." required />
                        </div>

                        <DialogFooter className="mt-6">
                            <Button type="submit" className="w-full" disabled={loading}>
                                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                {loading ? "Sending..." : "Send Request"}
                            </Button>
                        </DialogFooter>
                    </form>
                )}
            </DialogContent>
        </Dialog>
    );
}
