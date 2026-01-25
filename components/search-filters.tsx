import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";

export function SearchFilters() {
    return (
        <div className="space-y-6">
            <div>
                <h3 className="text-lg font-semibold mb-4">Price Range</h3>
                <Slider defaultValue={[50, 500]} max={1000} step={10} className="mb-2" />
                <div className="flex justify-between text-sm text-slate-500">
                    <span>€50</span>
                    <span>€500+</span>
                </div>
            </div>

            <Separator />

            <div>
                <h3 className="text-lg font-semibold mb-4">Property Type</h3>
                <div className="space-y-3">
                    {["Apartment", "House", "Villa", "Guesthouse", "Hotel"].map((type) => (
                        <div key={type} className="flex items-center space-x-2">
                            <Checkbox id={`type-${type}`} />
                            <Label htmlFor={`type-${type}`} className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                {type}
                            </Label>
                        </div>
                    ))}
                </div>
            </div>

            <Separator />

            <div>
                <h3 className="text-lg font-semibold mb-4">Amenities</h3>
                <div className="space-y-3">
                    {["Wifi", "Kitchen", "Pool", "Air conditioning", "Pet friendly", "Beach access"].map((amenity) => (
                        <div key={amenity} className="flex items-center space-x-2">
                            <Checkbox id={`amenity-${amenity}`} />
                            <Label htmlFor={`amenity-${amenity}`} className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                {amenity}
                            </Label>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
