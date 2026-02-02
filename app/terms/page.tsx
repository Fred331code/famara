export default function TermsPage() {
    return (
        <div className="container py-20 max-w-3xl">
            <h1 className="text-4xl font-bold mb-6">Terms of Service</h1>
            <p className="text-sm text-slate-500 mb-8">Last updated: February 2026</p>
            <div className="prose prose-slate">
                <p>Welcome to Famara Booking. By using our website, you agree to these terms.</p>
                <h3>1. Bookings</h3>
                <p>All bookings are subject to availability and host confirmation.</p>
                <h3>2. Payments</h3>
                <p>Payments are processed securely via Stripe.</p>
                <h3>3. User Conduct</h3>
                <p>Users must respect local laws and property rules.</p>
            </div>
        </div>
    );
}
