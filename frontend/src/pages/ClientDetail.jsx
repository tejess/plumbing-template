import React, { useState, useEffect, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
    getClientDetail,
    createProperty,
    createRequest,
    createQuote,
    createJob,
    createVisit,
    completeJob,
    createInvoice,
} from '../jobber';

// ─── Helpers ──────────────────────────────────────────────────────────────────

const fmt = (iso) =>
    iso ? new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '—';

const fmtCurrency = (v) =>
    v != null ? `$${Number(v).toFixed(2)}` : '—';

const STATUS_BADGE = {
    // requests
    action_required: 'bg-amber-100 text-amber-700',
    assessment_complete: 'bg-blue-100 text-blue-700',
    converted: 'bg-green-100 text-green-700',
    // quotes
    draft: 'bg-slate-100 text-slate-600',
    awaiting_response: 'bg-amber-100 text-amber-700',
    approved: 'bg-green-100 text-green-700',
    changes_requested: 'bg-red-100 text-red-600',
    archived: 'bg-slate-100 text-slate-400',
    // jobs
    needs_scheduling: 'bg-amber-100 text-amber-700',
    active: 'bg-blue-100 text-blue-700',
    completed: 'bg-green-100 text-green-700',
    to_invoice: 'bg-purple-100 text-purple-700',
    // invoices
    draft: 'bg-slate-100 text-slate-600',
    sent: 'bg-blue-100 text-blue-700',
    paid: 'bg-green-100 text-green-700',
    past_due: 'bg-red-100 text-red-600',
};

const statusLabel = (s) =>
    (s || '')
        .replace(/_/g, ' ')
        .replace(/\b\w/g, (c) => c.toUpperCase());

