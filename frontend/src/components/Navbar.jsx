import React, { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';

const navLinks = [
    { to: '/', label: 'Welcome', icon: 'fa-home', key: 'index' },
    { to: '/services', label: 'Services', icon: 'fa-tools', key: 'services' },
    { to: '/about', label: 'About Us', icon: 'fa-building', key: 'about' },
    { to: '/contact', label: 'Contact Us', icon: 'fa-envelope', key: 'contact' },
    { to: '/clients', label: 'Clients', icon: 'fa-users', key: 'clients' },
    { to: '/schedule', label: 'Schedule', icon: 'fa-calendar-alt', key: 'schedule' },
];

export default function Navbar() {
    const [mobileOpen, setMobileOpen] = useState(false);

    const close = () => setMobileOpen(false);

    const activeClass = 'text-blue-700 bg-blue-50';
    const inactiveClass = 'text-slate-600 hover:text-blue-700 hover:bg-slate-50';

    return (
        <>
            {/* Top utility bar */}
            <div className="bg-slate-900 text-white text-sm py-2.5">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row justify-between items-center gap-2">
                    <div className="flex items-center gap-5 flex-wrap justify-center sm:justify-start">
                        <a href="tel:+12125550180" className="flex items-center gap-2 hover:text-blue-300 transition-colors" title="Call us now">
                            <i className="fas fa-phone text-blue-400 text-xs"></i>
                            <span>(212) 555-0180</span>
                        </a>
                        <a href="mailto:info@apexplumbingnyc.com" className="flex items-center gap-2 hover:text-blue-300 transition-colors" title="Email us">
                            <i className="fas fa-envelope text-blue-400 text-xs"></i>
                            <span>info@apexplumbingnyc.com</span>
                        </a>
                    </div>
                    <div className="flex items-center gap-3">
                        <span className="text-slate-400 text-xs hidden sm:block">Follow us:</span>
                        <a href="#instagram" aria-label="Instagram" className="w-7 h-7 flex items-center justify-center rounded-full bg-slate-700 hover:bg-pink-600 transition-colors">
                            <i className="fab fa-instagram text-xs"></i>
                        </a>
                        <a href="#facebook" aria-label="Facebook" className="w-7 h-7 flex items-center justify-center rounded-full bg-slate-700 hover:bg-blue-700 transition-colors">
                            <i className="fab fa-facebook-f text-xs"></i>
                        </a>
                        <a href="#linkedin" aria-label="LinkedIn" className="w-7 h-7 flex items-center justify-center rounded-full bg-slate-700 hover:bg-blue-500 transition-colors">
                            <i className="fab fa-linkedin-in text-xs"></i>
                        </a>
                    </div>
                </div>
            </div>

            {/* Main nav */}
            <nav className="bg-white shadow-md sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        {/* Logo */}
                        <Link to="/" className="flex items-center gap-3" onClick={close}>
                            <div className="w-10 h-10 bg-blue-900 rounded-lg flex items-center justify-center flex-shrink-0">
                                <i className="fas fa-wrench text-white"></i>
                            </div>
                            <div className="leading-tight">
                                <div className="font-bold text-blue-900 text-lg">Apex Plumbing</div>
                                <div className="text-xs text-slate-400">New York, NY</div>
                            </div>
                        </Link>

                        {/* Desktop nav */}
                        <div className="hidden md:flex items-center gap-1">
                            {navLinks.map(({ to, label, key }) => (
                                <NavLink
                                    key={key}
                                    to={to}
                                    end={to === '/'}
                                    className={({ isActive }) =>
                                        `px-4 py-2 rounded-md font-medium transition-colors ${isActive ? activeClass : inactiveClass}`
                                    }
                                >
                                    {label}
                                </NavLink>
                            ))}
                            <Link
                                to="/quote"
                                className="ml-3 bg-blue-700 text-white px-5 py-2.5 rounded-lg font-semibold hover:bg-blue-800 transition-colors shadow-sm flex items-center gap-2"
                            >
                                <i className="fas fa-file-alt text-sm"></i>
                                Free Quote
                            </Link>
                        </div>

                        {/* Hamburger */}
                        <button
                            id="menu-toggle"
                            className="md:hidden p-2 rounded-md text-slate-600 hover:text-blue-700 hover:bg-slate-100 transition-colors"
                            aria-label="Toggle navigation menu"
                            aria-expanded={mobileOpen}
                            onClick={() => setMobileOpen(o => !o)}
                        >
                            <i className={`fas ${mobileOpen ? 'fa-times' : 'fa-bars'} text-xl`}></i>
                        </button>
                    </div>
                </div>

                {/* Mobile menu */}
                {mobileOpen && (
                    <div className="md:hidden border-t border-slate-100 bg-white pb-2">
                        <div className="px-4 pt-2 space-y-1">
                            {navLinks.map(({ to, label, icon, key }) => (
                                <NavLink
                                    key={key}
                                    to={to}
                                    end={to === '/'}
                                    onClick={close}
                                    className={({ isActive }) =>
                                        `flex items-center gap-3 px-4 py-2.5 rounded-md font-medium transition-colors ${isActive ? activeClass : inactiveClass}`
                                    }
                                >
                                    <i className={`fas ${icon} w-4 text-blue-400`}></i>
                                    {label}
                                </NavLink>
                            ))}
                            <Link
                                to="/quote"
                                onClick={close}
                                className="flex items-center gap-3 px-4 py-2.5 rounded-md font-medium text-white bg-blue-700 hover:bg-blue-800 transition-colors"
                            >
                                <i className="fas fa-file-alt w-4"></i>
                                Free Quote
                            </Link>
                        </div>
                    </div>
                )}
            </nav>
        </>
    );
}
