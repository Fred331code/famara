
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

interface Property {
    id: string;
    title: string;
    location: string;
    pricePerNight: string;
    createdAt: string;
}

export default function HostPropertiesPage() {
    const [properties, setProperties] = useState<Property[]>([]);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        fetchProperties();
    }, []);

    const fetchProperties = async () => {
        try {
            const res = await fetch("/api/host/properties");
            if (res.status === 401) {
                router.push("/login"); // Redirect if unauthorized
                return;
            }
            if (!res.ok) throw new Error("Failed to fetch");
            const data = await res.json();
            setProperties(data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this property?")) return;

        try {
            const res = await fetch(`/api/host/properties/${id}`, {
                method: "DELETE",
            });
            if (res.ok) {
                setProperties(properties.filter((p) => p.id !== id));
            } else {
                alert("Failed to delete property");
            }
        } catch (error) {
            console.error(error);
        }
    };

    if (loading) return <div className="p-8 text-center">Loading properties...</div>;

    return (
        <div className="container py-10">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold">My Properties</h1>
                <Link href="/host/properties/new">
                    <Button>Add New Property</Button>
                </Link>
            </div>

            {properties.length === 0 ? (
                <div className="text-center p-12 border rounded-lg bg-slate-50">
                    <h3 className="text-lg font-medium">No properties listed yet</h3>
                    <p className="text-muted-foreground mb-4">Start earning by listing your place.</p>
                    <Link href="/host/properties/new">
                        <Button variant="outline">Create your first listing</Button>
                    </Link>
                </div>
            ) : (
                <div className="border rounded-lg overflow-hidden">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-muted/50 border-b">
                            <tr>
                                <th className="p-4 font-medium">Property</th>
                                <th className="p-4 font-medium hidden sm:table-cell">Location</th>
                                <th className="p-4 font-medium hidden sm:table-cell">Price/Night</th>
                                <th className="p-4 font-medium text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y">
                            {properties.map((property) => (
                                <tr key={property.id} className="hover:bg-muted/50 transition-colors">
                                    <td className="p-4 font-medium">{property.title}</td>
                                    <td className="p-4 hidden sm:table-cell">{property.location}</td>
                                    <td className="p-4 hidden sm:table-cell">€{property.pricePerNight}</td>
                                    <td className="p-4 text-right space-x-2">
                                        <Link href={`/host/properties/${property.id}`}>
                                            <Button variant="outline" size="sm">Edit</Button>
                                        </Link>
                                        <Button
                                            variant="destructive"
                                            size="sm"
                                            onClick={() => handleDelete(property.id)}
                                        >
                                            Delete
                                        </Button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}
