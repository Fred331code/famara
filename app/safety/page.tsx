export default function SafetyPage() {
    return (
        <div className="container py-20 max-w-3xl">
            <h1 className="text-4xl font-bold mb-6">Safety Information</h1>
            <p className="text-slate-600 mb-8">
                Your safety is our top priority. We work with verified hosts and certified instructors.
            </p>
            <ul className="list-disc pl-6 space-y-4 text-slate-700">
                <li>All properties are verified for safety standards.</li>
                <li>Emergency contact numbers are provided upon booking.</li>
                <li>Water sports activities differ in risk; please follow instructor guidelines.</li>
            </ul>
        </div>
    );
}
