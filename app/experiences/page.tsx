
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { Metadata } from "next";
import { EXPERIENCES } from "@/lib/experiences";

export const metadata: Metadata = {
    title: "Experiences | Hotel In Lanzarote",
    description: "Book premium water sports lessons in Famara: Kitesurfing, Wing Foiling, and Surfing.",
};

export default function ExperiencesPage() {
    return (
        <div className="min-h-screen bg-slate-50">
            {/* Hero Section */}
            <div className="relative h-[50vh] bg-slate-900 flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0 z-0">
                    <img
                        src="https://images.unsplash.com/photo-1544551763-46a013bb70d5?q=80&w=2070&auto=format&fit=crop"
                        alt="Water Sports"
                        className="w-full h-full object-cover opacity-60"
                    />
                </div>
                <div className="relative z-10 text-center text-white px-4">
                    <h1 className="text-4xl md:text-6xl font-bold mb-4">Unforgettable Experiences</h1>
                    <p className="text-xl md:text-2xl font-light text-slate-200 max-w-2xl mx-auto">
                        Discover the thrill of Famara with our premium water sports academy.
                    </p>
                </div>
            </div>

            {/* Content Grid */}
            <div className="container px-4 py-20 relative z-20">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                    {EXPERIENCES.map((exp) => (
                        <div key={exp.slug} className="bg-white rounded-2xl border border-slate-100 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 overflow-hidden flex flex-col group">
                            <div className="h-72 overflow-hidden relative">
                                <img
                                    src={exp.image}
                                    alt={exp.title}
                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                />
                                <div className="absolute top-6 right-6 bg-white/95 backdrop-blur-md px-4 py-2 rounded-full text-sm font-bold text-slate-900 shadow-sm border border-slate-100/50">
                                    {exp.price}
                                </div>
                            </div>

                            <div className="p-10 flex flex-col flex-1">
                                <div className="flex items-center gap-4 mb-6">
                                    <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
                                        <exp.icon className="w-6 h-6" />
                                    </div>
                                    <span className="text-xs font-semibold text-slate-400 uppercase tracking-widest">
                                        {exp.duration}
                                    </span>
                                </div>

                                <h3 className="text-3xl font-bold text-slate-900 mb-4 tracking-tight">{exp.title}</h3>
                                <p className="text-slate-600 leading-relaxed mb-10 flex-1 text-lg">
                                    {exp.shortDescription}
                                </p>

                                <Link href={`/experiences/${exp.slug}`} className="mt-auto">
                                    <Button className="w-full group bg-slate-900 hover:bg-blue-600 text-white transition-colors duration-300 py-6 text-lg rounded-xl">
                                        View Details <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                                    </Button>
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* CTA Section */}
            <div className="container px-4 pb-20 text-center">
                <div className="bg-blue-600 rounded-2xl p-12 text-white">
                    <h2 className="text-3xl font-bold mb-4">Not sure which one to choose?</h2>
                    <p className="text-blue-100 mb-8 max-w-xl mx-auto">
                        Our instructors can help assess your level and conditions to recommend the perfect session for you.
                    </p>
                    <Link href="mailto:info@volcanokite.com">
                        <Button variant="secondary" size="lg" className="bg-white text-blue-600 hover:bg-blue-50 border-none">
                            Contact Us
                        </Button>
                    </Link>
                </div>
            </div>
        </div>
    );
}
