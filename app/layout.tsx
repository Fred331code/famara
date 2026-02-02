import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
    title: "Hotel In Lanzarote",
    description: "Discover the best accommodations in Lanzarote, from Famara to Puerto del Carmen.",
    icons: {
        icon: "/logo.svg",
    },
};

import { Providers } from "@/components/providers";
import { MainNav } from "@/components/main-nav";
import { SiteFooter } from "@/components/site-footer";

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body className={inter.className}>
                <Providers>
                    <MainNav />
                    <main className="flex-1">{children}</main>
                    <SiteFooter />
                </Providers>
            </body>
        </html>
    );
}
