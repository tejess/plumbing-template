import React from 'react';
import { Link } from 'react-router-dom';

const services = [
    {
        icon: 'fa-exclamation-triangle', iconColor: 'text-red-500', bg: 'bg-red-50',
        title: 'Emergency Plumbing',
        desc: 'A plumbing emergency can happen at any hour. That\'s why our licensed plumbers are available 24 hours a day, 7 days a week — including holidays. We dispatch within minutes and arrive anywhere in NYC in under 30 minutes.',
        items: ['Burst and frozen pipes', 'Sewage backups', 'Overflowing toilets', 'Flooding and water damage', 'Gas line leaks (with Con Edison coordination)'],
    },
    {
        icon: 'fa-water', iconColor: 'text-blue-500', bg: 'bg-blue-50',
        title: 'Drain Cleaning',
        desc: 'Slow or completely clogged drains are cleared fast with professional-grade hydro-jetting and motorised snake equipment. We diagnose the root cause — not just the symptom — so the blockage doesn\'t come back.',
        items: ['Kitchen and bathroom sink drains', 'Shower and bathtub drains', 'Floor drains and laundry drains', 'Main sewer line clearing', 'Camera inspection available'],
    },
    {
        icon: 'fa-fire', iconColor: 'text-orange-500', bg: 'bg-orange-50',
        title: 'Water Heater Services',
        desc: 'From routine maintenance to a complete system replacement, our team handles all makes and models of water heaters. We\'ll help you choose the right unit for your household size and budget.',
        items: ['Tank water heater installation & repair', 'Tankless (on-demand) systems', 'Heat pump water heaters', 'Anode rod replacement', 'Pressure relief valve testing'],
    },
    {
        icon: 'fa-search', iconColor: 'text-purple-500', bg: 'bg-purple-50',
        title: 'Leak Detection & Repair',
        desc: 'Even a small, hidden leak can cause thousands in water damage and mold. We use non-invasive acoustic and thermal detection tools to pinpoint leaks inside walls, floors, and ceilings — then repair them cleanly.',
        items: ['Slab leak detection', 'Under-sink and supply line leaks', 'Toilet and faucet leaks', 'Irrigation system leaks', 'Water meter reading analysis'],
    },
    {
        icon: 'fa-wrench', iconColor: 'text-green-600', bg: 'bg-green-50',
        title: 'Pipe Repair & Replacement',
        desc: 'Old galvanized or cast-iron pipes corrode over time, reducing water pressure and contaminating drinking water. We replace aging pipes with modern copper or cross-linked polyethylene (PEX) for a lasting fix.',
        items: ['Whole-home repiping', 'Galvanized pipe replacement', 'PEX and copper pipe installation', 'Pipe relining (trenchless)', 'Pressure boosting systems'],
    },
    {
        icon: 'fa-home', iconColor: 'text-slate-600', bg: 'bg-slate-100',
        title: 'Bathroom & Kitchen Plumbing',
        desc: 'Planning a renovation or replacing a fixture? Our plumbers handle every aspect of bathroom and kitchen plumbing — rough-in work, fixture installation, and finish plumbing — to code and on schedule.',
        items: ['Toilet installation & repair', 'Faucet and sink installation', 'Shower and tub installation', 'Dishwasher and garbage disposal hookup', 'Kitchen and bathroom remodels'],
    },
    {
        icon: 'fa-dungeon', iconColor: 'text-yellow-600', bg: 'bg-yellow-50',
        title: 'Sewer Line Services',
        desc: 'Sewer problems are among the most serious plumbing issues a property can face. We diagnose and repair sewer lines using camera inspection, hydro-jetting, and trenchless repair to minimise disruption to your property.',
        items: ['Sewer camera inspection', 'Hydro-jet cleaning', 'Trenchless pipe lining', 'Sewer line replacement', 'Root intrusion removal'],
    },
    {
        icon: 'fa-building', iconColor: 'text-blue-700', bg: 'bg-blue-50',
        title: 'Commercial Plumbing',
        desc: 'We serve restaurants, retail spaces, office buildings, and multi-unit residential properties throughout NYC. Our team understands commercial plumbing codes and can work around your business schedule.',
        items: ['Grease trap installation & cleaning', 'Backflow prevention devices', 'Commercial water heaters', 'Multi-unit building plumbing', 'Preventive maintenance contracts'],
    },
];

export default function Services() {
    return (
        <>
            {/* PAGE HEADER */}
            <section className="bg-gradient-to-br from-slate-900 to-blue-900 text-white py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <span className="text-blue-300 font-semibold text-sm uppercase tracking-widest">What We Do</span>
                    <h1 className="text-4xl sm:text-5xl font-extrabold mt-2 mb-4">Our Plumbing Services</h1>
                    <p className="text-blue-200 text-lg max-w-2xl mx-auto">
                        From a dripping faucet to a full home repipe — Apex Plumbing handles every job with
                        the same care, professionalism, and upfront pricing.
                    </p>
                </div>
            </section>

            {/* SERVICES GRID */}
            <section className="py-16 bg-slate-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {services.map(({ icon, iconColor, bg, title, desc, items }) => (
                            <div key={title} className="bg-white rounded-2xl shadow-sm border border-slate-100 p-7 hover:shadow-md transition-shadow">
                                <div className={`w-14 h-14 ${bg} rounded-xl flex items-center justify-center mb-5`}>
                                    <i className={`fas ${icon} ${iconColor} text-2xl`}></i>
                                </div>
                                <h2 className="text-xl font-bold text-slate-900 mb-3">{title}</h2>
                                <p className="text-slate-500 leading-relaxed mb-4">{desc}</p>
                                <ul className="space-y-1.5">
                                    {items.map(item => (
                                        <li key={item} className="flex items-center gap-2 text-sm text-slate-600">
                                            <i className="fas fa-check-circle text-blue-500 text-xs flex-shrink-0"></i>
                                            {item}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="bg-gradient-to-r from-blue-900 to-blue-700 text-white py-16">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h2 className="text-3xl sm:text-4xl font-bold mb-4">Ready to Get Started?</h2>
                    <p className="text-blue-200 text-lg mb-8 max-w-xl mx-auto">
                        Call us 24/7 for emergencies — or request a free, no-obligation quote online.
                    </p>
                    <div className="flex flex-wrap gap-4 justify-center">
                        <a href="tel:+12125550180" className="inline-flex items-center gap-3 bg-white text-blue-900 font-bold px-7 py-4 rounded-xl hover:bg-blue-50 transition-all shadow-lg text-lg">
                            <i className="fas fa-phone"></i> (212) 555-0180
                        </a>
                        <Link to="/quote" className="inline-flex items-center gap-2 border-2 border-white/80 text-white font-bold px-7 py-4 rounded-xl hover:bg-white/10 transition-all text-lg">
                            <i className="fas fa-file-alt"></i> Free Quote
                        </Link>
                    </div>
                </div>
            </section>
        </>
    );
}
