import React from 'react';
import { Link } from 'react-router-dom';

export default function Footer() {
    return (
        <footer className="bg-slate-900 text-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                    {/* Brand */}
                    <div>
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-10 h-10 bg-blue-700 rounded-lg flex items-center justify-center flex-shrink-0">
                                <i className="fas fa-wrench text-white"></i>
                            </div>
                            <div>
                                <div className="font-bold text-lg">Apex Plumbing Co.</div>
                                <div className="text-slate-400 text-xs">New York, NY · Since 1993</div>
                            </div>
                        </div>
                        <p className="text-slate-400 text-sm leading-relaxed mb-5">
                            Licensed, bonded, and insured plumbing professionals serving all five NYC boroughs.
                            Available 24/7 for emergencies — we arrive in under 30 minutes.
                        </p>
                        <div className="flex gap-3">
                            <a href="#instagram" aria-label="Instagram" className="w-8 h-8 flex items-center justify-center rounded-full bg-slate-700 hover:bg-pink-600 transition-colors">
                                <i className="fab fa-instagram text-sm"></i>
                            </a>
                            <a href="#facebook" aria-label="Facebook" className="w-8 h-8 flex items-center justify-center rounded-full bg-slate-700 hover:bg-blue-700 transition-colors">
                                <i className="fab fa-facebook-f text-sm"></i>
                            </a>
                            <a href="#linkedin" aria-label="LinkedIn" className="w-8 h-8 flex items-center justify-center rounded-full bg-slate-700 hover:bg-blue-500 transition-colors">
                                <i className="fab fa-linkedin-in text-sm"></i>
                            </a>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="font-semibold text-lg mb-4">Quick Links</h3>
                        <ul className="space-y-2.5 text-slate-400">
                            {[
                                { to: '/', label: 'Home' },
                                { to: '/services', label: 'Our Services' },
                                { to: '/about', label: 'About Us' },
                                { to: '/contact', label: 'Contact Us' },
                                { to: '/quote', label: 'Free Quote' },
                            ].map(({ to, label }) => (
                                <li key={to}>
                                    <Link to={to} className="hover:text-white transition-colors flex items-center gap-2">
                                        <i className="fas fa-chevron-right text-xs text-blue-500"></i>
                                        {label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Contact Info */}
                    <div>
                        <h3 className="font-semibold text-lg mb-4">Contact Info</h3>
                        <ul className="space-y-3 text-slate-400 text-sm">
                            <li className="flex items-start gap-3">
                                <i className="fas fa-map-marker-alt text-blue-400 mt-0.5 w-4"></i>
                                <span>123 Plumber's Way, Suite 4B<br />New York, NY 10001</span>
                            </li>
                            <li className="flex items-center gap-3">
                                <i className="fas fa-phone text-blue-400 w-4"></i>
                                <a href="tel:+12125550180" className="hover:text-white transition-colors">(212) 555-0180</a>
                            </li>
                            <li className="flex items-center gap-3">
                                <i className="fas fa-envelope text-blue-400 w-4"></i>
                                <a href="mailto:info@apexplumbingnyc.com" className="hover:text-white transition-colors">info@apexplumbingnyc.com</a>
                            </li>
                            <li className="flex items-start gap-3">
                                <i className="fas fa-clock text-blue-400 mt-0.5 w-4"></i>
                                <div>
                                    <div>Mon–Fri: 7:00am – 8:00pm</div>
                                    <div>Sat–Sun: 8:00am – 6:00pm</div>
                                    <div className="text-blue-400 font-medium mt-1">24/7 Emergency Service</div>
                                </div>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>

            <div className="border-t border-slate-800">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col sm:flex-row justify-between items-center gap-2 text-sm text-slate-500">
                    <div>© 2024 Apex Plumbing Co. All rights reserved.</div>
                    <div>License #MPL-1247-NY · Bonded &amp; Insured</div>
                </div>
            </div>
        </footer>
    );
}
