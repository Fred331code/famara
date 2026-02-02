
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { PropertyCard } from "@/components/property-card";
import { Upload, X } from "lucide-react";

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
        images: [] as string[], // Array of image URLs
        facilities: [] as string[]
    });

    const FACILITIES = [
        "Wifi", "Kitchen", "Washing machine", "Terrace", "Beach nearby",
        "TV", "Private entrance", "Coffee machine", "Microwave", "Outdoor furniture"
    ];

    const [uploading, setUploading] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files || files.length === 0) return;

        if (formData.images.length + files.length > 12) {
            alert("You can only upload up to 12 images.");
            return;
        }

        setUploading(true);
        const data = new FormData();
        Array.from(files).forEach((file) => {
            data.append("files", file); // key must match API expectation
        });

        try {
            const res = await fetch("/api/upload", {
                method: "POST",
                body: data,
            });

            if (!res.ok) throw new Error("Upload failed");

            const { urls } = await res.json();
            setFormData(prev => ({ ...prev, images: [...prev.images, ...urls] }));
        } catch (err: any) {
            console.error(err);
            alert("Failed to upload image");
        } finally {
            setUploading(false);
        }
    };

    const removeImage = (index: number) => {
        setFormData(prev => ({
            ...prev,
            images: prev.images.filter((_, i) => i !== index)
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            const payload = {
                ...formData,
                pricePerNight: parseFloat(formData.pricePerNight),
                // images is already an array of strings
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

    // Preview Data
    const previewData = {
        id: "preview",
        title: formData.title || "Property Title",
        location: formData.location || "Location",
        price: parseFloat(formData.pricePerNight) || 0,
        rating: 5, // Default for preview
        images: formData.images.length > 0 ? [formData.images[0]] : ["/placeholder.jpg"]
    };

    return (
        <div className="container py-10">
            <div className="flex items-center justify-between mb-8">
                <h1 className="text-3xl font-bold">Add New Property</h1>
                <Link href="/host/properties">
                    <Button variant="outline">Back</Button>
                </Link>
            </div>

            <div className="grid lg:grid-cols-2 gap-8">
                {/* Left Column: Form */}
                <div className="bg-card border p-6 rounded-lg shadow-sm h-fit">
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
                            <label className="text-sm font-medium">Facilities</label>
                            <div className="grid grid-cols-2 gap-2">
                                {FACILITIES.map(fac => (
                                    <label key={fac} className="flex items-center space-x-2 text-sm cursor-pointer border p-2 rounded hover:bg-slate-50">
                                        <input
                                            type="checkbox"
                                            checked={formData.facilities.includes(fac)}
                                            onChange={(e) => {
                                                if (e.target.checked) {
                                                    setFormData(prev => ({ ...prev, facilities: [...prev.facilities, fac] }));
                                                } else {
                                                    setFormData(prev => ({ ...prev, facilities: prev.facilities.filter(f => f !== fac) }));
                                                }
                                            }}
                                            className="rounded border-gray-300"
                                        />
                                        <span>{fac}</span>
                                    </label>
                                ))}
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium">Images (Max 12, 20MB each)</label>
                            <div className="flex items-center gap-4">
                                <label className="cursor-pointer flex items-center justify-center border-2 border-dashed border-slate-300 rounded-lg p-4 hover:bg-slate-50 transition w-full h-24 text-slate-500">
                                    <input
                                        type="file"
                                        multiple
                                        accept="image/*"
                                        className="hidden"
                                        onChange={handleFileUpload}
                                        disabled={uploading}
                                    />
                                    {uploading ? (
                                        <span>Uploading...</span>
                                    ) : (
                                        <div className="flex flex-col items-center gap-1">
                                            <Upload className="w-5 h-5" />
                                            <span className="text-sm">Click to upload</span>
                                        </div>
                                    )}
                                </label>
                            </div>

                            {/* Image Preview List */}
                            {formData.images.length > 0 && (
                                <div className="grid grid-cols-4 gap-2 mt-4">
                                    {formData.images.map((url, index) => (
                                        <div key={index} className="relative group aspect-square rounded overflow-hidden border">
                                            <img src={url} alt="Preview" className="w-full h-full object-cover" />
                                            <button
                                                type="button"
                                                onClick={() => removeImage(index)}
                                                className="absolute top-1 right-1 bg-black/50 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition"
                                            >
                                                <X className="w-3 h-3" />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        <Button type="submit" className="w-full" disabled={loading || uploading}>
                            {loading ? "Creating..." : "Create Property"}
                        </Button>
                    </form>
                </div>

                {/* Right Column: Live Preview */}
                <div className="space-y-4">
                    <h2 className="text-lg font-semibold text-slate-500 uppercase tracking-wider text-sm">Live Preview</h2>
                    <div className="sticky top-24">
                        <PropertyCard {...previewData} />

                        <div className="mt-8 p-4 bg-blue-50 text-blue-800 rounded-lg text-sm">
                            <h3 className="font-bold mb-1">Looking good!</h3>
                            <p>This is exactly how your property will appear in search results.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
