import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API_BASE from '../api';

const inputClass =
    'w-full px-4 py-3 rounded-xl border border-slate-200 text-slate-800 placeholder-slate-400 bg-slate-50 transition-colors text-sm';

const services = [
    'Emergency Plumbing',
    'Drain Cleaning',
    'Water Heater (Install / Repair)',
    'Leak Detection & Repair',
    'Pipe Repair or Replacement',
    'Bathroom or Kitchen Plumbing',
    'Sewer Line Services',
    'Gas Line Services',
    'Commercial Plumbing',
    'Other / Not Sure',
];

export default function Quote() {
    const navigate = useNavigate();
    const [form, setForm] = useState({ name: '', email: '', phone: '', service: '', message: '' });
    const [status, setStatus] = useState(null);

    const handleChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

    const handleSubmit = async e => {
        e.preventDefault();
        setStatus('loading');
        try {
            const res = await fetch(`${API_BASE}/api/quote`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(form),
            });
            const json = await res.json();
            if (json.ok) {
                navigate('/success?type=quote');
            } else {
                setStatus({ error: json.error || 'Something went wrong. Please try again.' });
            }
        } catch {
            setStatus({ error: 'Could not connect to the server. Please call us at (212) 555-0180.' });
        }
    };

    const loading = status === 'loading';

    return (
        <>
            {/* PAGE HEADER */}
            <section className="bg-gradient-to-br from-slate-900 to-blue-900 text-white py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <div className="inline-flex items-center gap-2 bg-blue-800/50 border border-blue-600/40 text-blue-200 rounded-full px-4 py-1.5 text-sm font-medium mb-5">
                        <i className="fas fa-tag text-blue-400 text-xs"></i>
                        100% Free · No Obligation
                    </div>
                    <h1 className="text-4xl sm:text-5xl font-extrabold mb-4">Get Your Free Quote</h1>
                    <p className="text-blue-200 text-lg max-w-xl mx-auto">
                        Tell us about your project and we'll give you an honest, upfront price —
                        no hidden fees, no pressure.
                    </p>
                </div>
            </section>

            {/* QUOTE FORM */}
            <section className="py-16 bg-slate-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">

                        {/* Left: Benefits sidebar */}
                        <div className="lg:col-span-2 space-y-4">
                            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-7">
                                <h2 className="text-xl font-bold text-slate-900 mb-5">Why Get a Quote?</h2>
                                <ul className="space-y-4">
                                    {[
                                        { icon: 'fa-dollar-sign', title: 'Upfront Flat-Rate Pricing', desc: 'We quote the full price before starting. No hourly surprises.' },
                                        { icon: 'fa-bolt', title: 'Fast Response', desc: 'We review requests within 2 hours and can often schedule same-day.' },
                                        { icon: 'fa-lock', title: 'No Obligation', desc: 'A quote is just information — you decide if you want to proceed.' },
                                        { icon: 'fa-tools', title: 'Expert Assessment', desc: 'Our Master Plumber personally reviews complex jobs before quoting.' },
                                    ].map(({ icon, title, desc }) => (
                                        <li key={title} className="flex items-start gap-4">
                                            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                                <i className={`fas ${icon} text-blue-700`}></i>
                                            </div>
                                            <div>
                                                <div className="font-semibold text-slate-900 text-sm">{title}</div>
                                                <div className="text-slate-500 text-sm mt-0.5">{desc}</div>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            <div className="bg-red-50 border border-red-100 rounded-2xl p-6">
                                <div className="flex items-center gap-3 mb-2">
                                    <i className="fas fa-exclamation-triangle text-red-500"></i>
                                    <span className="font-bold text-red-700">Is this an emergency?</span>
                                </div>
                                <p className="text-red-600 text-sm mb-4">
                                    Don't fill out a form — call us directly right now. We dispatch in under 30 minutes.
                                </p>
                                <a href="tel:+12125550180" className="inline-flex items-center gap-2 bg-red-600 text-white font-bold px-4 py-2.5 rounded-lg hover:bg-red-700 transition-colors text-sm">
                                    <i className="fas fa-phone"></i> (212) 555-0180
                                </a>
                            </div>
                        </div>

                        {/* Right: Quote form */}
                        <div className="lg:col-span-3">
                            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-7">
                                <h2 className="text-2xl font-bold text-slate-900 mb-2">Request a Free Quote</h2>
                                <p className="text-slate-500 text-sm mb-7">
                                    The more detail you provide, the more accurate your quote will be.
                                    Fields marked <span className="text-red-500">*</span> are required.
                                </p>

                                {status?.error && (
                                    <div className="flex items-start gap-3 p-4 rounded-xl border bg-red-50 text-red-800 border-red-200 mb-4">
                                        <i className="fas fa-exclamation-circle text-red-500 mt-0.5"></i>
                                        <span>{status.error}</span>
                                    </div>
                                )}

                                <form id="quote-form" onSubmit={handleSubmit} noValidate>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-5">
                                        <div>
                                            <label htmlFor="name" className="block text-sm font-medium text-slate-700 mb-1.5">
                                                Full Name <span className="text-red-500">*</span>
                                            </label>
                                            <input id="name" name="name" type="text" placeholder="Jane Smith" required
                                                value={form.name} onChange={handleChange} className={inputClass} />
                                        </div>
                                        <div>
                                            <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-1.5">
                                                Email Address <span className="text-red-500">*</span>
                                            </label>
                                            <input id="email" name="email" type="email" placeholder="jane@example.com" required
                                                value={form.email} onChange={handleChange} className={inputClass} />
                                        </div>
                                    </div>

                                    <div className="mb-5">
                                        <label htmlFor="phone" className="block text-sm font-medium text-slate-700 mb-1.5">
                                            Phone Number <span className="text-slate-400 font-normal">(optional — speeds up response)</span>
                                        </label>
                                        <input id="phone" name="phone" type="tel" placeholder="(212) 555-0000"
                                            value={form.phone} onChange={handleChange} className={inputClass} />
                                    </div>

                                    <div className="mb-5">
                                        <label htmlFor="service" className="block text-sm font-medium text-slate-700 mb-1.5">
                                            Service Type <span className="text-slate-400 font-normal">(select the closest match)</span>
                                        </label>
                                        <select id="service" name="service"
                                            value={form.service} onChange={handleChange}
                                            className={inputClass}>
                                            <option value="">— Select a service —</option>
                                            {services.map(s => (
                                                <option key={s} value={s}>{s}</option>
                                            ))}
                                        </select>
                                    </div>

                                    <div className="mb-6">
                                        <label htmlFor="message" className="block text-sm font-medium text-slate-700 mb-1.5">
                                            Project Details <span className="text-red-500">*</span>
                                        </label>
                                        <textarea id="message" name="message" rows="5" required
                                            placeholder="Describe the issue or project in as much detail as you can. Include the location in your home/building, how long it's been happening, and any relevant background."
                                            value={form.message} onChange={handleChange}
                                            className={`${inputClass} resize-none`} />
                                    </div>

                                    <button
                                        id="quote-submit"
                                        type="submit"
                                        disabled={loading}
                                        className="w-full bg-blue-700 text-white font-bold py-3.5 rounded-xl hover:bg-blue-800 transition-colors shadow-sm flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                                    >
                                        {loading
                                            ? <><i className="fas fa-spinner fa-spin"></i> Sending…</>
                                            : <><i className="fas fa-paper-plane"></i> Submit Quote Request</>}
                                    </button>

                                    <p className="text-xs text-slate-400 text-center mt-3">
                                        We'll review your request and respond within 2 hours during business hours.
                                    </p>
                                </form>
                            </div>
                        </div>

                    </div>
                </div>
            </section>
        </>
    );
}
