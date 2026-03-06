import React from 'react';
import { Link } from 'react-router-dom';

const reviews = [
    { initials: 'JM', color: 'bg-blue-900', name: 'John M.', location: 'Manhattan, NY', text: '"Called Apex at 2am when our basement started flooding. They arrived in under 20 minutes and had everything fixed within the hour. Absolute lifesavers — I can\'t recommend them enough."' },
    { initials: 'ST', color: 'bg-blue-700', name: 'Sarah T.', location: 'Brooklyn, NY', text: '"Mike replaced our water heater and updated the kitchen pipes. Professional, spotlessly clean, and the price was very fair. Won\'t be calling anyone else."' },
    { initials: 'DR', color: 'bg-blue-600', name: 'David R.', location: 'Queens, NY', text: '"I\'ve hired Apex three times now — never once disappointed. They always explain exactly what they\'re doing before they start, and the work is always done right the first time."' },
    { initials: 'MG', color: 'bg-blue-500', name: 'Maria G.', location: 'The Bronx, NY', text: '"Our bathroom drain was completely blocked and backing up. The tech came the same day, cleared it in under an hour, and didn\'t leave a single trace of mess. Highly recommended."' },
    { initials: 'TK', color: 'bg-blue-400', name: 'Tom K.', location: 'Staten Island, NY', text: '"Great communication from start to finish, fair pricing, and they showed up right on time. In New York City, that alone is a miracle. Definitely my go-to plumber."' },
    { initials: 'LP', color: 'bg-slate-700', name: 'Linda P.', location: 'Brooklyn, NY', text: '"Had a serious leak under the kitchen sink that two other plumbers couldn\'t figure out. Apex found and fixed it in 45 minutes. These guys genuinely know their stuff."' },
];

const faqs = [
    { q: 'How much does a plumber cost in NYC?', a: 'Standard rates in NYC range from $100–$200 per hour depending on the job. Emergency and after-hours calls may include a dispatch fee. We always provide an upfront flat-rate quote before starting — no hidden charges.' },
    { q: 'Do you offer 24/7 emergency plumbing?', a: 'Yes — we have plumbers on call every night, weekend, and holiday. Call (212) 555-0180 any time and we\'ll dispatch someone within 30 minutes anywhere in the five boroughs.' },
    { q: 'Are you licensed and insured in New York?', a: 'Absolutely. We hold a NY State Master Plumber License (#MPL-1247-NY) and carry $2 million in general liability insurance. We\'re also fully bonded. We\'re happy to provide proof of insurance upon request.' },
    { q: 'What areas of NYC do you serve?', a: 'All five boroughs: Manhattan, Brooklyn, Queens, The Bronx, and Staten Island. We also cover parts of Nassau County and nearby New Jersey on a case-by-case basis.' },
];

