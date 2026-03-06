import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API_BASE from '../api';

const inputClass =
    'w-full px-4 py-3 rounded-xl border border-slate-200 text-slate-800 placeholder-slate-400 bg-slate-50 transition-colors text-sm';

export default function Contact() {
    const navigate = useNavigate();
    const [form, setForm] = useState({ name: '', email: '', phone: '', message: '' });
    const [status, setStatus] = useState(null); // null | 'loading' | { error: string }

    const handleChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

    const handleSubmit = async e => {
        e.preventDefault();
        setStatus('loading');
        try {
            const res = await fetch(`${API_BASE}/api/contact`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(form),
            });
            const json = await res.json();
            if (json.ok) {
                navigate('/success?type=contact');
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
                    <h1 className="text-4xl sm:text-5xl font-extrabold mb-4">Contact Us</h1>
                    <p className="text-blue-200 text-lg max-w-xl mx-auto">
                        Have a question or need a plumber? Send us a message and we'll get back to you fast.
                        For emergencies, call us directly — we're available 24/7.
                    </p>
                </div>
            </section>

            {/* CONTACT SECTION */}
            <section className="py-16 bg-slate-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">

                        {/* Left: Contact info */}
                        <div className="lg:col-span-2 space-y-6">
                            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-7">
                                <h2 className="text-2xl font-bold text-slate-900 mb-6">Get In Touch</h2>
                                <div className="space-y-5">
                                    {[
                                        { icon: 'fa-phone', title: 'Phone', content: <a href="tel:+12125550180" className="text-blue-600 hover:text-blue-800 font-medium">(212) 555-0180</a>, sub: 'Available 24/7 for emergencies' },
                                        { icon: 'fa-envelope', title: 'Email', content: <a href="mailto:info@apexplumbingnyc.com" className="text-blue-600 hover:text-blue-800 font-medium break-all">info@apexplumbingnyc.com</a>, sub: 'We reply within a few hours' },
                                        { icon: 'fa-map-marker-alt', title: 'Office Address', content: <div className="text-slate-600">123 Plumber's Way, Suite 4B<br />New York, NY 10001</div>, sub: null },
                                        { icon: 'fa-clock', title: 'Business Hours', content: <div className="text-slate-600 text-sm space-y-0.5 mt-1"><div>Mon – Fri: 7:00am – 8:00pm</div><div>Sat – Sun: 8:00am – 6:00pm</div><div className="text-blue-600 font-semibold mt-1">24/7 Emergency Line</div></div>, sub: null },
                                    ].map(({ icon, title, content, sub }) => (
                                        <div key={title} className="flex items-start gap-4">
                                            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                                <i className={`fas ${icon} text-blue-700`}></i>
                                            </div>
                                            <div>
                                                <div className="font-semibold text-slate-900 text-sm">{title}</div>
                                                {content}
                                                {sub && <div className="text-xs text-slate-400 mt-0.5">{sub}</div>}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="bg-blue-900 rounded-2xl p-6 text-white">
                                <h3 className="font-semibold mb-4">Follow Us</h3>
                                <div className="flex gap-3">
                                    {[
                                        { icon: 'fa-instagram', label: 'Instagram' },
                                        { icon: 'fa-facebook-f', label: 'Facebook' },
                                        { icon: 'fa-linkedin-in', label: 'LinkedIn' },
                                    ].map(({ icon, label }) => (
                                        <a key={label} href={`#${label.toLowerCase()}`} aria-label={label}
                                            className="flex items-center gap-2 bg-white/10 hover:bg-white/20 px-4 py-2 rounded-lg transition-colors text-sm">
                                            <i className={`fab ${icon}`}></i> {label}
                                        </a>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Right: Contact form */}
                        <div className="lg:col-span-3">
                            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-7">
                                <h2 className="text-2xl font-bold text-slate-900 mb-2">Send Us a Message</h2>
                                <p className="text-slate-500 text-sm mb-7">
                                    Fill in the form below and we'll get back to you within a few hours.
                                    Fields marked <span className="text-red-500">*</span> are required.
                                </p>

                                {status?.error && (
                                    <div className="flex items-start gap-3 p-4 rounded-xl border bg-red-50 text-red-800 border-red-200 mb-4">
                                        <i className="fas fa-exclamation-circle text-red-500 mt-0.5"></i>
                                        <span>{status.error}</span>
                                    </div>
                                )}

                                <form id="contact-form" onSubmit={handleSubmit} noValidate>
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
                                            Phone Number <span className="text-slate-400 font-normal">(optional)</span>
                                        </label>
                                        <input id="phone" name="phone" type="tel" placeholder="(212) 555-0000"
                                            value={form.phone} onChange={handleChange} className={inputClass} />
                                    </div>

                                    <div className="mb-6">
                                        <label htmlFor="message" className="block text-sm font-medium text-slate-700 mb-1.5">
                                            Message <span className="text-red-500">*</span>
                                        </label>
                                        <textarea id="message" name="message" rows="5" required
                                            placeholder="Describe your plumbing issue or question..."
                                            value={form.message} onChange={handleChange}
                                            className={`${inputClass} resize-none`} />
                                    </div>

                                    <button
                                        id="contact-submit"
                                        type="submit"
                                        disabled={loading}
                                        className="w-full bg-blue-700 text-white font-bold py-3.5 rounded-xl hover:bg-blue-800 transition-colors shadow-sm flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                                    >
                                        {loading
                                            ? <><i className="fas fa-spinner fa-spin"></i> Sending…</>
                                            : <><i className="fas fa-paper-plane"></i> Send Message</>}
                                    </button>

                                    <p className="text-xs text-slate-400 text-center mt-3">
                                        We respond within a few hours during business hours.
                                        For emergencies, please call{' '}
                                        <a href="tel:+12125550180" className="text-blue-600">(212) 555-0180</a>.
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
