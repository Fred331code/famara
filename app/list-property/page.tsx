import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { ListPropertyForm } from "./_components/ListPropertyForm";

export default async function ListPropertyPage() {
    const session = await getServerSession();

    if (!session) {
        redirect("/api/auth/signin?callbackUrl=/list-property");
    }

    return (
        <div className="container mx-auto py-10 max-w-2xl">
            <div className="mb-8">
                <h1 className="text-3xl font-bold">List Your Property</h1>
                <p className="text-muted-foreground mt-2">
                    Tell us about your unique space. Fill in the details below to start hosting.
                </p>
            </div>

            <div className="bg-card border rounded-lg p-6 shadow-sm">
                {/* Pass user ID implicitly via session in backend or hidden field if needed. 
            Ideally, API extracts ID from session, so we don't pass it here for security. */}
                <ListPropertyForm />
            </div>
        </div>
    );
}
