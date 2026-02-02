"use client";

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Search, CreditCard, Home, CalendarX, MessageCircle } from "lucide-react";

export default function HelpPage() {
    return (
        <div className="bg-slate-50 min-h-screen pb-20">
            {/* Hero Search */}
            <div className="bg-slate-900 text-white py-20 px-4 text-center">
                <h1 className="text-3xl md:text-5xl font-bold mb-6">How can we help?</h1>
                <div className="max-w-2xl mx-auto relative">
                    <input
                        type="text"
                        placeholder="Search our help center..."
                        className="w-full h-14 pl-12 pr-4 rounded-full text-slate-900 focus:outline-none focus:ring-4 focus:ring-blue-500/30"
                    />
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-6 h-6" />
                </div>
            </div>

            <div className="container px-4 -mt-10 relative z-10">
                {/* Topic Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-12">
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 hover:shadow-md transition-all text-center cursor-pointer group">
                        <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-blue-600 transition-colors">
                            <CalendarX className="w-6 h-6 text-blue-600 group-hover:text-white" />
                        </div>
                        <h3 className="font-bold text-slate-900">Cancellations</h3>
                    </div>
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 hover:shadow-md transition-all text-center cursor-pointer group">
                        <div className="w-12 h-12 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-green-600 transition-colors">
                            <CreditCard className="w-6 h-6 text-green-600 group-hover:text-white" />
                        </div>
                        <h3 className="font-bold text-slate-900">Payments</h3>
                    </div>
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 hover:shadow-md transition-all text-center cursor-pointer group">
                        <div className="w-12 h-12 bg-purple-50 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-purple-600 transition-colors">
                            <Home className="w-6 h-6 text-purple-600 group-hover:text-white" />
                        </div>
                        <h3 className="font-bold text-slate-900">Property Details</h3>
                    </div>
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 hover:shadow-md transition-all text-center cursor-pointer group">
                        <div className="w-12 h-12 bg-orange-50 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-orange-600 transition-colors">
                            <MessageCircle className="w-6 h-6 text-orange-600 group-hover:text-white" />
                        </div>
                        <h3 className="font-bold text-slate-900">Contact Host</h3>
                    </div>
                </div>

                {/* FAQ Section */}
                <div className="max-w-3xl mx-auto bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
                    <h2 className="text-2xl font-bold mb-6">Frequently Asked Questions</h2>

                    <Accordion type="single" collapsible className="w-full">
                        <AccordionItem value="item-1">
                            <AccordionTrigger>Can I cancel my booking?</AccordionTrigger>
                            <AccordionContent className="text-slate-600">
                                Yes, you can cancel your booking. Cancellation policies vary by property.
                                Please check the specific policy listed on your booking confirmation or the property page.
                                Most properties offer free cancellation up to 14 days before check-in.
                            </AccordionContent>
                        </AccordionItem>
                        <AccordionItem value="item-2">
                            <AccordionTrigger>When will I be charged?</AccordionTrigger>
                            <AccordionContent className="text-slate-600">
                                You will usually be charged upon booking confirmation.
                                Some Hosts allow for split payments (50% now, 50% later).
                                Check your booking summary for payment details.
                            </AccordionContent>
                        </AccordionItem>
                        <AccordionItem value="item-3">
                            <AccordionTrigger>How do I check in?</AccordionTrigger>
                            <AccordionContent className="text-slate-600">
                                Check-in instructions are sent to your email 48 hours before your arrival.
                                Most properties in Famara offer self check-in via key lockbox for your convenience.
                            </AccordionContent>
                        </AccordionItem>
                        <AccordionItem value="item-4">
                            <AccordionTrigger>Are pets allowed?</AccordionTrigger>
                            <AccordionContent className="text-slate-600">
                                Pet policies are set by individual hosts.
                                Look for the "Pet Friendly" facility tag on property listings.
                            </AccordionContent>
                        </AccordionItem>
                        <AccordionItem value="item-5">
                            <AccordionTrigger>What if I need to change my dates?</AccordionTrigger>
                            <AccordionContent className="text-slate-600">
                                You can request a date change through your "My Trips" dashboard.
                                Changes are subject to availability and host approval.
                            </AccordionContent>
                        </AccordionItem>
                    </Accordion>

                    <div className="mt-10 pt-10 border-t border-slate-100 text-center">
                        <h3 className="font-bold mb-2">Still need help?</h3>
                        <p className="text-slate-500 mb-6">Our support team is available 24/7 to assist you.</p>
                        <Link href="/contact">
                            <Button className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl px-8">
                                Contact Us
                            </Button>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
