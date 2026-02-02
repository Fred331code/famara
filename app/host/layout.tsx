
import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";

export default async function HostLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const session = await getServerSession(authOptions);

    // @ts-ignore
    if (session?.user?.role !== "HOST") {
        redirect("/");
    }

    return (
        <div className="min-h-screen bg-slate-50">
            {children}
        </div>
    );
}
