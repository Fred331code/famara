"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Mail, Phone, MapPin, Send } from "lucide-react";

export default function ContactPage() {
    const [loading, setLoading] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);

        const formData = new FormData(e.currentTarget);
        const data = Object.fromEntries(formData);

        // Simulate sever action delay
        await new Promise(resolve => setTimeout(resolve, 1500));

        console.log("----------------------------------------");
        console.log("CONTACT FORM SUBMISSION:");
        console.log("To: help@hotelinlanzarote.com");
        console.log("From:", data.email);
        console.log("Subject:", data.subject);
        console.log("Message:", data.message);
        console.log("----------------------------------------");

        setLoading(false);
        setSubmitted(true);
    };

    if (submitted) {
        return (
            <div className="container py-20 text-center max-w-2xl">
                <div className="bg-green-50 p-12 rounded-3xl border border-green-100">
                    <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                        <Send className="w-8 h-8" />
                    </div>
                    <h1 className="text-3xl font-bold mb-4 text-slate-900">Message Sent!</h1>
                    <p className="text-slate-600 text-lg mb-8">
                        Thank you for reaching out. A member of our team will get back to you shortly at the email address you provided.
                    </p>
                    <Button onClick={() => setSubmitted(false)} variant="outline">
                        Send Another Message
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div className="container py-20 px-4">
            <div className="text-center mb-16">
                <h1 className="text-4xl font-bold mb-4">Contact Us</h1>
                <p className="text-xl text-slate-600 max-w-2xl mx-auto">
                    We're here to help you plan your perfect trip to Famara.
                </p>
            </div>

            <div className="grid md:grid-cols-2 gap-12 max-w-5xl mx-auto items-start">

                {/* Contact Info */}
                <div className="bg-slate-900 text-white p-10 rounded-3xl overflow-hidden relative">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500 rounded-full blur-[100px] opacity-20 -translate-y-1/2 translate-x-1/2"></div>

                    <h2 className="text-2xl font-bold mb-8 relative z-10">Get in touch</h2>

                    <div className="space-y-8 relative z-10">
                        <div className="flex items-start gap-4">
                            <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center shrink-0">
                                <Mail className="w-6 h-6" />
                            </div>
                            <div>
                                <h3 className="font-bold mb-1">Email</h3>
                                <p className="text-slate-300 text-sm mb-2">Our friendly team is here to help.</p>
                                <a href="mailto:help@hotelinlanzarote.com" className="text-blue-400 font-medium hover:text-blue-300">help@hotelinlanzarote.com</a>
                            </div>
                        </div>


                    </div>
                </div>

                {/* Contact Form */}
                <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-lg">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium">First name</label>
                                <Input name="firstName" required placeholder="First name" className="bg-slate-50" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Last name</label>
                                <Input name="lastName" required placeholder="Last name" className="bg-slate-50" />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium">Email</label>
                            <Input name="email" type="email" required placeholder="you@company.com" className="bg-slate-50" />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium">Subject</label>
                            <Input name="subject" required placeholder="How can we help?" className="bg-slate-50" />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium">Message</label>
                            <Textarea name="message" required placeholder="Leave us a message..." className="min-h-[150px] bg-slate-50" />
                        </div>

                        <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white h-12 rounded-xl text-lg" disabled={loading}>
                            {loading ? "Sending..." : "Send Message"}
                        </Button>
                    </form>
                </div>
            </div>
        </div>
    );
}
