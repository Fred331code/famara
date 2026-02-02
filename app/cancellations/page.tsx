export default function CancellationsPage() {
    return (
        <div className="container py-20 max-w-3xl">
            <h1 className="text-4xl font-bold mb-6">Cancellation Options</h1>
            <p className="text-slate-600 mb-4">
                We understand that plans can change. Here you can find information about our cancellation policies.
            </p>
            <div className="bg-slate-50 p-6 rounded-xl border border-slate-100">
                <h2 className="text-xl font-bold mb-2">Standard Policy</h2>
                <p className="text-slate-500">
                    Most bookings can be cancelled for a full refund up to 14 days before check-in.
                    Please check your specific booking confirmation for details.
                </p>
            </div>
        </div>
    );
}
