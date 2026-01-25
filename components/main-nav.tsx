import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Search, Menu, UserCircle } from "lucide-react";

export function MainNav() {
    return (
        <header className="sticky top-0 z-50 w-full border-b bg-white/80 backdrop-blur-md">
            <div className="container mx-auto flex h-16 items-center justify-between px-4">
                {/* Logo */}
                <Link href="/" className="flex items-center gap-2">
                    <span className="text-xl font-bold text-blue-900 tracking-tight">FamaraBooking</span>
                </Link>

                {/* Desktop Navigation */}
                <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600">
                    <Link href="#" className="hover:text-blue-600 transition-colors">Stays</Link>
                    <Link href="#" className="hover:text-blue-600 transition-colors">Experiences</Link>
                    <Link href="#" className="hover:text-blue-600 transition-colors">Car Rental</Link>
                </nav>

                {/* Right Side Actions */}
                <div className="flex items-center gap-4">
                    <div className="hidden sm:block">
                        <Button variant="ghost" className="text-sm font-medium">
                            List your property
                        </Button>
                    </div>

                    <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm" className="hidden sm:flex">
                            Register
                        </Button>
                        <Button size="sm">Sign in</Button>
                    </div>
                </div>
            </div>
        </header>
    );
}
