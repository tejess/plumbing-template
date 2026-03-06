import React from 'react';
import { Link } from 'react-router-dom';

const team = [
    { initials: 'FR', color: 'bg-blue-900', name: 'Frank Rossi', role: 'Owner & Master Plumber', bio: '30+ years experience. Licensed Master Plumber and founder of Apex Plumbing Co. Frank personally oversees all complex jobs.' },
    { initials: 'MR', color: 'bg-blue-700', name: 'Mike Rodriguez', role: 'Senior Plumber', bio: '14 years with Apex. Specialises in water heaters, repiping, and commercial plumbing projects.' },
    { initials: 'JW', color: 'bg-blue-600', name: 'James Williams', role: 'Lead Plumber', bio: '10 years experience. Expert in sewer line diagnosis and trenchless repair methods.' },
    { initials: 'TP', color: 'bg-blue-500', name: 'Tony Park', role: 'Emergency Specialist', bio: '8 years experience. Leads our 24/7 emergency response team — the fastest dispatcher in the five boroughs.' },
];

export default function About() {
    return (
        <>
            {/* PAGE HEADER */}
            <section className="bg-gradient-to-br from-slate-900 to-blue-900 text-white py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <span className="text-blue-300 font-semibold text-sm uppercase tracking-widest">Since 1993</span>
                    <h1 className="text-4xl sm:text-5xl font-extrabold mt-2 mb-4">About Apex Plumbing Co.</h1>
                    <p className="text-blue-200 text-lg max-w-2xl mx-auto">
                        Over 30 years of honest, professional plumbing service in New York City.
                        Here's our story.
                    </p>
                </div>
            </section>

            {/* OUR STORY */}
            <section className="py-16 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                        <div>
                            <span className="text-blue-600 font-semibold text-sm uppercase tracking-widest">Our Story</span>
                            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mt-2 mb-5">
                                Built on Honesty. Grown on Trust.
                            </h2>
                            <div className="space-y-4 text-slate-600 leading-relaxed">
                                <p>
                                    Apex Plumbing Co. was founded in 1993 by Frank Rossi, a Brooklyn-born licensed Master
                                    Plumber who believed New Yorkers deserved a plumbing service that was honest, punctual,
                                    and priced fairly — without the industry runaround.
                                </p>
                                <p>
                                    What started as a one-man van operation out of Bay Ridge has grown into a team of eight
                                    certified professionals equipped with modern diagnostic tools and a fleet of fully-stocked
                                    vehicles. But our values haven't changed.
                                </p>
                                <p>
                                    We don't use subcontractors. Every plumber on our team is a direct employee who has been
                                    background-checked, drug-tested, and trained to our standards. When we say we're sending
                                    a plumber, we mean <em>our</em> plumber.
                                </p>
                                <p>
                                    Today we serve thousands of homeowners, landlords, and businesses across all five NYC
                                    boroughs — and we still answer our own phones.
                                </p>
                            </div>
                        </div>
                        <div className="bg-gradient-to-br from-blue-900 to-blue-700 rounded-2xl p-8 text-white shadow-xl">
                            <div className="text-center mb-6">
                                <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <i className="fas fa-hard-hat text-white text-3xl"></i>
                                </div>
                                <h3 className="text-2xl font-bold">Frank Rossi</h3>
                                <p className="text-blue-200 text-sm">Founder &amp; Master Plumber</p>
                            </div>
                            <blockquote className="text-blue-100 text-center italic leading-relaxed mb-6">
                                "I started Apex Plumbing the same way I approach every job — with honesty, hard work,
                                and a commitment to doing it right the first time. That hasn't changed in 30 years."
                            </blockquote>
                            <div className="grid grid-cols-3 gap-4 pt-6 border-t border-blue-600/50 text-center">
                                {[{ n: '30+', l: 'Years' }, { n: '5,000+', l: 'Jobs' }, { n: '4.9★', l: 'Rating' }].map(({ n, l }) => (
                                    <div key={l}>
                                        <div className="text-xl font-bold">{n}</div>
                                        <div className="text-blue-200 text-xs mt-1">{l}</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* CREDENTIALS */}
            <section className="py-16 bg-slate-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12">
                        <span className="text-blue-600 font-semibold text-sm uppercase tracking-widest">Credentials</span>
                        <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mt-2">Licensed, Bonded &amp; Insured</h2>
                        <p className="text-slate-500 mt-3 max-w-xl mx-auto">
                            We're fully credentialed and transparent about it. Ask to see any of these documents — we keep them on every vehicle.
                        </p>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {[
                            { icon: 'fa-id-card', title: 'Master Plumber License', detail: '#MPL-1247-NY · State of New York' },
                            { icon: 'fa-shield-alt', title: 'Liability Insurance', detail: '$2 million general liability coverage' },
                            { icon: 'fa-link', title: 'Fully Bonded', detail: 'Performance bond on every job' },
                            { icon: 'fa-user-check', title: 'Background Checked', detail: 'All plumbers screened and drug-tested' },
                        ].map(({ icon, title, detail }) => (
                            <div key={title} className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 text-center">
                                <div className="w-14 h-14 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                                    <i className={`fas ${icon} text-blue-700 text-2xl`}></i>
                                </div>
                                <h3 className="font-bold text-slate-900 mb-1">{title}</h3>
                                <p className="text-slate-500 text-sm">{detail}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* TEAM */}
            <section className="py-16 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12">
                        <span className="text-blue-600 font-semibold text-sm uppercase tracking-widest">The Team</span>
                        <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mt-2">Meet Our Plumbers</h2>
                        <p className="text-slate-500 mt-3 max-w-xl mx-auto">
                            A small, tightly-knit team of professionals who take pride in every job.
                        </p>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {team.map(({ initials, color, name, role, bio }) => (
                            <div key={name} className="bg-slate-50 rounded-2xl p-6 text-center border border-slate-100">
                                <div className={`w-16 h-16 ${color} rounded-full flex items-center justify-center text-white font-bold text-xl mx-auto mb-4`}>
                                    {initials}
                                </div>
                                <h3 className="font-bold text-slate-900">{name}</h3>
                                <p className="text-blue-600 text-sm font-medium mb-3">{role}</p>
                                <p className="text-slate-500 text-sm leading-relaxed">{bio}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="bg-gradient-to-r from-blue-900 to-blue-700 text-white py-16">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h2 className="text-3xl sm:text-4xl font-bold mb-4">Ready to Work with Us?</h2>
                    <p className="text-blue-200 text-lg mb-8 max-w-xl mx-auto">
                        Experience the Apex difference — honest pricing, expert service, and 24/7 availability.
                    </p>
                    <div className="flex flex-wrap gap-4 justify-center">
                        <Link to="/contact" className="inline-flex items-center gap-2 bg-white text-blue-900 font-bold px-7 py-4 rounded-xl hover:bg-blue-50 transition-all shadow-lg text-lg">
                            <i className="fas fa-envelope"></i> Contact Us
                        </Link>
                        <Link to="/quote" className="inline-flex items-center gap-2 border-2 border-white/80 text-white font-bold px-7 py-4 rounded-xl hover:bg-white/10 transition-all text-lg">
                            <i className="fas fa-file-alt"></i> Free Quote
                        </Link>
                    </div>
                </div>
            </section>
        </>
    );
}