export default function Home() {
    return (
        <>
            {/* HERO */}
            <section className="relative bg-gradient-to-br from-slate-900 via-blue-950 to-blue-900 text-white overflow-hidden">
                <div
                    className="absolute inset-0 pointer-events-none opacity-20"
                    style={{
                        background:
                            'radial-gradient(ellipse at 20% 60%, #3b82f6 0%, transparent 55%), radial-gradient(ellipse at 80% 10%, #1d4ed8 0%, transparent 45%)',
                    }}
                />
                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28">
                    <div className="max-w-2xl">
                        <div className="inline-flex items-center gap-2 bg-blue-800/50 border border-blue-600/40 text-blue-200 rounded-full px-4 py-1.5 text-sm font-medium mb-6">
                            <i className="fas fa-star text-yellow-400 text-xs"></i>
                            Rated 4.9 / 5.0 · Over 500 Google Reviews
                        </div>
                        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-tight mb-5">
                            NYC's Most Trusted
                            <span className="text-blue-400"> Plumbing Service</span>
                        </h1>
                        <p className="text-lg sm:text-xl text-blue-100 mb-8 leading-relaxed">
                            Licensed, insured professionals available <strong>24/7</strong>.
                            We arrive in under 30 minutes and serve all five NYC boroughs —
                            Manhattan, Brooklyn, Queens, The Bronx, and Staten Island.
                        </p>
                        <div className="flex flex-wrap gap-4">
                            <a
                                href="tel:+12125550180"
                                className="inline-flex items-center gap-3 bg-white text-blue-900 font-bold px-6 py-3.5 rounded-xl hover:bg-blue-50 transition-all shadow-lg text-base sm:text-lg"
                            >
                                <span className="w-9 h-9 bg-blue-900 rounded-full flex items-center justify-center flex-shrink-0">
                                    <i className="fas fa-phone text-white text-sm"></i>
                                </span>
                                (212) 555-0180
                            </a>
                            <Link
                                to="/quote"
                                className="inline-flex items-center gap-2 border-2 border-white/70 text-white font-bold px-6 py-3.5 rounded-xl hover:bg-white/10 hover:border-white transition-all text-base sm:text-lg"
                            >
                                <i className="fas fa-file-alt"></i>
                                Get Free Quote
                            </Link>
                        </div>
                        <div className="flex flex-wrap gap-5 mt-8 text-sm text-blue-200">
                            <span className="flex items-center gap-2"><i className="fas fa-shield-alt text-blue-400"></i> Licensed &amp; Insured</span>
                            <span className="flex items-center gap-2"><i className="fas fa-clock text-blue-400"></i> 24/7 Emergency</span>
                            <span className="flex items-center gap-2"><i className="fas fa-map-marker-alt text-blue-400"></i> All 5 Boroughs</span>
                            <span className="flex items-center gap-2"><i className="fas fa-award text-blue-400"></i> 30+ Years Experience</span>
                        </div>
                    </div>
                </div>
            </section>

            {/* STATS BAR */}
            <section className="bg-blue-700 text-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-7">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
                        {[
                            { stat: '30+', label: 'Years in Business' },
                            { stat: '5,000+', label: 'Jobs Completed' },
                            { stat: '4.9★', label: 'Average Rating' },
                            { stat: '24/7', label: 'Emergency Service' },
                        ].map(({ stat, label }) => (
                            <div key={label}>
                                <div className="text-3xl font-extrabold">{stat}</div>
                                <div className="text-blue-200 text-sm mt-1">{label}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* SERVICES PREVIEW */}
            <section className="py-16 bg-slate-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12">
                        <span className="text-blue-600 font-semibold text-sm uppercase tracking-widest">What We Do</span>
                        <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mt-2">Our Core Services</h2>
                        <p className="text-slate-500 mt-3 max-w-xl mx-auto">
                            From emergency fixes to full installations — our licensed plumbers handle it all.
                        </p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {[
                            { icon: 'fa-exclamation-triangle', iconColor: 'text-red-500', bg: 'bg-red-50', hoverBg: 'group-hover:bg-red-100', title: 'Emergency Plumbing', desc: 'Burst pipe? Overflowing toilet? We\'re on call 24 hours a day, 7 days a week. Our plumbers arrive in under 30 minutes anywhere in NYC.' },
                            { icon: 'fa-water', iconColor: 'text-blue-500', bg: 'bg-blue-50', hoverBg: 'group-hover:bg-blue-100', title: 'Drain Cleaning', desc: 'Slow or completely blocked drains cleared fast using professional hydro-jetting and snaking equipment — no mess, no damage to your pipes.' },
                            { icon: 'fa-fire', iconColor: 'text-orange-500', bg: 'bg-orange-50', hoverBg: 'group-hover:bg-orange-100', title: 'Water Heater Service', desc: 'Installation, repair, and replacement of all water heater types — traditional tank units and energy-efficient tankless systems.' },
                        ].map(({ icon, iconColor, bg, hoverBg, title, desc }) => (
                            <div key={title} className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 hover:shadow-md hover:-translate-y-1 transition-all group">
                                <div className={`w-14 h-14 ${bg} rounded-xl flex items-center justify-center mb-5 ${hoverBg} transition-colors`}>
                                    <i className={`fas ${icon} ${iconColor} text-2xl`}></i>
                                </div>
                                <h3 className="text-xl font-bold text-slate-900 mb-2">{title}</h3>
                                <p className="text-slate-500 leading-relaxed">{desc}</p>
                                <Link to="/services" className="inline-flex items-center gap-2 text-blue-600 font-semibold mt-5 hover:text-blue-800">
                                    Learn more <i className="fas fa-arrow-right text-sm"></i>
                                </Link>
                            </div>
                        ))}
                    </div>
                    <div className="text-center mt-10">
                        <Link to="/services" className="inline-flex items-center gap-2 bg-blue-700 text-white font-semibold px-6 py-3 rounded-xl hover:bg-blue-800 transition-colors shadow-sm">
                            View All Services <i className="fas fa-arrow-right text-sm"></i>
                        </Link>
                    </div>
                </div>
            </section>

            {/* ABOUT PREVIEW */}
            <section className="py-16 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                        <div>
                            <span className="text-blue-600 font-semibold text-sm uppercase tracking-widest">Since 1993</span>
                            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mt-2 mb-5">
                                New York's Plumbing Experts — For Over 30 Years
                            </h2>
                            <p className="text-slate-600 leading-relaxed mb-5">
                                Apex Plumbing Co. was founded by Frank Rossi, a licensed Master Plumber with over
                                30 years of hands-on experience. What started as a one-man operation out of Brooklyn
                                has grown into a team of eight certified professionals trusted by thousands of New
                                York homeowners and businesses.
                            </p>
                            <p className="text-slate-600 leading-relaxed mb-6">
                                We hold a New York State Master Plumber License, carry full liability insurance,
                                and every plumber on our team is background-checked. We don't send subcontractors —
                                when we say we're sending a plumber, we mean <em>our</em> plumber.
                            </p>
                            <ul className="space-y-3">
                                {[
                                    'NY State Master Plumber License #MPL-1247-NY',
                                    'Fully bonded and insured',
                                    'Upfront flat-rate pricing — no surprise charges',
                                    'Background-checked, drug-tested plumbers',
                                    '100% satisfaction guarantee on all work',
                                ].map(item => (
                                    <li key={item} className="flex items-start gap-3">
                                        <span className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                                            <i className="fas fa-check text-blue-600 text-xs"></i>
                                        </span>
                                        <span className="text-slate-700">{item}</span>
                                    </li>
                                ))}
                            </ul>
                            <Link to="/about" className="inline-flex items-center gap-2 mt-8 bg-blue-700 text-white font-semibold px-6 py-3 rounded-xl hover:bg-blue-800 transition-colors shadow-sm">
                                Our Full Story <i className="fas fa-arrow-right text-sm"></i>
                            </Link>
                        </div>
                        <div>
                            <div className="bg-gradient-to-br from-blue-900 to-blue-700 rounded-2xl p-8 text-white shadow-xl">
                                <div className="text-center mb-6">
                                    <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <i className="fas fa-hard-hat text-white text-3xl"></i>
                                    </div>
                                    <h3 className="text-2xl font-bold">Frank Rossi</h3>
                                    <p className="text-blue-200 text-sm">Owner &amp; Master Plumber</p>
                                </div>
                                <blockquote className="text-blue-100 text-center italic leading-relaxed">
                                    "I started Apex Plumbing the same way I approach every job —
                                    with honesty, hard work, and a commitment to doing it right the first time.
                                    That hasn't changed in 30 years."
                                </blockquote>
                                <div className="grid grid-cols-2 gap-4 mt-6 pt-6 border-t border-blue-600/50">
                                    <div className="text-center">
                                        <div className="text-2xl font-bold">500+</div>
                                        <div className="text-blue-200 text-xs mt-1">5-Star Reviews</div>
                                    </div>
                                    <div className="text-center">
                                        <div className="text-2xl font-bold">5 Boroughs</div>
                                        <div className="text-blue-200 text-xs mt-1">All of NYC</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* REVIEWS */}
            <section className="py-16 bg-blue-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12">
                        <span className="text-blue-600 font-semibold text-sm uppercase tracking-widest">Testimonials</span>
                        <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mt-2">What Our Customers Say</h2>
                        <p className="text-slate-500 mt-3">Rated 4.9 / 5.0 based on 500+ verified Google reviews.</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {reviews.map(({ initials, color, name, location, text }) => (
                            <div key={name} className="bg-white rounded-2xl p-6 shadow-sm border border-blue-100">
                                <div className="flex gap-1 mb-4">
                                    {[...Array(5)].map((_, i) => (
                                        <i key={i} className="fas fa-star text-yellow-400"></i>
                                    ))}
                                </div>
                                <p className="text-slate-600 leading-relaxed mb-5">{text}</p>
                                <div className="flex items-center gap-3">
                                    <div className={`w-10 h-10 rounded-full ${color} flex items-center justify-center text-white font-bold text-sm`}>{initials}</div>
                                    <div>
                                        <div className="font-semibold text-slate-900">{name}</div>
                                        <div className="text-xs text-slate-400">{location}</div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* FAQ */}
            <section className="py-16 bg-white">
                <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12">
                        <span className="text-blue-600 font-semibold text-sm uppercase tracking-widest">FAQ</span>
                        <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mt-2">Frequently Asked Questions</h2>
                    </div>
                    <div className="space-y-3">
                        {faqs.map(({ q, a }) => (
                            <details key={q} className="group bg-slate-50 rounded-xl border border-slate-200 overflow-hidden">
                                <summary className="flex justify-between items-center px-6 py-4 cursor-pointer font-semibold text-slate-900 hover:text-blue-700 list-none">
                                    {q}
                                    <i className="fas fa-chevron-down text-blue-500 transition-transform duration-200 group-open:rotate-180"></i>
                                </summary>
                                <div className="px-6 pb-5 pt-2 text-slate-600 leading-relaxed border-t border-slate-200">
                                    {a}
                                </div>
                            </details>
                        ))}
                    </div>
                </div>
            </section>

            {/* BOTTOM CTA */}
            <section className="bg-gradient-to-r from-blue-900 to-blue-700 text-white py-16">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h2 className="text-3xl sm:text-4xl font-bold mb-4">Need a Plumber Right Now?</h2>
                    <p className="text-blue-200 text-lg mb-8 max-w-xl mx-auto">
                        Don't wait. Call us 24/7 and we'll be there in under 30 minutes — guaranteed.
                    </p>
                    <div className="flex flex-wrap gap-4 justify-center">
                        <a href="tel:+12125550180" className="inline-flex items-center gap-3 bg-white text-blue-900 font-bold px-7 py-4 rounded-xl hover:bg-blue-50 transition-all shadow-lg text-lg">
                            <i className="fas fa-phone"></i>
                            (212) 555-0180
                        </a>
                        <Link to="/quote" className="inline-flex items-center gap-2 border-2 border-white/80 text-white font-bold px-7 py-4 rounded-xl hover:bg-white/10 transition-all text-lg">
                            <i className="fas fa-file-alt"></i>
                            Request a Free Quote
                        </Link>
                    </div>
                </div>
            </section>
        </>
    );
}
