
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function NewPropertyPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const [formData, setFormData] = useState({
        title: "",
        description: "",
        location: "",
        pricePerNight: "",
        maxGuests: "2",
        imageUrl: "" // Simplified image handling for now
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            // Prepare data - convert single image URL to array for backend
            const payload = {
                ...formData,
                pricePerNight: parseFloat(formData.pricePerNight),
                images: formData.imageUrl ? [formData.imageUrl] : []
            };

            const res = await fetch("/api/host/properties", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload)
            });

            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.error || "Failed to create property");
            }

            router.push("/host/properties");
            router.refresh();
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container max-w-2xl py-10">
            <div className="flex items-center justify-between mb-8">
                <h1 className="text-3xl font-bold">Add New Property</h1>
                <Link href="/host/properties">
                    <Button variant="outline">Back</Button>
                </Link>
            </div>

            <div className="bg-card border p-6 rounded-lg shadow-sm">
                <form onSubmit={handleSubmit} className="space-y-6">
                    {error && (
                        <div className="bg-red-50 text-red-600 p-3 rounded text-sm">
                            {error}
                        </div>
                    )}

                    <div className="space-y-2">
                        <label className="text-sm font-medium">Property Title</label>
                        <input
                            required
                            name="title"
                            className="flex h-10 w-full rounded-md border border-input px-3 py-2"
                            placeholder="e.g. Sunny Beach Apartment"
                            value={formData.title}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Location</label>
                            <input
                                required
                                name="location"
                                className="flex h-10 w-full rounded-md border border-input px-3 py-2"
                                placeholder="e.g. Famara, Caleta"
                                value={formData.location}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Price per Night (€)</label>
                            <input
                                required
                                type="number"
                                name="pricePerNight"
                                className="flex h-10 w-full rounded-md border border-input px-3 py-2"
                                placeholder="100"
                                min="0"
                                value={formData.pricePerNight}
                                onChange={handleChange}
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium">Description</label>
                        <textarea
                            name="description"
                            className="flex w-full rounded-md border border-input px-3 py-2 min-h-[100px]"
                            placeholder="Describe your property..."
                            value={formData.description}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Max Guests</label>
                            <input
                                type="number"
                                name="maxGuests"
                                className="flex h-10 w-full rounded-md border border-input px-3 py-2"
                                value={formData.maxGuests}
                                onChange={handleChange}
                                min="1"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Image URL (Optional)</label>
                            <input
                                name="imageUrl"
                                className="flex h-10 w-full rounded-md border border-input px-3 py-2"
                                placeholder="https://example.com/image.jpg"
                                value={formData.imageUrl}
                                onChange={handleChange}
                            />
                        </div>
                    </div>

                    <Button type="submit" className="w-full" disabled={loading}>
                        {loading ? "Creating..." : "Create Property"}
                    </Button>
                </form>
            </div>
        </div>
    );
}
