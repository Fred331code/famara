
import { EXPERIENCES } from "@/lib/experiences";
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ExperienceReservationDialog } from "@/components/experience-reservation-dialog";
import Link from "next/link";
import { ArrowLeft, CheckCircle2 } from "lucide-react";
import { Metadata } from "next";

interface Props {
    params: {
        slug: string;
    }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const exp = EXPERIENCES.find(e => e.slug === params.slug);
    if (!exp) return { title: "Not Found" };
    return {
        title: `${exp.title} | Hotel In Lanzarote`,
        description: exp.shortDescription,
    };
}

export default function ExperienceDetailPage({ params }: Props) {
    const exp = EXPERIENCES.find(e => e.slug === params.slug);

    if (!exp) {
        notFound();
    }

    return (
        <div className="min-h-screen bg-white">
            {/* Hero */}
            <div className="relative h-[60vh] w-full bg-slate-900">
                <img
                    src={exp.image}
                    alt={exp.title}
                    className="w-full h-full object-cover opacity-80"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                <div className="absolute bottom-0 left-0 w-full p-8 md:p-16 text-white">
                    <div className="container mx-auto">
                        <Link href="/experiences" className="inline-flex items-center text-slate-300 hover:text-white mb-6 transition-colors">
                            <ArrowLeft className="w-4 h-4 mr-2" /> Back to experiences
                        </Link>
                        <h1 className="text-4xl md:text-6xl font-bold mb-4">{exp.title}</h1>
                        <div className="flex items-center gap-4 text-lg">
                            <span className="bg-blue-600 px-4 py-1 rounded-full font-bold">{exp.price}</span>
                            <span className="text-slate-300 border-l border-slate-600 pl-4">{exp.duration}</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="container mx-auto px-4 py-16 grid grid-cols-1 lg:grid-cols-3 gap-12">
                <div className="lg:col-span-2 space-y-8">
                    <div className="prose prose-lg max-w-none text-slate-600">
                        <h2 className="text-3xl font-bold text-slate-900 mb-6">About this experience</h2>
                        <div className="whitespace-pre-line leading-relaxed">
                            {exp.longDescription}
                        </div>
                    </div>

                    <div className="bg-slate-50 p-8 rounded-xl">
                        <h3 className="text-xl font-bold mb-4">What to bring</h3>
                        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            {["Swimsuit", "Towel", "Sunscreen (Waterproof)", "Water & Snacks", "Warm clothes (for after)", "GoPro (optional)"].map(item => (
                                <li key={item} className="flex items-center text-slate-600">
                                    <CheckCircle2 className="w-4 h-4 text-green-500 mr-2" />
                                    {item}
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                <div className="lg:col-span-1">
                    <div className="sticky top-24 border rounded-xl p-6 shadow-sm bg-white">
                        <h3 className="text-xl font-bold mb-2">Book your session</h3>
                        <p className="text-slate-500 text-sm mb-6">Secure your spot with Volcanokite Academy.</p>


                        <div className="space-y-4">
                            <div className="flex justify-between py-3 border-b">
                                <span className="text-slate-600">Lesson Price</span>
                                <span className="font-medium">{exp.price}</span>
                            </div>
                            <div className="flex justify-between py-3 border-b">
                                <span className="text-slate-600">Duration</span>
                                <span className="font-medium">{exp.duration}</span>
                            </div>

                            <ExperienceReservationDialog
                                experienceTitle={exp.title}
                                price={exp.price}
                            />

                            <p className="text-xs text-center text-slate-400 mt-2">
                                You won't be charged yet. We'll confirm availability first.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
