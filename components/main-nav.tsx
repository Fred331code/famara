"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Search, Menu, UserCircle } from "lucide-react";
import { useSession, signOut } from "next-auth/react";

export function MainNav() {
    const { data: session } = useSession();
    const pathname = usePathname();

    // Strict Role Checking
    const isHost = session?.user?.role === 'HOST';

    return (
        <header className="sticky top-0 z-50 w-full border-b bg-white/80 backdrop-blur-md">
            <div className="container mx-auto flex h-16 items-center justify-between px-4">
                {/* Logo */}
                <Link href={isHost ? "/host/properties" : "/"} className="flex items-center gap-2">
                    <img src="/logo.svg" alt="Hotel In Lanzarote" className="h-[40px] w-auto" />
                </Link>

                {/* Navigation Links - Context Aware */}
                <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600">
                    {isHost ? (
                        <>
                            <Link href="/host/properties" className={`hover:text-blue-600 transition-colors ${pathname === '/host/properties' ? 'text-blue-600 font-bold' : ''}`}>
                                Properties
                            </Link>
                            <Link href="/host/reservations" className={`hover:text-blue-600 transition-colors ${pathname === '/host/reservations' ? 'text-blue-600 font-bold' : ''}`}>
                                Reservations
                            </Link>
                            <Link href="/host/properties/new">
                                <Button variant="ghost" size="sm" className="text-blue-600 bg-blue-50 hover:bg-blue-100">
                                    + Create Listing
                                </Button>
                            </Link>
                        </>
                    ) : (
                        <>
                            <Link href="/accommodations" className="hover:text-blue-600 transition-colors">Accommodations</Link>
                            <Link href="/experiences" className="hover:text-blue-600 transition-colors">Experiences</Link>
                            {session && (
                                <Link href="/trips" className={`hover:text-blue-600 transition-colors ${pathname === '/trips' ? 'text-blue-600 font-bold' : ''}`}>
                                    My Trips
                                </Link>
                            )}
                        </>
                    )}
                </nav>

                {/* Right Side Actions */}
                <div className="flex items-center gap-4">
                    {session ? (
                        <>
                            <div className="flex items-center gap-2">
                                <span className="text-xs font-medium px-2 py-1 bg-slate-100 rounded-full text-slate-600">
                                    {isHost ? "HOST ACCOUNT" : "GUEST ACCOUNT"}
                                </span>
                            </div>

                            <div className="h-6 w-px bg-slate-200 mx-1" />

                            <Button variant="outline" size="sm" onClick={() => signOut()}>
                                Logout
                            </Button>
                            <div className="hidden sm:flex items-center gap-2 ml-2">
                                <UserCircle className="w-8 h-8 text-slate-300" />
                            </div>
                        </>
                    ) : (
                        <>
                            <div className="flex items-center gap-2">
                                <Link href="/register">
                                    <Button variant="outline" size="sm" className="hidden sm:flex">
                                        Register
                                    </Button>
                                </Link>
                                <Link href="/login">
                                    <Button size="sm">Sign in</Button>
                                </Link>
                            </div>
                        </>
                    )}
                </div>
            </div >
        </header >
    );
}
