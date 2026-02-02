
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Trash2, Upload, Plus } from "lucide-react";

interface PropertyImage {
    id?: string; // Optional for optimistic updates
    url: string;
    caption: string;
}

interface ImageGalleryProps {
    images: PropertyImage[];
    onChange: (images: PropertyImage[]) => void;
}

export function ImageGallery({ images, onChange }: ImageGalleryProps) {
    const [uploading, setUploading] = useState(false);

    const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files?.length) return;
        setUploading(true);

        const formData = new FormData();
        Array.from(e.target.files).forEach((file) => {
            formData.append("files", file);
        });

        try {
            const res = await fetch("/api/upload", {
                method: "POST",
                body: formData,
            });

            if (!res.ok) throw new Error("Upload failed");

            const data = await res.json();
            const newImages: PropertyImage[] = data.urls.map((url: string) => ({
                url,
                caption: "",
            }));

            onChange([...images, ...newImages]);
        } catch (error) {
            console.error(error);
            alert("Failed to upload images");
        } finally {
            setUploading(false);
            // Reset input
            e.target.value = "";
        }
    };

    const handleDelete = (index: number) => {
        const newImages = [...images];
        newImages.splice(index, 1);
        onChange(newImages);
    };

    const handleCaptionChange = (index: number, caption: string) => {
        const newImages = [...images];
        newImages[index].caption = caption;
        onChange(newImages);
    };

    return (
        <div className="space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {images.map((img, index) => (
                    <div key={index} className="group relative border rounded-lg overflow-hidden bg-slate-50">
                        <div className="aspect-video relative">
                            <img
                                src={img.url}
                                alt={img.caption || "Property Image"}
                                className="w-full h-full object-cover"
                            />
                            <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                <Button
                                    variant="destructive"
                                    size="icon"
                                    className="h-8 w-8"
                                    type="button" // Prevent form submit
                                    onClick={() => handleDelete(index)}
                                >
                                    <Trash2 className="w-4 h-4" />
                                </Button>
                            </div>
                        </div>
                        <div className="p-2">
                            <input
                                placeholder="Add a caption..."
                                className="w-full text-sm border-none bg-transparent focus:outline-none focus:ring-1 focus:ring-blue-500 rounded px-1"
                                value={img.caption || ""}
                                onChange={(e) => handleCaptionChange(index, e.target.value)}
                            />
                        </div>
                    </div>
                ))}

                {/* Upload Button */}
                <div className="border-2 border-dashed rounded-lg flex flex-col items-center justify-center p-4 aspect-video hover:bg-slate-50 transition-colors cursor-pointer relative">
                    <input
                        type="file"
                        multiple
                        accept="image/*"
                        className="absolute inset-0 opacity-0 cursor-pointer"
                        onChange={handleUpload}
                        disabled={uploading}
                    />
                    <div className="text-center">
                        {uploading ? (
                            <span className="text-sm text-slate-500">Uploading...</span>
                        ) : (
                            <>
                                <Plus className="w-8 h-8 mx-auto text-slate-400 mb-2" />
                                <span className="text-sm font-medium text-slate-600 block">Add Photos</span>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
