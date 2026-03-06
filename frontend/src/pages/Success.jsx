import React from 'react';
import { useSearchParams, Link } from 'react-router-dom';

export default function Success() {
    const [params] = useSearchParams();
    const type = params.get('type') || 'contact';
    const isQuote = type === 'quote';

    const title = isQuote ? 'Quote Request Received!' : 'Message Sent Successfully!';
    const body = isQuote
        ? "Thank you for requesting a free quote. We'll review your project details and get back to you with a price within 2 hours during business hours."
        : "Thank you for contacting Apex Plumbing Co. We've received your message and will get back to you within a few hours during business hours.";

    const steps = [
        isQuote ? 'We receive your quote request' : 'We receive your message',
        isQuote ? 'Our plumber reviews your project details' : 'Our team reads your inquiry',
        isQuote
            ? 'We confirm a price and schedule a time that works for you.'
            : 'We reply to you within a few hours',
    ];

    return (
        <section id="success-page" className="min-h-[70vh] flex items-center justify-center bg-slate-50 py-20">
            <div className="max-w-2xl mx-auto px-4 sm:px-6 text-center">
                {/* Success icon */}
                <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <i className="fas fa-check-circle text-green-500 text-5xl"></i>
                </div>

                <h1 id="success-title" className="text-3xl sm:text-4xl font-extrabold text-slate-900 mb-4">{title}</h1>
                <p id="success-body" className="text-lg text-slate-600 leading-relaxed mb-8"
                    dangerouslySetInnerHTML={{ __html: body.replace('2 hours', '<strong>2 hours</strong>') }} />

                {/* What happens next */}
                <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-7 mb-8 text-left">
                    <h2 className="font-bold text-slate-900 text-lg mb-5">What happens next?</h2>
                    <ul className="space-y-4">
                        {steps.map((step, i) => (
                            <li key={i} className="flex items-start gap-4">
                                <div className="w-8 h-8 rounded-full bg-blue-700 text-white flex items-center justify-center font-bold text-sm flex-shrink-0">
                                    {i + 1}
                                </div>
                                <span id={i === 2 ? 'success-step3' : undefined} className="text-slate-600 pt-1">{step}</span>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Actions */}
                <div className="flex flex-wrap gap-4 justify-center">
                    <Link to="/" className="inline-flex items-center gap-2 bg-blue-700 text-white font-bold px-6 py-3.5 rounded-xl hover:bg-blue-800 transition-colors shadow-sm">
                        <i className="fas fa-home"></i> Back to Home
                    </Link>
                    <a href="tel:+12125550180" className="inline-flex items-center gap-2 border-2 border-slate-300 text-slate-700 font-bold px-6 py-3.5 rounded-xl hover:bg-slate-50 transition-colors">
                        <i className="fas fa-phone text-blue-600"></i> (212) 555-0180
                    </a>
                </div>

                <p className="text-sm text-slate-400 mt-6">
                    Need immediate help? Call us 24/7 at{' '}
                    <a href="tel:+12125550180" className="text-blue-600 font-medium">(212) 555-0180</a>.
                </p>
            </div>
        </section>
    );
}
