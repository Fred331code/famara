
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { format } from "date-fns";
import { Calendar as CalendarIcon, Trash2, RefreshCw } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { ImageGallery } from "@/components/host/image-gallery";
import { PropertyDisplay } from "@/components/property/property-display";

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
    const [activeTab, setActiveTab] = useState<"details" | "availability">("details");

    const [formData, setFormData] = useState({
        title: "",
        description: "",
        location: "",
        address: "", // New private field
        contactEmail: "", // New private field
        contactPhone: "", // New private field
        pricePerNight: "",
        maxGuests: "2",
        icalUrl: ""
    });

    // Image state: { url, caption }
    const [images, setImages] = useState<any[]>([]);

    const [bookings, setBookings] = useState<any[]>([]);

    const fetchProperty = async () => {
        try {
            const res = await fetch(`/api/host/properties/${params.id}`);
            if (!res.ok) throw new Error("Failed to load property");
            const data = await res.json();

            setFormData({
                title: data.title,
                description: data.description || "",
                location: data.location,
                address: data.address || "",
                contactEmail: data.contactEmail || "",
                contactPhone: data.contactPhone || "",
                pricePerNight: data.pricePerNight,
                maxGuests: data.maxGuests.toString(),
                icalUrl: data.icalUrl || ""
            });

            // Handle Lazy Migration for Images
            let loadedImages = data.propertyImages || [];
            if (loadedImages.length === 0 && data.images && data.images.length > 0) {
                loadedImages = data.images.map((url: string) => ({ url, caption: "Uploaded" }));
            }
            setImages(loadedImages);
            setBookings(data.bookings || []);
        } catch (err) {
            setError("Could not load property details");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
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
                images: images
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

    // Availability Handlers
    const [blockStart, setBlockStart] = useState("");
    const [blockEnd, setBlockEnd] = useState("");
    const [syncing, setSyncing] = useState(false);

    const handleSync = async () => {
        setSyncing(true);
        try {
            // First save URL if changed (optional, but good practice)
            // For now, assume user might have typed it. We send it in body.
            const res = await fetch(`/api/host/properties/${params.id}/sync-ical`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ icalUrl: formData.icalUrl })
            });

            if (!res.ok) {
                const text = await res.text();
                let errorMsg = `Server Error (${res.status})`;
                try {
                    const data = JSON.parse(text);
                    if (data.error) errorMsg = data.error;
                } catch {
                    // ignore json parse error
                    errorMsg += `: ${text.substring(0, 50)}`;
                }
                throw new Error(errorMsg);
            }

            await fetchProperty(); // Refresh bookings
            alert("Calendar synced successfully!");
        } catch (err: any) {
            console.error(err);
            alert(`Sync Error: ${err.message}`);
        } finally {
            setSyncing(false);
        }
    };

    const handleBlock = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const res = await fetch(`/api/host/properties/${params.id}/availability`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ startDate: blockStart, endDate: blockEnd })
            });

            if (!res.ok) {
                const d = await res.json();
                throw new Error(d.error);
            }

            setBlockStart("");
            setBlockEnd("");
            await fetchProperty();
        } catch (err: any) {
            alert(err.message);
        }
    };

    const handleUnblock = async (bookingId: string) => {
        if (!confirm("Are you sure you want to unblock these dates?")) return;
        try {
            const res = await fetch(`/api/host/properties/${params.id}/availability?bookingId=${bookingId}`, {
                method: "DELETE"
            });
            if (!res.ok) throw new Error("Failed");
            await fetchProperty();
        } catch (err) {
            alert("Failed to unblock");
        }
    };

    if (loading) return <div className="p-8 text-center">Loading...</div>;

    return (
        <div className="container max-w-7xl py-10">
            <div className="flex items-center justify-between mb-8">
                <h1 className="text-3xl font-bold">Edit Property</h1>
                <Link href="/host/properties">
                    <Button variant="outline">Back</Button>
                </Link>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                {/* Left Column: Live Preview */}
                <div className="hidden lg:block relative">
                    <div className="sticky top-24 border rounded-xl overflow-hidden shadow-sm bg-white p-6">
                        <h2 className="text-lg font-semibold mb-6 text-slate-400 uppercase tracking-wider text-xs">Live Preview</h2>
                        <div className="pointer-events-none opacity-90 scale-95 origin-top">
                            <PropertyDisplay
                                title={formData.title}
                                location={formData.location}
                                description={formData.description}
                                images={images.map(img => img.url)}
                                pricePerNight={parseFloat(formData.pricePerNight) || 0}
                                maxGuests={parseInt(formData.maxGuests) || 0}
                                preview={true}
                            />
                        </div>
                    </div>
                </div>

                {/* Right Column: Edit Form */}
                <div className="bg-card border p-6 rounded-lg shadow-sm bg-white">
                    {/* Tabs */}
                    <div className="flex gap-4 border-b mb-6">
                        <button
                            onClick={() => setActiveTab("details")}
                            className={`pb-2 px-4 font-medium transition-colors ${activeTab === 'details' ? 'border-b-2 border-black text-black' : 'text-slate-500 hover:text-slate-700'}`}
                        >
                            Details
                        </button>
                        <button
                            onClick={() => setActiveTab("availability")}
                            className={`pb-2 px-4 font-medium transition-colors ${activeTab === 'availability' ? 'border-b-2 border-black text-black' : 'text-slate-500 hover:text-slate-700'}`}
                        >
                            Availability
                        </button>
                    </div>

                    {activeTab === "details" ? (
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

                            <div className="bg-amber-50 p-4 rounded-lg border border-amber-200">
                                <h3 className="font-semibold text-amber-900 mb-3 text-sm">Private Host Details (Only shared with confirmed guests)</h3>
                                <div className="space-y-4">
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">Full Address (Exact location)</label>
                                        <input
                                            required
                                            name="address"
                                            placeholder="e.g. Calle San Borondón 45, 3B"
                                            className="flex h-10 w-full rounded-md border border-input px-3 py-2 bg-white"
                                            value={formData.address}
                                            onChange={handleChange}
                                        />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium">Contact Email</label>
                                            <input
                                                required
                                                type="email"
                                                name="contactEmail"
                                                className="flex h-10 w-full rounded-md border border-input px-3 py-2 bg-white"
                                                value={formData.contactEmail}
                                                onChange={handleChange}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium">Contact Phone</label>
                                            <input
                                                required
                                                type="tel"
                                                name="contactPhone"
                                                className="flex h-10 w-full rounded-md border border-input px-3 py-2 bg-white"
                                                value={formData.contactPhone}
                                                onChange={handleChange}
                                            />
                                        </div>
                                    </div>
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
                                <div className="space-y-4">
                                    <label className="text-sm font-medium">Images</label>
                                    <ImageGallery images={images} onChange={setImages} />
                                </div>
                            </div>

                            <Button type="submit" className="w-full" disabled={saving}>
                                {saving ? "Saving..." : "Save Changes"}
                            </Button>
                        </form>
                    ) : (
                        <div className="space-y-8">
                            {/* iCal Sync Section */}
                            <div className="space-y-4">
                                <h3 className="font-semibold text-lg flex items-center gap-2">
                                    <RefreshCw className="w-4 h-4" />
                                    Sync Calendars
                                </h3>

                                {/* Export Section */}
                                <div className="bg-blue-50 p-4 rounded-lg border border-blue-100 mb-4">
                                    <h4 className="font-medium text-sm text-blue-900 mb-2">Export Calendar (iCal)</h4>
                                    <p className="text-xs text-blue-700 mb-3">
                                        Share this URL with other platforms (Airbnb, Booking.com) to block dates booked here.
                                    </p>
                                    <div className="flex gap-2">
                                        <input
                                            readOnly
                                            className="flex h-9 w-full rounded-md border border-blue-200 bg-white px-3 py-1 text-sm text-slate-500"
                                            value={`${typeof window !== 'undefined' ? window.location.origin : ''}/api/ical/${params.id}`}
                                        />
                                        <Button
                                            variant="secondary"
                                            size="sm"
                                            onClick={() => {
                                                navigator.clipboard.writeText(`${window.location.origin}/api/ical/${params.id}`);
                                                alert("URL copied to clipboard!");
                                            }}
                                        >
                                            Copy
                                        </Button>
                                    </div>
                                </div>

                                {/* Import Section */}
                                <div className="space-y-2">
                                    <h4 className="font-medium text-sm">Import Calendar</h4>
                                    <div className="flex gap-2">
                                        <input
                                            name="icalUrl"
                                            placeholder="Paste Airbnb/Booking.com iCal URL"
                                            className="flex h-10 w-full rounded-md border border-input px-3 py-2"
                                            value={formData.icalUrl}
                                            onChange={handleChange}
                                        />
                                        <Button onClick={handleSync} disabled={syncing}>
                                            {syncing ? "Syncing..." : "Sync"}
                                        </Button>
                                    </div>
                                    <p className="text-xs text-slate-500">
                                        Paste a calendar URL from other platforms to automatically block booked dates.
                                    </p>
                                </div>
                            </div>

                            <hr />

                            {/* Manual Block Section */}
                            <div className="space-y-4">
                                <h3 className="font-semibold text-lg flex items-center gap-2">
                                    <CalendarIcon className="w-4 h-4" />
                                    Block Dates
                                </h3>
                                <form onSubmit={handleBlock} className="flex gap-2 items-end">
                                    <div className="space-y-1">
                                        <label className="text-xs font-semibold uppercase text-slate-500">Start Date</label>
                                        <input
                                            type="date"
                                            required
                                            className="flex h-10 rounded-md border border-input px-3 py-2"
                                            value={blockStart}
                                            onChange={e => setBlockStart(e.target.value)}
                                        />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-xs font-semibold uppercase text-slate-500">End Date</label>
                                        <input
                                            type="date"
                                            required
                                            className="flex h-10 rounded-md border border-input px-3 py-2"
                                            value={blockEnd}
                                            onChange={e => setBlockEnd(e.target.value)}
                                        />
                                    </div>
                                    <Button type="submit" variant="secondary">Block</Button>
                                </form>
                            </div>

                            <hr />

                            {/* Bookings / Blocks List */}
                            <div className="space-y-4">
                                <h3 className="font-semibold text-lg">Calendar</h3>

                                <div className="flex justify-center border rounded-lg p-4 bg-slate-50">
                                    <Calendar
                                        numberOfMonths={2}
                                        modifiers={{
                                            blocked: (date) => bookings.some(b => b.status === 'BLOCKED' && date >= new Date(b.startDate) && date <= new Date(b.endDate)),
                                            booked: (date) => bookings.some(b => b.status === 'CONFIRMED' && date >= new Date(b.startDate) && date <= new Date(b.endDate)),
                                        }}
                                        modifiersStyles={{
                                            blocked: { textDecoration: "line-through", color: "red", backgroundColor: "#fee2e2" },
                                            booked: { backgroundColor: "#dcfce7", color: "#166534", fontWeight: "bold" }
                                        }}
                                    />
                                </div>

                                {bookings.length === 0 ? (
                                    <p className="text-slate-500 text-sm">No bookings or blocks found.</p>
                                ) : (
                                    <div className="border rounded-lg divide-y">
                                        {bookings
                                            .sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime())
                                            .map((booking) => (
                                                <div key={booking.id} className="p-4 flex items-center justify-between">
                                                    <div>
                                                        <div className="font-medium">
                                                            {format(new Date(booking.startDate), "MMM dd")} - {format(new Date(booking.endDate), "MMM dd, yyyy")}
                                                        </div>
                                                        <div className={`text-xs font-semibold px-2 py-0.5 rounded-full inline-block mt-1 ${booking.status === 'BLOCKED' ? 'bg-slate-100 text-slate-600' : 'bg-green-100 text-green-700'
                                                            }`}>
                                                            {booking.status}
                                                        </div>
                                                    </div>
                                                    {booking.status === 'BLOCKED' && (
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            className="text-red-500 hover:bg-red-50"
                                                            onClick={() => handleUnblock(booking.id)}
                                                        >
                                                            <Trash2 className="w-4 h-4" />
                                                        </Button>
                                                    )}
                                                </div>
                                            ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
