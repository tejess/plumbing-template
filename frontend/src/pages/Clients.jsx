import React, { useState, useEffect, useCallback } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { jobberQuery } from '../jobber';

// ─── helpers ──────────────────────────────────────────────────────────────────

function getInitials(name = '') {
    return name
        .split(' ')
        .map(w => w[0])
        .slice(0, 2)
        .join('')
        .toUpperCase();
}

const AVATAR_COLORS = [
    'bg-blue-900', 'bg-blue-700', 'bg-blue-600',
    'bg-slate-700', 'bg-blue-500', 'bg-blue-400',
];

function avatarColor(name = '') {
    let hash = 0;
    for (let c of name) hash = (hash * 31 + c.charCodeAt(0)) & 0xffff;
    return AVATAR_COLORS[hash % AVATAR_COLORS.length];
}

const inputClass =
    'w-full px-4 py-3 rounded-xl border border-slate-200 text-slate-800 placeholder-slate-400 bg-slate-50 text-sm focus:border-blue-400 focus:ring-2 focus:ring-blue-100 outline-none transition-all';

// ─── Add Client Modal ─────────────────────────────────────────────────────────

function AddClientModal({ onClose, onCreated }) {
    const [form, setForm] = useState({ firstName: '', lastName: '', email: '', phone: '' });
    const [status, setStatus] = useState(null);

    const handleChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

    const handleSubmit = async e => {
        e.preventDefault();
        setStatus('loading');
        try {
            const json = await jobberQuery(
                `mutation CreateClient($input: ClientCreateInput!) {
                  clientCreate(input: $input) {
                    client { id name firstName lastName emails { address } phones { number } }
                    userErrors { message }
                  }
                }`,
                {
                    input: {
                        firstName: form.firstName,
                        lastName: form.lastName,
                        ...(form.email && { emails: [{ address: form.email, primary: true }] }),
                        ...(form.phone && { phones: [{ number: form.phone, primary: true }] }),
                    },
                }
            );
            const errors = json?.data?.clientCreate?.userErrors;
            if (errors && errors.length > 0) {
                setStatus({ error: errors[0].message });
            } else if (json?.data?.clientCreate?.client) {
                onCreated(json.data.clientCreate.client);
                onClose();
            } else {
                setStatus({ error: 'Something went wrong. Please try again.' });
            }
        } catch {
            setStatus({ error: 'Could not reach Jobber. Please try again.' });
        }
    };

    const loading = status === 'loading';

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
                onClick={onClose}
            />
            {/* Panel */}
            <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md p-7 animate-fadeIn">
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h2 className="text-xl font-bold text-slate-900">Add New Client</h2>
                        <p className="text-slate-500 text-sm mt-0.5">Client will be created in Jobber instantly.</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="w-8 h-8 flex items-center justify-center rounded-full text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition-colors"
                    >
                        <i className="fas fa-times"></i>
                    </button>
                </div>

                {status?.error && (
                    <div className="flex items-start gap-3 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm mb-4">
                        <i className="fas fa-exclamation-circle mt-0.5 flex-shrink-0"></i>
                        <span>{status.error}</span>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1.5">
                                First Name <span className="text-red-500">*</span>
                            </label>
                            <input name="firstName" type="text" placeholder="Jane" required
                                value={form.firstName} onChange={handleChange} className={inputClass} />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1.5">
                                Last Name <span className="text-red-500">*</span>
                            </label>
                            <input name="lastName" type="text" placeholder="Smith" required
                                value={form.lastName} onChange={handleChange} className={inputClass} />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1.5">
                            Email <span className="text-slate-400 font-normal">(optional)</span>
                        </label>
                        <input name="email" type="email" placeholder="jane@example.com"
                            value={form.email} onChange={handleChange} className={inputClass} />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1.5">
                            Phone <span className="text-slate-400 font-normal">(optional)</span>
                        </label>
                        <input name="phone" type="tel" placeholder="(212) 555-0000"
                            value={form.phone} onChange={handleChange} className={inputClass} />
                    </div>

                    <div className="flex gap-3 pt-2">
                        <button type="button" onClick={onClose}
                            className="flex-1 px-4 py-3 rounded-xl border border-slate-200 text-slate-600 font-semibold hover:bg-slate-50 transition-colors text-sm">
                            Cancel
                        </button>
                        <button type="submit" disabled={loading}
                            className="flex-1 px-4 py-3 rounded-xl bg-blue-700 text-white font-semibold hover:bg-blue-800 transition-colors text-sm flex items-center justify-center gap-2 disabled:opacity-70">
                            {loading
                                ? <><i className="fas fa-spinner fa-spin"></i> Creating…</>
                                : <><i className="fas fa-user-plus"></i> Create Client</>}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

// ─── Delete Confirm Modal ─────────────────────────────────────────────────────

function ConfirmDeleteModal({ client, onClose, onDeleted }) {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleDelete = async () => {
        setLoading(true);
        try {
            const json = await jobberQuery(
                `mutation DeleteClient($id: EncodedId!) {
                  clientDelete(input: { id: $id }) {
                    clientId
                    userErrors { message }
                  }
                }`,
                { id: client.id }
            );
            const errors = json?.data?.clientDelete?.userErrors;
            if (errors && errors.length > 0) {
                setError(errors[0].message);
                setLoading(false);
            } else {
                onDeleted(client.id);
                onClose();
            }
        } catch {
            setError('Could not reach Jobber. Please try again.');
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={onClose} />
            <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-sm p-7">
                <div className="w-14 h-14 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <i className="fas fa-trash-alt text-red-500 text-xl"></i>
                </div>
                <h2 className="text-lg font-bold text-slate-900 text-center mb-2">Delete Client?</h2>
                <p className="text-slate-500 text-sm text-center mb-6">
                    This will permanently remove <strong>{client.name}</strong> from Jobber. This cannot be undone.
                </p>
                {error && (
                    <div className="text-red-600 text-sm text-center mb-4 p-3 bg-red-50 rounded-lg">{error}</div>
                )}
                <div className="flex gap-3">
                    <button onClick={onClose}
                        className="flex-1 px-4 py-3 rounded-xl border border-slate-200 text-slate-600 font-semibold hover:bg-slate-50 transition-colors text-sm">
                        Cancel
                    </button>
                    <button onClick={handleDelete} disabled={loading}
                        className="flex-1 px-4 py-3 rounded-xl bg-red-600 text-white font-semibold hover:bg-red-700 transition-colors text-sm flex items-center justify-center gap-2 disabled:opacity-70">
                        {loading ? <><i className="fas fa-spinner fa-spin"></i> Deleting…</> : 'Yes, Delete'}
                    </button>
                </div>
            </div>
        </div>
    );
}

// ─── Client Card ──────────────────────────────────────────────────────────────

function ClientCard({ client, onDelete }) {
    const email = client.emails?.[0]?.address;
    const phone = client.phones?.[0]?.number;
    const color = avatarColor(client.name);

    return (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all group p-6">
            <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                    <div className={`w-12 h-12 ${color} rounded-xl flex items-center justify-center text-white font-bold text-sm flex-shrink-0`}>
                        {getInitials(client.name)}
                    </div>
                    <div>
                        <div className="font-bold text-slate-900">{client.name}</div>
                        <div className="text-xs text-slate-400 mt-0.5">Jobber Client</div>
                    </div>
                </div>
                <button
                    onClick={() => onDelete(client)}
                    className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-300 hover:text-red-500 hover:bg-red-50 transition-colors opacity-0 group-hover:opacity-100"
                    title="Delete client"
                >
                    <i className="fas fa-trash-alt text-sm"></i>
                </button>
            </div>

            <div className="space-y-2">
                {email ? (
                    <a href={`mailto:${email}`}
                        className="flex items-center gap-2 text-sm text-slate-600 hover:text-blue-600 transition-colors min-w-0">
                        <i className="fas fa-envelope text-blue-400 w-4 flex-shrink-0"></i>
                        <span className="truncate">{email}</span>
                    </a>
                ) : (
                    <div className="flex items-center gap-2 text-sm text-slate-300">
                        <i className="fas fa-envelope w-4 flex-shrink-0"></i>
                        <span>No email</span>
                    </div>
                )}
                {phone ? (
                    <a href={`tel:${phone}`}
                        className="flex items-center gap-2 text-sm text-slate-600 hover:text-blue-600 transition-colors">
                        <i className="fas fa-phone text-blue-400 w-4 flex-shrink-0"></i>
                        <span>{phone}</span>
                    </a>
                ) : (
                    <div className="flex items-center gap-2 text-sm text-slate-300">
                        <i className="fas fa-phone w-4 flex-shrink-0"></i>
                        <span>No phone</span>
                    </div>
                )}
            </div>

            <Link
                to={`/clients/${encodeURIComponent(client.id)}`}
                className="mt-4 w-full flex items-center justify-center gap-2 py-2 rounded-xl border border-slate-200 text-slate-500 hover:text-blue-700 hover:border-blue-200 hover:bg-blue-50 transition-all text-xs font-semibold"
            >
                Manage <i className="fas fa-arrow-right text-xs" />
            </Link>
        </div>
    );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function Clients() {
    const location = useLocation();
    const [clients, setClients] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [search, setSearch] = useState('');
    const [showAdd, setShowAdd] = useState(false);
    const [toDelete, setToDelete] = useState(null);

    useEffect(() => {
        if (new URLSearchParams(location.search).get('add') === 'true') {
            setShowAdd(true);
        }
    }, [location.search]);

    const fetchClients = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const json = await jobberQuery(`{
                clients(first: 100) {
                    nodes {
                        id name firstName lastName
                        emails { address }
                        phones { number }
                    }
                }
            }`);
            setClients(json?.data?.clients?.nodes || []);
        } catch {
            setError('Could not load clients from Jobber.');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => { fetchClients(); }, [fetchClients]);

    const handleCreated = newClient => {
        setClients(prev => [newClient, ...prev]);
    };

    const handleDeleted = deletedId => {
        setClients(prev => prev.filter(c => c.id !== deletedId));
    };

    const filtered = clients.filter(c =>
        c.name?.toLowerCase().includes(search.toLowerCase()) ||
        c.emails?.[0]?.address?.toLowerCase().includes(search.toLowerCase()) ||
        c.phones?.[0]?.number?.includes(search)
    );

    return (
        <>
            {/* Modals */}
            {showAdd && (
                <AddClientModal onClose={() => setShowAdd(false)} onCreated={handleCreated} />
            )}
            {toDelete && (
                <ConfirmDeleteModal
                    client={toDelete}
                    onClose={() => setToDelete(null)}
                    onDeleted={handleDeleted}
                />
            )}

            {/* PAGE HEADER */}
            <section className="bg-gradient-to-br from-slate-900 via-blue-950 to-blue-900 text-white py-14">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
                        <div>
                            <span className="text-blue-300 font-semibold text-sm uppercase tracking-widest">Jobber CRM</span>
                            <h1 className="text-4xl sm:text-5xl font-extrabold mt-1">Clients</h1>
                            <p className="text-blue-200 mt-2 text-lg">
                                {loading ? 'Loading…' : `${clients.length} client${clients.length !== 1 ? 's' : ''} in Jobber`}
                            </p>
                        </div>
                        <button
                            onClick={() => setShowAdd(true)}
                            className="inline-flex items-center gap-2 bg-white text-blue-900 font-bold px-6 py-3.5 rounded-xl hover:bg-blue-50 transition-all shadow-lg self-start sm:self-auto"
                        >
                            <i className="fas fa-user-plus"></i>
                            Add Client
                        </button>
                    </div>
                </div>
            </section>

            {/* STATS BAR */}
            {!loading && !error && (
                <section className="bg-blue-700 text-white">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 text-center">
                            <div>
                                <div className="text-2xl font-extrabold">{clients.length}</div>
                                <div className="text-blue-200 text-xs mt-1">Total Clients</div>
                            </div>
                            <div>
                                <div className="text-2xl font-extrabold">
                                    {clients.filter(c => c.emails?.[0]?.address).length}
                                </div>
                                <div className="text-blue-200 text-xs mt-1">With Email</div>
                            </div>
                            <div>
                                <div className="text-2xl font-extrabold">
                                    {clients.filter(c => c.phones?.[0]?.number).length}
                                </div>
                                <div className="text-blue-200 text-xs mt-1">With Phone</div>
                            </div>
                            <div>
                                <div className="text-2xl font-extrabold">{filtered.length}</div>
                                <div className="text-blue-200 text-xs mt-1">Showing</div>
                            </div>
                        </div>
                    </div>
                </section>
            )}

            {/* MAIN CONTENT */}
            <section className="py-10 bg-slate-50 min-h-[50vh]">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                    {/* Search + Refresh */}
                    {!loading && !error && (
                        <div className="flex flex-col sm:flex-row gap-3 mb-8">
                            <div className="relative flex-1">
                                <i className="fas fa-search absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-sm"></i>
                                <input
                                    type="text"
                                    placeholder="Search by name, email, or phone…"
                                    value={search}
                                    onChange={e => setSearch(e.target.value)}
                                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 bg-white text-slate-800 placeholder-slate-400 text-sm focus:border-blue-400 focus:ring-2 focus:ring-blue-100 outline-none transition-all shadow-sm"
                                />
                            </div>
                            <button
                                onClick={fetchClients}
                                className="inline-flex items-center gap-2 px-5 py-3 rounded-xl border border-slate-200 bg-white text-slate-600 font-medium hover:bg-slate-50 transition-colors text-sm shadow-sm"
                            >
                                <i className="fas fa-sync-alt"></i> Refresh
                            </button>
                        </div>
                    )}

                    {/* Loading state */}
                    {loading && (
                        <div className="flex flex-col items-center justify-center py-24 text-slate-400">
                            <i className="fas fa-spinner fa-spin text-4xl text-blue-400 mb-4"></i>
                            <p className="text-lg font-medium">Loading clients from Jobber…</p>
                        </div>
                    )}

                    {/* Error state */}
                    {error && !loading && (
                        <div className="flex flex-col items-center justify-center py-24">
                            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
                                <i className="fas fa-exclamation-triangle text-red-500 text-2xl"></i>
                            </div>
                            <p className="text-lg font-semibold text-slate-700 mb-2">Failed to load clients</p>
                            <p className="text-slate-500 text-sm mb-6">{error}</p>
                            <button onClick={fetchClients}
                                className="inline-flex items-center gap-2 bg-blue-700 text-white font-semibold px-5 py-2.5 rounded-xl hover:bg-blue-800 transition-colors">
                                <i className="fas fa-redo"></i> Try Again
                            </button>
                        </div>
                    )}

                    {/* Empty state */}
                    {!loading && !error && filtered.length === 0 && (
                        <div className="flex flex-col items-center justify-center py-24">
                            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                                <i className="fas fa-users text-blue-500 text-2xl"></i>
                            </div>
                            <p className="text-lg font-semibold text-slate-700 mb-2">
                                {search ? 'No clients match your search' : 'No clients yet'}
                            </p>
                            <p className="text-slate-500 text-sm mb-6">
                                {search ? 'Try a different name, email, or phone number.' : 'Add your first client to get started.'}
                            </p>
                            {!search && (
                                <button onClick={() => setShowAdd(true)}
                                    className="inline-flex items-center gap-2 bg-blue-700 text-white font-semibold px-5 py-2.5 rounded-xl hover:bg-blue-800 transition-colors">
                                    <i className="fas fa-user-plus"></i> Add First Client
                                </button>
                            )}
                        </div>
                    )}

                    {/* Client grid */}
                    {!loading && !error && filtered.length > 0 && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                            {filtered.map(client => (
                                <ClientCard
                                    key={client.id}
                                    client={client}
                                    onDelete={setToDelete}
                                />
                            ))}
                        </div>
                    )}

                </div>
            </section>
        </>
    );
}
