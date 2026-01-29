"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export function ListPropertyForm() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        title: "",
        overview: "", // Mapped to description + overview
        location: "",
        pricePerNight: "",
        maxGuests: 2,
        facilities: "", // comma separated for now
        houseRules: "",
        images: "", // comma separated URLs
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const payload = {
                ...formData,
                description: formData.overview, // Backwards compat
                pricePerNight: parseFloat(formData.pricePerNight),
                maxGuests: parseInt(String(formData.maxGuests)),
                facilities: formData.facilities.split(',').map(f => f.trim()).filter(Boolean),
                images: formData.images.split(',').map(i => i.trim()).filter(Boolean),
            };

            const res = await fetch("/api/properties", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            if (!res.ok) throw new Error("Failed to create property");

            const property = await res.json();
            router.push(`/properties/${property.id}`);
            router.refresh();
        } catch (error) {
            console.error(error);
            alert("Something went wrong. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
                <label className="text-sm font-medium">Property Title</label>
                <input
                    required
                    name="title"
                    className="flex h-10 w-full rounded-md border border-input px-3 py-2"
                    placeholder="e.g. Sunset Villa at Famara"
                    value={formData.title}
                    onChange={handleChange}
                />
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <label className="text-sm font-medium">Price per Night ($)</label>
                    <input
                        required
                        type="number"
                        name="pricePerNight"
                        className="flex h-10 w-full rounded-md border border-input px-3 py-2"
                        placeholder="150"
                        value={formData.pricePerNight}
                        onChange={handleChange}
                    />
                </div>
                <div className="space-y-2">
                    <label className="text-sm font-medium">Max Guests</label>
                    <input
                        required
                        type="number"
                        name="maxGuests"
                        className="flex h-10 w-full rounded-md border border-input px-3 py-2"
                        value={formData.maxGuests}
                        onChange={handleChange}
                    />
                </div>
            </div>

            <div className="space-y-2">
                <label className="text-sm font-medium">Location</label>
                <input
                    required
                    name="location"
                    className="flex h-10 w-full rounded-md border border-input px-3 py-2"
                    placeholder="Address or Area"
                    value={formData.location}
                    onChange={handleChange}
                />
            </div>

            <div className="space-y-2">
                <label className="text-sm font-medium">Overview & Description</label>
                <textarea
                    required
                    name="overview"
                    className="flex min-h-[100px] w-full rounded-md border border-input px-3 py-2"
                    placeholder="Describe your property..."
                    value={formData.overview}
                    onChange={handleChange}
                />
            </div>

            <div className="space-y-2">
                <label className="text-sm font-medium">Facilities (comma separated)</label>
                <input
                    name="facilities"
                    className="flex h-10 w-full rounded-md border border-input px-3 py-2"
                    placeholder="WiFi, Pool, Kitchen, Parking"
                    value={formData.facilities}
                    onChange={handleChange}
                />
            </div>

            <div className="space-y-2">
                <label className="text-sm font-medium">House Rules</label>
                <textarea
                    name="houseRules"
                    className="flex min-h-[80px] w-full rounded-md border border-input px-3 py-2"
                    placeholder="No smoking, No parties..."
                    value={formData.houseRules}
                    onChange={handleChange}
                />
            </div>

            <div className="space-y-2">
                <label className="text-sm font-medium">Photos (URLs comma separated)</label>
                <input
                    name="images"
                    className="flex h-10 w-full rounded-md border border-input px-3 py-2"
                    placeholder="https://..., https://..."
                    value={formData.images}
                    onChange={handleChange}
                />
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Creating..." : "List Property"}
            </Button>
        </form>
    );
}