function Badge({ status }) {
    const cls = STATUS_BADGE[status] || 'bg-slate-100 text-slate-500';
    return (
        <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${cls}`}>
            {statusLabel(status)}
        </span>
    );
}

const inputCls =
    'w-full px-3 py-2.5 rounded-lg border border-slate-200 bg-slate-50 text-sm text-slate-800 placeholder-slate-400 focus:border-blue-400 focus:ring-2 focus:ring-blue-100 outline-none transition-all';

function Modal({ title, subtitle, onClose, children }) {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={onClose} />
            <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg p-7 max-h-[90vh] overflow-y-auto">
                <div className="flex justify-between items-start mb-5">
                    <div>
                        <h2 className="text-lg font-bold text-slate-900">{title}</h2>
                        {subtitle && <p className="text-slate-500 text-sm mt-0.5">{subtitle}</p>}
                    </div>
                    <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-full text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition-colors">
                        <i className="fas fa-times" />
                    </button>
                </div>
                {children}
            </div>
        </div>
    );
}

function ActionButton({ icon, label, onClick, color = 'blue', small }) {
    const colors = {
        blue: 'bg-blue-700 hover:bg-blue-800 text-white',
        green: 'bg-green-600 hover:bg-green-700 text-white',
        purple: 'bg-purple-600 hover:bg-purple-700 text-white',
        amber: 'bg-amber-500 hover:bg-amber-600 text-white',
        slate: 'bg-slate-600 hover:bg-slate-700 text-white',
    };
    return (
        <button
            onClick={onClick}
            className={`inline-flex items-center gap-2 ${small ? 'px-3 py-1.5 text-xs' : 'px-4 py-2 text-sm'} rounded-lg font-semibold transition-colors ${colors[color]}`}
        >
            <i className={`fas ${icon}`} />
            {label}
        </button>
    );
}

// ─── Modals ───────────────────────────────────────────────────────────────────

function AddPropertyModal({ clientId, onClose, onCreated }) {
    const [form, setForm] = useState({ street1: '', street2: '', city: '', province: '', postalCode: '', country: 'US' });
    const [err, setErr] = useState(null);
    const [loading, setLoading] = useState(false);

    const submit = async (e) => {
        e.preventDefault();
        setLoading(true);
        const res = await createProperty(clientId, form);
        const errors = res?.data?.propertyCreate?.userErrors;
        if (errors?.length) { setErr(errors[0].message); setLoading(false); return; }
        onCreated(res?.data?.propertyCreate?.property);
        onClose();
    };

    const f = (k) => (e) => setForm(p => ({ ...p, [k]: e.target.value }));

    return (
        <Modal title="Add Property" subtitle="Add a service address for this client" onClose={onClose}>
            {err && <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">{err}</div>}
            <form onSubmit={submit} className="space-y-3">
                <div><label className="label">Street Address *</label><input className={inputCls} required placeholder="123 Main St" value={form.street1} onChange={f('street1')} /></div>
                <div><label className="label">Apt / Unit</label><input className={inputCls} placeholder="Apt 2B" value={form.street2} onChange={f('street2')} /></div>
                <div className="grid grid-cols-2 gap-3">
                    <div><label className="label">City *</label><input className={inputCls} required placeholder="New York" value={form.city} onChange={f('city')} /></div>
                    <div><label className="label">State *</label><input className={inputCls} required placeholder="NY" value={form.province} onChange={f('province')} /></div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                    <div><label className="label">ZIP *</label><input className={inputCls} required placeholder="10001" value={form.postalCode} onChange={f('postalCode')} /></div>
                    <div><label className="label">Country</label><input className={inputCls} value={form.country} onChange={f('country')} /></div>
                </div>
                <div className="flex gap-3 pt-2">
                    <button type="button" onClick={onClose} className="flex-1 border border-slate-200 rounded-lg py-2.5 text-slate-600 font-semibold hover:bg-slate-50 text-sm">Cancel</button>
                    <button type="submit" disabled={loading} className="flex-1 bg-blue-700 text-white rounded-lg py-2.5 font-semibold hover:bg-blue-800 text-sm disabled:opacity-60">
                        {loading ? 'Saving…' : 'Add Property'}
                    </button>
                </div>
            </form>
        </Modal>
    );
}

function CreateRequestModal({ clientId, properties, onClose, onCreated }) {
    const [form, setForm] = useState({ title: '', description: '', propertyId: '' });
    const [err, setErr] = useState(null);
    const [loading, setLoading] = useState(false);

    const submit = async (e) => {
        e.preventDefault();
        setLoading(true);
        const res = await createRequest(clientId, form.title, form.description, form.propertyId || null);
        const errors = res?.data?.requestCreate?.userErrors;
        if (errors?.length) { setErr(errors[0].message); setLoading(false); return; }
        onCreated(res?.data?.requestCreate?.request);
        onClose();
    };

    const f = (k) => (e) => setForm(p => ({ ...p, [k]: e.target.value }));

    return (
        <Modal title="Log Work Request" subtitle="Record a service need from this client" onClose={onClose}>
            {err && <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">{err}</div>}
            <form onSubmit={submit} className="space-y-3">
                <div>
                    <label className="label">What's the issue? *</label>
                    <input className={inputCls} required placeholder='e.g. "Kitchen drain backing up"' value={form.title} onChange={f('title')} />
                </div>
                <div>
                    <label className="label">Details</label>
                    <textarea className={inputCls} rows={3} placeholder="Any extra context for the team…" value={form.description} onChange={f('description')} />
                </div>
                {properties.length > 0 && (
                    <div>
                        <label className="label">Property</label>
                        <select className={inputCls} value={form.propertyId} onChange={f('propertyId')}>
                            <option value="">— Select property —</option>
                            {properties.map(p => (
                                <option key={p.id} value={p.id}>{p.address?.street1}, {p.address?.city}</option>
                            ))}
                        </select>
                    </div>
                )}
                <div className="flex gap-3 pt-2">
                    <button type="button" onClick={onClose} className="flex-1 border border-slate-200 rounded-lg py-2.5 text-slate-600 font-semibold hover:bg-slate-50 text-sm">Cancel</button>
                    <button type="submit" disabled={loading} className="flex-1 bg-amber-500 text-white rounded-lg py-2.5 font-semibold hover:bg-amber-600 text-sm disabled:opacity-60">
                        {loading ? 'Logging…' : 'Log Request'}
                    </button>
                </div>
            </form>
        </Modal>
    );
}

function CreateQuoteModal({ clientId, requests, onClose, onCreated }) {
    const [requestId, setRequestId] = useState(requests[0]?.id || '');
    const [lines, setLines] = useState([{ name: '', description: '', quantity: 1, unitPrice: '' }]);
    const [err, setErr] = useState(null);
    const [loading, setLoading] = useState(false);

    const addLine = () => setLines(l => [...l, { name: '', description: '', quantity: 1, unitPrice: '' }]);
    const removeLine = (i) => setLines(l => l.filter((_, idx) => idx !== i));
    const updateLine = (i, k, v) => setLines(l => l.map((line, idx) => idx === i ? { ...line, [k]: v } : line));

    const total = lines.reduce((s, l) => s + (Number(l.unitPrice) || 0) * (Number(l.quantity) || 0), 0);

    const submit = async (e) => {
        e.preventDefault();
        setLoading(true);
        const res = await createQuote(clientId, lines, requestId || null);
        const errors = res?.data?.quoteCreate?.userErrors;
        if (errors?.length) { setErr(errors[0].message); setLoading(false); return; }
        onCreated(res?.data?.quoteCreate?.quote);
        onClose();
    };

    return (
        <Modal title="Create Quote" subtitle="Add line items and convert a request to a quote" onClose={onClose}>
            {err && <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">{err}</div>}
            <form onSubmit={submit} className="space-y-4">
                {requests.length > 0 && (
                    <div>
                        <label className="label">Link to Request</label>
                        <select className={inputCls} value={requestId} onChange={e => setRequestId(e.target.value)}>
                            <option value="">— No linked request —</option>
                            {requests.map(r => <option key={r.id} value={r.id}>{r.title}</option>)}
                        </select>
                    </div>
                )}

                <div>
                    <div className="flex items-center justify-between mb-2">
                        <label className="label mb-0">Line Items *</label>
                        <button type="button" onClick={addLine} className="text-blue-600 text-xs font-semibold hover:text-blue-800">
                            <i className="fas fa-plus mr-1" />Add Line
                        </button>
                    </div>
                    <div className="space-y-2">
                        {lines.map((line, i) => (
                            <div key={i} className="bg-slate-50 rounded-xl p-3 space-y-2 border border-slate-100">
                                <div className="flex gap-2">
                                    <input className={`${inputCls} flex-1`} required placeholder="Service name" value={line.name} onChange={e => updateLine(i, 'name', e.target.value)} />
                                    {lines.length > 1 && (
                                        <button type="button" onClick={() => removeLine(i)} className="text-red-400 hover:text-red-600 px-2">
                                            <i className="fas fa-trash-alt text-sm" />
                                        </button>
                                    )}
                                </div>
                                <input className={inputCls} placeholder="Description (optional)" value={line.description} onChange={e => updateLine(i, 'description', e.target.value)} />
                                <div className="grid grid-cols-2 gap-2">
                                    <div>
                                        <label className="label">Qty</label>
                                        <input type="number" min="1" className={inputCls} value={line.quantity} onChange={e => updateLine(i, 'quantity', e.target.value)} />
                                    </div>
                                    <div>
                                        <label className="label">Unit Price ($)</label>
                                        <input type="number" min="0" step="0.01" className={inputCls} placeholder="0.00" value={line.unitPrice} onChange={e => updateLine(i, 'unitPrice', e.target.value)} />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="flex justify-end">
                    <div className="bg-blue-50 rounded-xl px-4 py-2 text-right">
                        <div className="text-xs text-slate-500">Estimated Total</div>
                        <div className="text-xl font-bold text-blue-900">${total.toFixed(2)}</div>
                    </div>
                </div>

                <div className="flex gap-3 pt-1">
                    <button type="button" onClick={onClose} className="flex-1 border border-slate-200 rounded-lg py-2.5 text-slate-600 font-semibold hover:bg-slate-50 text-sm">Cancel</button>
                    <button type="submit" disabled={loading} className="flex-1 bg-purple-600 text-white rounded-lg py-2.5 font-semibold hover:bg-purple-700 text-sm disabled:opacity-60">
                        {loading ? 'Creating…' : 'Create Quote'}
                    </button>
                </div>
            </form>
        </Modal>
    );
}

function ScheduleVisitModal({ jobId, onClose, onCreated }) {
    const now = new Date();
    const dateStr = now.toISOString().split('T')[0];

    const [date, setDate] = useState(dateStr);
    const [startTime, setStartTime] = useState('09:00');
    const [endTime, setEndTime] = useState('11:00');
    const [err, setErr] = useState(null);
    const [loading, setLoading] = useState(false);

    const submit = async (e) => {
        e.preventDefault();
        const startAt = new Date(`${date}T${startTime}:00`).toISOString();
        const endAt = new Date(`${date}T${endTime}:00`).toISOString();
        setLoading(true);
        const res = await createVisit(jobId, startAt, endAt);
        const errors = res?.data?.visitCreate?.userErrors;
        if (errors?.length) { setErr(errors[0].message); setLoading(false); return; }
        onCreated(res?.data?.visitCreate?.visit);
        onClose();
    };

    return (
        <Modal title="Schedule Visit" subtitle="Set a date and time block for this job" onClose={onClose}>
            {err && <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">{err}</div>}
            <form onSubmit={submit} className="space-y-3">
                <div><label className="label">Date *</label><input type="date" className={inputCls} required value={date} onChange={e => setDate(e.target.value)} /></div>
                <div className="grid grid-cols-2 gap-3">
                    <div><label className="label">Start Time *</label><input type="time" className={inputCls} required value={startTime} onChange={e => setStartTime(e.target.value)} /></div>
                    <div><label className="label">End Time *</label><input type="time" className={inputCls} required value={endTime} onChange={e => setEndTime(e.target.value)} /></div>
                </div>
                <div className="flex gap-3 pt-2">
                    <button type="button" onClick={onClose} className="flex-1 border border-slate-200 rounded-lg py-2.5 text-slate-600 font-semibold hover:bg-slate-50 text-sm">Cancel</button>
                    <button type="submit" disabled={loading} className="flex-1 bg-blue-700 text-white rounded-lg py-2.5 font-semibold hover:bg-blue-800 text-sm disabled:opacity-60">
                        {loading ? 'Scheduling…' : 'Schedule Visit'}
                    </button>
                </div>
            </form>
        </Modal>
    );
}

// ─── Section Cards ────────────────────────────────────────────────────────────

function EmptySection({ icon, text, action }) {
    return (
        <div className="flex flex-col items-center py-10 text-slate-400">
            <i className={`fas ${icon} text-3xl mb-3 text-slate-300`} />
            <p className="text-sm mb-3">{text}</p>
            {action}
        </div>
    );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

const TABS = [
    { id: 'overview', label: 'Overview', icon: 'fa-user', key: 'overview' },
    { id: 'properties', label: 'Properties', icon: 'fa-map-marker-alt', key: 'properties' },
    { id: 'requests', label: 'Requests', icon: 'fa-inbox', key: 'requests' },
    { id: 'quotes', label: 'Quotes', icon: 'fa-file-alt', key: 'quotes' },
    { id: 'jobs', label: 'Jobs', icon: 'fa-briefcase', key: 'jobs' },
    { id: 'invoices', label: 'Invoices', icon: 'fa-file-invoice-dollar', key: 'invoices' },
];

const PIPELINE = [
    { label: 'Properties', tab: 'properties', key: 'properties', icon: 'fa-map-marker-alt', color: 'text-slate-600' },
    { label: 'Request', tab: 'requests', key: 'requests', icon: 'fa-inbox', color: 'text-amber-600' },
    { label: 'Quote', tab: 'quotes', key: 'quotes', icon: 'fa-file-alt', color: 'text-purple-600' },
    { label: 'Job', tab: 'jobs', key: 'jobs', icon: 'fa-briefcase', color: 'text-blue-600' },
    { label: 'Invoice', tab: 'invoices', key: 'invoices', icon: 'fa-file-invoice-dollar', color: 'text-green-600' },
];

export default function ClientDetail() {
    const { id } = useParams();
    const decodedId = decodeURIComponent(id);

    const [client, setClient] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [activeTab, setActiveTab] = useState('overview');

    // Modal states
    const [showAddProp, setShowAddProp] = useState(false);
    const [showAddReq, setShowAddReq] = useState(false);
    const [showAddQuote, setShowAddQuote] = useState(false);
    const [scheduleJob, setScheduleJob] = useState(null); // job object
    const [confirmComplete, setConfirmComplete] = useState(null);
    const [loadingAction, setLoadingAction] = useState(null);

    const fetchClient = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const res = await getClientDetail(decodedId);
            if (res?.data?.client) {
                setClient(res.data.client);
            } else if (res?.errors) {
                setError(res.errors[0]?.message || 'Failed to load client.');
            } else {
                setError('Client not found.');
            }
        } catch {
            setError('Could not reach Jobber.');
        } finally {
            setLoading(false);
        }
    }, [decodedId]);

    useEffect(() => { fetchClient(); }, [fetchClient]);

    const properties = client?.properties || [];
    const requests = client?.requests?.nodes || [];
    const quotes = client?.quotes?.nodes || [];
    const jobs = client?.jobs?.nodes || [];
    const invoices = client?.invoices?.nodes || [];

    const handleCompleteJob = async (job) => {
        setLoadingAction(job.id);
        const res = await completeJob(job.id);
        const errors = res?.data?.jobComplete?.userErrors;
        if (!errors?.length) fetchClient();
        setLoadingAction(null);
        setConfirmComplete(null);
    };

    const handleCreateInvoice = async (jobId) => {
        setLoadingAction(jobId);
        const res = await createInvoice(jobId);
        const errors = res?.data?.invoiceCreate?.userErrors;
        if (!errors?.length) { fetchClient(); setActiveTab('invoices'); }
        setLoadingAction(null);
    };

    const handleCreateJob = async (quoteId) => {
        setLoadingAction(quoteId);
        await createJob(decodedId, quoteId);
        fetchClient();
        setActiveTab('jobs');
        setLoadingAction(null);
    };

    if (loading) return (
        <div className="flex items-center justify-center min-h-[50vh]">
            <i className="fas fa-spinner fa-spin text-3xl text-blue-400" />
        </div>
    );

    if (error) return (
        <div className="flex flex-col items-center justify-center min-h-[50vh] text-slate-500">
            <i className="fas fa-exclamation-circle text-4xl text-red-400 mb-3" />
            <p className="font-semibold">{error}</p>
            <Link to="/clients" className="mt-4 text-blue-600 hover:underline text-sm">← Back to Clients</Link>
        </div>
    );

    const initials = (client?.name || '??').split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase();
    const email = client?.emails?.[0]?.address;
    const phone = client?.phones?.[0]?.number;

    return (
        <>
            {/* Modals */}
            {showAddProp && (
                <AddPropertyModal clientId={decodedId} onClose={() => setShowAddProp(false)}
                    onCreated={() => { fetchClient(); setShowAddProp(false); }} />
            )}
            {showAddReq && (
                <CreateRequestModal clientId={decodedId} properties={properties}
                    onClose={() => setShowAddReq(false)}
                    onCreated={() => { fetchClient(); setShowAddReq(false); setActiveTab('requests'); }} />
            )}
            {showAddQuote && (
                <CreateQuoteModal clientId={decodedId} requests={requests}
                    onClose={() => setShowAddQuote(false)}
                    onCreated={() => { fetchClient(); setShowAddQuote(false); setActiveTab('quotes'); }} />
            )}
            {scheduleJob && (
                <ScheduleVisitModal jobId={scheduleJob.id}
                    onClose={() => setScheduleJob(null)}
                    onCreated={() => { fetchClient(); setScheduleJob(null); }} />
            )}

            {/* PAGE HEADER */}
            <section className="bg-gradient-to-br from-slate-900 via-blue-950 to-blue-900 text-white py-10">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <Link to="/clients" className="text-blue-300 hover:text-white text-sm font-medium flex items-center gap-2 mb-5">
                        <i className="fas fa-arrow-left" /> All Clients
                    </Link>
                    <div className="flex flex-col sm:flex-row sm:items-center gap-5">
                        <div className="w-16 h-16 bg-blue-700 rounded-2xl flex items-center justify-center text-white font-bold text-xl flex-shrink-0">
                            {initials}
                        </div>
                        <div className="flex-1">
                            <h1 className="text-3xl font-extrabold">{client.name}</h1>
                            {client.companyName && <p className="text-blue-200">{client.companyName}</p>}
                            <div className="flex flex-wrap gap-4 mt-2 text-sm text-blue-200">
                                {email && <a href={`mailto:${email}`} className="hover:text-white flex items-center gap-1"><i className="fas fa-envelope text-xs" />{email}</a>}
                                {phone && <a href={`tel:${phone}`} className="hover:text-white flex items-center gap-1"><i className="fas fa-phone text-xs" />{phone}</a>}
                            </div>
                        </div>
                    </div>

                    {/* Pipeline progress */}
                    <div className="mt-8 bg-white/10 rounded-2xl p-4">
                        <div className="flex items-center gap-2 overflow-x-auto">
                            {PIPELINE.map((step, i) => {
                                const stepData = client?.[step.key];
                                const count = (step.key === 'properties' ? stepData?.length : stepData?.nodes?.length) ?? 0;
                                const done = count > 0;
                                return (
                                    <React.Fragment key={step.label}>
                                        <button
                                            onClick={() => setActiveTab(step.tab)}
                                            className={`flex flex-col items-center gap-1 px-4 py-2 rounded-xl transition-all flex-shrink-0 ${activeTab === step.tab ? 'bg-white/20' : 'hover:bg-white/10'}`}
                                        >
                                            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${done ? 'bg-white text-blue-900' : 'bg-white/20 text-white/60'}`}>
                                                {done ? count : <i className={`fas ${step.icon} text-xs`} />}
                                            </div>
                                            <span className={`text-xs font-medium ${done ? 'text-white' : 'text-white/50'}`}>{step.label}</span>
                                        </button>
                                        {i < PIPELINE.length - 1 && (
                                            <div className={`w-6 h-0.5 flex-shrink-0 ${done ? 'bg-white/40' : 'bg-white/15'}`} />
                                        )}
                                    </React.Fragment>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </section>

            {/* TABS */}
            <div className="bg-white border-b border-slate-100 sticky top-0 z-30">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex overflow-x-auto">
                        {TABS.map(tab => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`flex items-center gap-2 px-5 py-4 text-sm font-semibold border-b-2 transition-colors whitespace-nowrap ${activeTab === tab.id ? 'border-blue-700 text-blue-700' : 'border-transparent text-slate-500 hover:text-slate-800'}`}
                            >
                                <i className={`fas ${tab.icon} text-xs`} />
                                {tab.label}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* TAB CONTENT */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

                {/* ── Overview ─────────────────────────────────────────────────── */}
                {activeTab === 'overview' && (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Contact info */}
                        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
                            <h2 className="font-bold text-slate-900 mb-4">Contact Information</h2>
                            <div className="grid grid-cols-2 gap-4 text-sm">
                                <div><div className="text-slate-400 text-xs mb-1">Full Name</div><div className="font-medium text-slate-800">{client.name}</div></div>
                                {client.companyName && <div><div className="text-slate-400 text-xs mb-1">Company</div><div className="font-medium text-slate-800">{client.companyName}</div></div>}
                                {email && <div><div className="text-slate-400 text-xs mb-1">Email</div><div className="font-medium text-slate-800">{email}</div></div>}
                                {phone && <div><div className="text-slate-400 text-xs mb-1">Phone</div><div className="font-medium text-slate-800">{phone}</div></div>}
                            </div>
                        </div>
                        {/* Quick stats */}
                        <div className="space-y-3">
                            {[
                                { label: 'Properties', val: properties.length, icon: 'fa-map-marker-alt', color: 'text-slate-600', tab: 'properties' },
                                { label: 'Requests', val: requests.length, icon: 'fa-inbox', color: 'text-amber-600', tab: 'requests' },
                                { label: 'Quotes', val: quotes.length, icon: 'fa-file-alt', color: 'text-purple-600', tab: 'quotes' },
                                { label: 'Jobs', val: jobs.length, icon: 'fa-briefcase', color: 'text-blue-600', tab: 'jobs' },
                                { label: 'Invoices', val: invoices.length, icon: 'fa-file-invoice-dollar', color: 'text-green-600', tab: 'invoices' },
                            ].map(s => (
                                <button key={s.label} onClick={() => setActiveTab(s.tab)}
                                    className="w-full bg-white rounded-xl border border-slate-100 shadow-sm p-4 flex items-center justify-between hover:border-blue-200 transition-colors">
                                    <div className="flex items-center gap-3">
                                        <i className={`fas ${s.icon} ${s.color}`} />
                                        <span className="font-medium text-slate-700 text-sm">{s.label}</span>
                                    </div>
                                    <span className="font-bold text-slate-900">{s.val}</span>
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {/* ── Properties ───────────────────────────────────────────────── */}
                {activeTab === 'properties' && (
                    <div>
                        <div className="flex items-center justify-between mb-5">
                            <h2 className="text-lg font-bold text-slate-900">Service Properties</h2>
                            <ActionButton icon="fa-plus" label="Add Property" onClick={() => setShowAddProp(true)} />
                        </div>
                        {properties.length === 0
                            ? <EmptySection icon="fa-map-marker-alt" text="No properties yet" action={<ActionButton icon="fa-plus" label="Add First Property" onClick={() => setShowAddProp(true)} />} />
                            : (
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {properties.map(p => (
                                        <div key={p.id} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
                                            <i className="fas fa-map-marker-alt text-blue-400 mb-3 text-lg" />
                                            <div className="font-semibold text-slate-900">{p.address?.street1}</div>
                                            {p.address?.street2 && <div className="text-slate-500 text-sm">{p.address.street2}</div>}
                                            <div className="text-slate-500 text-sm">{p.address?.city}, {p.address?.province} {p.address?.postalCode}</div>
                                        </div>
                                    ))}
                                </div>
                            )
                        }
                    </div>
                )}

                {/* ── Requests ─────────────────────────────────────────────────── */}
                {activeTab === 'requests' && (
                    <div>
                        <div className="flex items-center justify-between mb-5">
                            <h2 className="text-lg font-bold text-slate-900">Work Requests</h2>
                            <ActionButton icon="fa-plus" label="Log Request" onClick={() => setShowAddReq(true)} color="amber" />
                        </div>
                        {requests.length === 0
                            ? <EmptySection icon="fa-inbox" text="No requests logged yet" action={<ActionButton icon="fa-plus" label="Log First Request" color="amber" onClick={() => setShowAddReq(true)} />} />
                            : (
                                <div className="space-y-3">
                                    {requests.map(r => (
                                        <div key={r.id} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 flex items-start justify-between gap-4">
                                            <div>
                                                <div className="font-semibold text-slate-900">{r.title}</div>
                                                <div className="text-slate-400 text-xs mt-1">{fmt(r.createdAt)}</div>
                                            </div>
                                            <div className="flex items-center gap-3 flex-shrink-0">
                                                <Badge status={r.requestStatus} />
                                                <ActionButton icon="fa-file-alt" label="Quote" small color="purple" onClick={() => { setShowAddQuote(true); }} />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )
                        }
                    </div>
                )}

                {/* ── Quotes ───────────────────────────────────────────────────── */}
                {activeTab === 'quotes' && (
                    <div>
                        <div className="flex items-center justify-between mb-5">
                            <h2 className="text-lg font-bold text-slate-900">Quotes</h2>
                            <ActionButton icon="fa-plus" label="New Quote" color="purple" onClick={() => setShowAddQuote(true)} />
                        </div>
                        {quotes.length === 0
                            ? <EmptySection icon="fa-file-alt" text="No quotes yet" action={<ActionButton icon="fa-plus" label="Create First Quote" color="purple" onClick={() => setShowAddQuote(true)} />} />
                            : (
                                <div className="space-y-4">
                                    {quotes.map(q => (
                                        <div key={q.id} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
                                            <div className="flex items-start justify-between gap-4 mb-3">
                                                <div>
                                                    <div className="font-bold text-slate-900">Quote #{q.quoteNumber}</div>
                                                    <div className="text-slate-400 text-xs mt-1">{fmt(q.createdAt)}</div>
                                                </div>
                                                <div className="flex items-center gap-3">
                                                    <Badge status={q.quoteStatus} />
                                                    <div className="text-lg font-bold text-slate-900">{fmtCurrency(q.amounts?.total)}</div>
                                                </div>
                                            </div>
                                            {q.lineItems?.nodes?.length > 0 && (
                                                <div className="bg-slate-50 rounded-xl p-3 mb-3">
                                                    <table className="w-full text-sm">
                                                        <thead><tr className="text-slate-400 text-xs"><th className="text-left pb-1">Item</th><th className="text-right pb-1">Qty</th><th className="text-right pb-1">Unit</th><th className="text-right pb-1">Total</th></tr></thead>
                                                        <tbody>
                                                            {q.lineItems.nodes.map(li => (
                                                                <tr key={li.id} className="border-t border-slate-100">
                                                                    <td className="py-1 text-slate-700">{li.name}</td>
                                                                    <td className="py-1 text-right text-slate-500">{li.quantity}</td>
                                                                    <td className="py-1 text-right text-slate-500">{fmtCurrency(li.unitPrice)}</td>
                                                                    <td className="py-1 text-right font-semibold text-slate-800">{fmtCurrency(li.totalPrice)}</td>
                                                                </tr>
                                                            ))}
                                                        </tbody>
                                                    </table>
                                                </div>
                                            )}
                                            {q.quoteStatus !== 'converted' && (
                                                <ActionButton icon="fa-briefcase" label="Approve & Convert to Job" small color="blue"
                                                    onClick={() => handleCreateJob(q.id)} />
                                            )}
                                        </div>
                                    ))}
                                </div>
                            )
                        }
                    </div>
                )}

                {/* ── Jobs ─────────────────────────────────────────────────────── */}
                {activeTab === 'jobs' && (
                    <div>
                        <div className="flex items-center justify-between mb-5">
                            <h2 className="text-lg font-bold text-slate-900">Jobs</h2>
                        </div>
                        {jobs.length === 0
                            ? <EmptySection icon="fa-briefcase" text='No jobs yet — approve a quote and click "Convert to Job"' />
                            : (
                                <div className="space-y-4">
                                    {jobs.map(j => {
                                        const visits = j.visits?.nodes || [];
                                        const isLoading = loadingAction === j.id;
                                        return (
                                            <div key={j.id} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
                                                <div className="flex items-start justify-between gap-4 mb-4">
                                                    <div>
                                                        <div className="font-bold text-slate-900">{j.title || `Job #${j.jobNumber}`}</div>
                                                        <div className="text-slate-400 text-xs mt-1">Job #{j.jobNumber} · {fmt(j.createdAt)}</div>
                                                    </div>
                                                    <div className="flex items-center gap-2 flex-shrink-0">
                                                        <Badge status={j.jobStatus} />
                                                        {j.jobStatus !== 'completed' && j.jobStatus !== 'archived' && (
                                                            <ActionButton icon="fa-check" label={isLoading ? 'Saving…' : 'Complete'} small color="green"
                                                                onClick={() => handleCompleteJob(j)} />
                                                        )}
                                                        {j.jobStatus === 'completed' && (
                                                            <ActionButton icon="fa-file-invoice-dollar" label={isLoading ? 'Saving…' : 'Invoice'} small color="purple"
                                                                onClick={() => handleCreateInvoice(j.id)} />
                                                        )}
                                                    </div>
                                                </div>

                                                <div className="bg-slate-50 rounded-xl p-3">
                                                    <div className="flex items-center justify-between mb-2">
                                                        <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Scheduled Visits</span>
                                                        <ActionButton icon="fa-calendar-plus" label="Schedule Visit" small color="slate"
                                                            onClick={() => setScheduleJob(j)} />
                                                    </div>
                                                    {visits.length === 0
                                                        ? <p className="text-slate-400 text-xs">No visits scheduled yet.</p>
                                                        : (
                                                            <div className="space-y-1 mt-2">
                                                                {visits.map(v => (
                                                                    <div key={v.id} className="flex items-center gap-3 text-sm">
                                                                        <i className="fas fa-clock text-blue-400 text-xs" />
                                                                        <span className="text-slate-700">
                                                                            {v.isAnytime ? 'Anytime — ' : ''}{fmt(v.startAt)}
                                                                            {v.startAt && ` · ${new Date(v.startAt).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })} – ${new Date(v.endAt).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}`}
                                                                        </span>
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        )
                                                    }
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            )
                        }
                    </div>
                )}

                {/* ── Invoices ─────────────────────────────────────────────────── */}
                {activeTab === 'invoices' && (
                    <div>
                        <div className="flex items-center justify-between mb-5">
                            <h2 className="text-lg font-bold text-slate-900">Invoices</h2>
                        </div>
                        {invoices.length === 0
                            ? <EmptySection icon="fa-file-invoice-dollar" text='No invoices yet — complete a job to create one' />
                            : (
                                <div className="space-y-3">
                                    {invoices.map(inv => (
                                        <div key={inv.id} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 flex items-center justify-between gap-4">
                                            <div>
                                                <div className="font-bold text-slate-900">Invoice #{inv.invoiceNumber}</div>
                                                <div className="text-slate-400 text-xs mt-1">
                                                    Created {fmt(inv.createdAt)}
                                                    {inv.dueDate && ` · Due ${fmt(inv.dueDate)}`}
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <Badge status={inv.invoiceStatus} />
                                                <div className="text-lg font-bold text-slate-900">{fmtCurrency(inv.amounts?.total)}</div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )
                        }
                    </div>
                )}
            </div>

            {/* Inline style for label helper */}
            <style>{`.label { display: block; font-size: .75rem; font-weight: 600; color: #475569; margin-bottom: .375rem; }`}</style>
        </>
    );
}
