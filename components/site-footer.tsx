"use client";

import Link from "next/link";
import { Mail, Phone, MapPin, Facebook, Instagram, Twitter } from "lucide-react";

export function SiteFooter() {
    return (
        <footer className="bg-slate-900 text-slate-200 py-16">
            <div className="container px-4 mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
                    {/* Brand Column */}
                    <div>
                        <Link href="/" className="inline-block mb-6">
                            <h2 className="text-2xl font-bold text-white tracking-tight">Famara Booking</h2>
                        </Link>
                        <p className="text-slate-400 text-sm leading-relaxed mb-6">
                            Discover the raw beauty of Lanzarote.
                            Premium accommodations and unforgettable water sports experiences in Caleta de Famara.
                        </p>
                        <div className="flex gap-4">
                            <Link href="#" className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center hover:bg-blue-600 transition-colors">
                                <Instagram className="w-5 h-5 text-white" />
                            </Link>
                            <Link href="#" className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center hover:bg-blue-600 transition-colors">
                                <Facebook className="w-5 h-5 text-white" />
                            </Link>
                            <Link href="#" className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center hover:bg-blue-600 transition-colors">
                                <Twitter className="w-5 h-5 text-white" />
                            </Link>
                        </div>
                    </div>

                    {/* Support Column */}
                    <div>
                        <h3 className="text-white font-bold mb-6">Support</h3>
                        <ul className="space-y-4 text-sm">
                            <li>
                                <Link href="/help" className="hover:text-blue-400 transition-colors">Help Center</Link>
                            </li>
                            <li>
                                <Link href="/contact" className="hover:text-blue-400 transition-colors">Contact Us</Link>
                            </li>
                            <li>
                                <Link href="/cancellations" className="hover:text-blue-400 transition-colors">Cancellation Options</Link>
                            </li>
                            <li>
                                <Link href="/safety" className="hover:text-blue-400 transition-colors">Safety Information</Link>
                            </li>
                        </ul>
                    </div>

                    {/* Company Column */}
                    <div>
                        <h3 className="text-white font-bold mb-6">Company</h3>
                        <ul className="space-y-4 text-sm">
                            <li>
                                <Link href="/about" className="hover:text-blue-400 transition-colors">About Us</Link>
                            </li>
                            <li>
                                <Link href="/careers" className="hover:text-blue-400 transition-colors">Careers</Link>
                            </li>
                            <li>
                                <Link href="/investors" className="hover:text-blue-400 transition-colors">Investors</Link>
                            </li>
                            <li>
                                <Link href="/terms" className="hover:text-blue-400 transition-colors">Terms of Service</Link>
                            </li>
                            <li>
                                <Link href="/privacy" className="hover:text-blue-400 transition-colors">Privacy Policy</Link>
                            </li>
                        </ul>
                    </div>

                    {/* Contact Info Column */}
                    <div>
                        <h3 className="text-white font-bold mb-6">Get in Touch</h3>
                        <ul className="space-y-4 text-sm">
                            <li className="flex items-center gap-3">
                                <Mail className="w-5 h-5 text-blue-500 shrink-0" />
                                <a href="mailto:help@hotelinlanzarote.com" className="hover:text-blue-400 transition-colors">
                                    help@hotelinlanzarote.com
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="border-t border-slate-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-slate-500">
                    <p>&copy; {new Date().getFullYear()} Famara Booking. All rights reserved.</p>
                    <p>
                        Made by <a href="https://www.cactuspublicidad.com" target="_blank" rel="noopener noreferrer" className="hover:text-blue-400 transition-colors">Cactus</a>
                    </p>
                </div>
            </div>
        </footer>
    );
}
