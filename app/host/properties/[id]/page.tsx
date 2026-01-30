
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface PropertyParams {
    params: {
        id: string;
    };
}

export default function EditPropertyPage({ params }: PropertyParams) {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");

    const [formData, setFormData] = useState({
        title: "",
        description: "",
        location: "",
        pricePerNight: "",
        maxGuests: "2",
        imageUrl: ""
    });

    useEffect(() => {
        const fetchProperty = async () => {
            try {
                const res = await fetch(`/api/host/properties/${params.id}`);
                if (!res.ok) throw new Error("Failed to load property");
                const data = await res.json();

                setFormData({
                    title: data.title,
                    description: data.description || "",
                    location: data.location,
                    pricePerNight: data.pricePerNight,
                    maxGuests: data.maxGuests.toString(),
                    imageUrl: data.images && data.images.length > 0 ? data.images[0] : ""
                });
            } catch (err) {
                setError("Could not load property details");
            } finally {
                setLoading(false);
            }
        };

        fetchProperty();
    }, [params.id]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        setError("");

        try {
            const payload = {
                ...formData,
                pricePerNight: parseFloat(formData.pricePerNight),
                images: formData.imageUrl ? [formData.imageUrl] : []
            };

            const res = await fetch(`/api/host/properties/${params.id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload)
            });

            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.error || "Failed to update property");
            }

            router.push("/host/properties");
            router.refresh();
        } catch (err: any) {
            setError(err.message);
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <div className="p-8 text-center">Loading...</div>;

    return (
        <div className="container max-w-2xl py-10">
            <div className="flex items-center justify-between mb-8">
                <h1 className="text-3xl font-bold">Edit Property</h1>
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
                            <label className="text-sm font-medium">Image URL</label>
                            <input
                                name="imageUrl"
                                className="flex h-10 w-full rounded-md border border-input px-3 py-2"
                                value={formData.imageUrl}
                                onChange={handleChange}
                            />
                        </div>
                    </div>

                    <Button type="submit" className="w-full" disabled={saving}>
                        {saving ? "Saving..." : "Save Changes"}
                    </Button>
                </form>
            </div>
        </div>
    );
}
