import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { getJobsWithVisits } from '../jobber';

// ─── Helpers ──────────────────────────────────────────────────────────────────

const DAY_START_HOUR = 6;   // 6am
const DAY_END_HOUR = 22;  // 10pm
const TOTAL_MINS = (DAY_END_HOUR - DAY_START_HOUR) * 60;

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

const STATUS_COLOR = {
    active: { bg: 'bg-blue-500', border: 'border-blue-600', text: 'text-white' },
    needs_scheduling: { bg: 'bg-amber-400', border: 'border-amber-500', text: 'text-white' },
    completed: { bg: 'bg-green-500', border: 'border-green-600', text: 'text-white' },
    to_invoice: { bg: 'bg-purple-500', border: 'border-purple-600', text: 'text-white' },
    bad_debt: { bg: 'bg-red-500', border: 'border-red-600', text: 'text-white' },
    archived: { bg: 'bg-slate-400', border: 'border-slate-500', text: 'text-white' },
};

const getStatusColor = (s) => STATUS_COLOR[s] || STATUS_COLOR.active;

const isSameDay = (a, b) =>
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate();

const toMinutes = (date) => date.getHours() * 60 + date.getMinutes();

const fmtTime = (d) =>
    d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });

const fmtDate = (d) =>
    d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

// startOf/endOf helpers
const startOfWeek = (d) => {
    const s = new Date(d);
    s.setDate(d.getDate() - d.getDay());
    s.setHours(0, 0, 0, 0);
    return s;
};

const startOfMonth = (d) => new Date(d.getFullYear(), d.getMonth(), 1);
const endOfMonth = (d) => new Date(d.getFullYear(), d.getMonth() + 1, 0);

// Extract events (visits) from Jobber jobs
function extractEvents(jobs) {
    const events = [];
    for (const job of jobs) {
        const visits = job.visits?.nodes || [];
        if (visits.length === 0) {
            // Fall back to job-level startAt/endAt
            if (job.startAt) {
                events.push({
                    id: `job-${job.id}`,
                    title: job.title || `Job #${job.jobNumber}`,
                    clientName: job.client?.name || '',
                    address: job.property?.address?.street1 || '',
                    start: new Date(job.startAt),
                    end: job.endAt ? new Date(job.endAt) : new Date(new Date(job.startAt).getTime() + 60 * 60 * 1000),
                    status: job.jobStatus,
                    jobId: job.id,
                });
            }
        } else {
            for (const v of visits) {
                if (!v.startAt) continue;
                events.push({
                    id: v.id,
                    title: v.title || job.title || `Job #${job.jobNumber}`,
                    clientName: job.client?.name || '',
                    address: job.property?.address?.street1 || '',
                    start: new Date(v.startAt),
                    end: v.endAt ? new Date(v.endAt) : new Date(new Date(v.startAt).getTime() + 60 * 60 * 1000),
                    status: job.jobStatus,
                    jobId: job.id,
                    isAnytime: v.isAnytime,
                });
            }
        }
    }
    return events;
}

// ─── Day View ─────────────────────────────────────────────────────────────────

function DayView({ date, events }) {
    const dayEvents = events.filter(e => isSameDay(e.start, date));
    const hours = Array.from({ length: DAY_END_HOUR - DAY_START_HOUR }, (_, i) => DAY_START_HOUR + i);

    const pct = (mins) =>
        Math.max(0, Math.min(100, ((mins - DAY_START_HOUR * 60) / TOTAL_MINS) * 100));

    return (
        <div className="flex-1 overflow-y-auto">
            <div className="relative" style={{ height: `${TOTAL_MINS * 1.2}px`, minHeight: '600px' }}>
                {/* Hour lines */}
                {hours.map(h => (
                    <div key={h} className="absolute w-full flex items-start" style={{ top: `${pct(h * 60)}%` }}>
                        <span className="text-xs text-slate-400 w-14 text-right pr-3 -mt-2 select-none">
                            {h === 12 ? '12 PM' : h < 12 ? `${h} AM` : `${h - 12} PM`}
                        </span>
                        <div className="flex-1 border-t border-slate-100" />
                    </div>
                ))}

                {/* Events */}
                <div className="absolute left-14 right-2 top-0 bottom-0">
                    {dayEvents.length === 0 && (
                        <div className="flex items-center justify-center h-full">
                            <p className="text-slate-300 text-sm">No visits scheduled for this day</p>
                        </div>
                    )}
                    {dayEvents.map(ev => {
                        const startMins = toMinutes(ev.start);
                        const endMins = toMinutes(ev.end);
                        const top = pct(startMins);
                        const height = pct(endMins) - top;
                        const c = getStatusColor(ev.status);
                        return (
                            <Link
                                to={`/clients/${encodeURIComponent(ev.jobId)}`}
                                key={ev.id}
                                className={`absolute left-1 right-1 ${c.bg} ${c.border} border-l-4 rounded-r-lg p-2 overflow-hidden cursor-pointer hover:opacity-90 transition-opacity`}
                                style={{ top: `${top}%`, height: `${Math.max(height, 3)}%` }}
                                title={`${ev.title} — ${ev.clientName}`}
                            >
                                <div className={`font-semibold text-xs ${c.text} leading-tight truncate`}>{ev.title}</div>
                                {ev.clientName && <div className={`text-xs ${c.text} opacity-80 truncate`}>{ev.clientName}</div>}
                                <div className={`text-xs ${c.text} opacity-70`}>{fmtTime(ev.start)} – {fmtTime(ev.end)}</div>
                            </Link>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}

// ─── Week View ────────────────────────────────────────────────────────────────

function WeekView({ date, events }) {
    const weekStart = startOfWeek(date);
    const days = Array.from({ length: 7 }, (_, i) => {
        const d = new Date(weekStart);
        d.setDate(weekStart.getDate() + i);
        return d;
    });

    return (
        <div className="flex-1 overflow-auto">
            {/* Header */}
            <div className="grid grid-cols-7 border-b border-slate-100 bg-slate-50 sticky top-0 z-10">
                {days.map((d, i) => {
                    const today = isSameDay(d, new Date());
                    return (
                        <div key={i} className={`text-center py-3 border-r border-slate-100 last:border-r-0`}>
                            <div className="text-xs text-slate-500 uppercase font-semibold">{DAYS[d.getDay()]}</div>
                            <div className={`mt-1 w-8 h-8 mx-auto flex items-center justify-center rounded-full text-sm font-bold ${today ? 'bg-blue-700 text-white' : 'text-slate-700'}`}>
                                {d.getDate()}
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Day columns */}
            <div className="grid grid-cols-7 min-h-[500px]">
                {days.map((d, i) => {
                    const dayEvents = events.filter(e => isSameDay(e.start, d));
                    return (
                        <div key={i} className="border-r border-slate-100 last:border-r-0 p-1.5 space-y-1 min-h-28">
                            {dayEvents.map(ev => {
                                const c = getStatusColor(ev.status);
                                return (
                                    <Link
                                        to={`/clients/${encodeURIComponent(ev.jobId)}`}
                                        key={ev.id}
                                        className={`block ${c.bg} rounded-lg p-1.5 cursor-pointer hover:opacity-90 transition-opacity`}
                                        title={`${ev.title} — ${ev.clientName}`}
                                    >
                                        <div className={`font-semibold text-xs ${c.text} leading-tight truncate`}>{ev.title}</div>
                                        {ev.clientName && <div className={`text-xs ${c.text} opacity-80 truncate`}>{ev.clientName}</div>}
                                        {!ev.isAnytime && <div className={`text-xs ${c.text} opacity-70`}>{fmtTime(ev.start)}</div>}
                                    </Link>
                                );
                            })}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

// ─── Month View ───────────────────────────────────────────────────────────────

function MonthView({ date, events }) {
    const first = startOfMonth(date);
    const last = endOfMonth(date);
    const startPad = first.getDay();

    const days = [];
    for (let i = 0; i < startPad; i++) {
        const d = new Date(first);
        d.setDate(d.getDate() - (startPad - i));
        days.push({ date: d, inMonth: false });
    }
    for (let d = 1; d <= last.getDate(); d++) {
        days.push({ date: new Date(date.getFullYear(), date.getMonth(), d), inMonth: true });
    }
    while (days.length % 7 !== 0) {
        const d = new Date(last);
        d.setDate(last.getDate() + (days.length - (last.getDate() + startPad - 1)));
        days.push({ date: d, inMonth: false });
    }

    return (
        <div className="flex-1">
            {/* Day names header */}
            <div className="grid grid-cols-7 border-b border-slate-100 bg-slate-50">
                {DAYS.map(d => (
                    <div key={d} className="text-center text-xs font-semibold text-slate-500 uppercase py-2">{d}</div>
                ))}
            </div>

            {/* Grid */}
            <div className="grid grid-cols-7">
                {days.map(({ date: d, inMonth }, i) => {
                    const today = isSameDay(d, new Date());
                    const dayEvents = events.filter(e => isSameDay(e.start, d));
                    return (
                        <div key={i} className={`border-r border-b border-slate-100 min-h-[90px] p-1.5 ${!inMonth ? 'bg-slate-50/50' : ''}`}>
                            <div className={`w-7 h-7 flex items-center justify-center rounded-full text-sm font-semibold mb-1 ${today ? 'bg-blue-700 text-white' : inMonth ? 'text-slate-800' : 'text-slate-300'}`}>
                                {d.getDate()}
                            </div>
                            <div className="space-y-0.5">
                                {dayEvents.slice(0, 3).map(ev => {
                                    const c = getStatusColor(ev.status);
                                    return (
                                        <Link
                                            to={`/clients/${encodeURIComponent(ev.jobId)}`}
                                            key={ev.id}
                                            className={`block ${c.bg} rounded px-1 py-0.5 text-xs ${c.text} truncate hover:opacity-80 transition-opacity`}
                                            title={`${ev.title} — ${ev.clientName}`}
                                        >
                                            {ev.title}
                                        </Link>
                                    );
                                })}
                                {dayEvents.length > 3 && (
                                    <div className="text-xs text-slate-400 px-1">+{dayEvents.length - 3} more</div>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

// ─── Main Schedule Page ───────────────────────────────────────────────────────

export default function Schedule() {
    const [view, setView] = useState('week');
    const [current, setCurrent] = useState(new Date());
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchJobs = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const res = await getJobsWithVisits();
            setJobs(res?.data?.jobs?.nodes || []);
        } catch {
            setError('Could not load schedule from Jobber.');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => { fetchJobs(); }, [fetchJobs]);

    const events = extractEvents(jobs);

    // Navigation
    const navigate = (dir) => {
        const d = new Date(current);
        if (view === 'day') d.setDate(d.getDate() + dir);
        if (view === 'week') d.setDate(d.getDate() + dir * 7);
        if (view === 'month') d.setMonth(d.getMonth() + dir);
        setCurrent(d);
    };

    const goToday = () => setCurrent(new Date());

    const title = () => {
        if (view === 'day') return current.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });
        if (view === 'week') {
            const ws = startOfWeek(current);
            const we = new Date(ws); we.setDate(ws.getDate() + 6);
            return `${fmtDate(ws)} – ${fmtDate(we)}, ${ws.getFullYear()}`;
        }
        return `${MONTHS[current.getMonth()]} ${current.getFullYear()}`;
    };

    const legendItems = [
        { label: 'Active', color: 'bg-blue-500' },
        { label: 'Needs Scheduling', color: 'bg-amber-400' },
        { label: 'Completed', color: 'bg-green-500' },
        { label: 'To Invoice', color: 'bg-purple-500' },
    ];

    return (
        <div className="flex flex-col h-screen overflow-hidden">
            {/* HEADER */}
            <section className="bg-gradient-to-br from-slate-900 via-blue-950 to-blue-900 text-white py-6 flex-shrink-0">
                <div className="max-w-full px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <div>
                            <span className="text-blue-300 font-semibold text-xs uppercase tracking-widest">Jobber</span>
                            <h1 className="text-3xl font-extrabold">Schedule</h1>
                        </div>

                        <div className="flex flex-wrap items-center gap-3">
                            {/* Legend */}
                            <div className="hidden lg:flex items-center gap-3">
                                {legendItems.map(l => (
                                    <div key={l.label} className="flex items-center gap-1.5">
                                        <div className={`w-3 h-3 rounded-full ${l.color}`} />
                                        <span className="text-xs text-blue-200">{l.label}</span>
                                    </div>
                                ))}
                            </div>

                            {/* View switcher */}
                            <div className="bg-white/10 rounded-xl p-1 flex gap-1">
                                {['day', 'week', 'month'].map(v => (
                                    <button
                                        key={v}
                                        onClick={() => setView(v)}
                                        className={`px-4 py-1.5 rounded-lg text-sm font-semibold capitalize transition-colors ${view === v ? 'bg-white text-blue-900' : 'text-white hover:bg-white/10'}`}
                                    >
                                        {v}
                                    </button>
                                ))}
                            </div>

                            <button onClick={fetchJobs} className="bg-white/10 hover:bg-white/20 text-white rounded-lg px-3 py-2 text-sm transition-colors" title="Refresh Schedule">
                                <i className="fas fa-sync-alt" />
                            </button>

                            <Link to="/clients?add=true" className="bg-blue-600 hover:bg-blue-500 text-white rounded-lg px-4 py-2 text-sm font-semibold transition-colors shadow-sm flex items-center gap-2 ml-2">
                                <i className="fas fa-plus" /> Schedule New Job
                            </Link>
                        </div>
                    </div>

                    {/* Date navigation */}
                    <div className="flex items-center gap-4 mt-4">
                        <button onClick={() => navigate(-1)} className="w-8 h-8 flex items-center justify-center rounded-lg bg-white/10 hover:bg-white/20 transition-colors">
                            <i className="fas fa-chevron-left text-sm" />
                        </button>
                        <button onClick={goToday} className="text-xs font-semibold bg-white/10 hover:bg-white/20 px-3 py-1.5 rounded-lg transition-colors">
                            Today
                        </button>
                        <button onClick={() => navigate(1)} className="w-8 h-8 flex items-center justify-center rounded-lg bg-white/10 hover:bg-white/20 transition-colors">
                            <i className="fas fa-chevron-right text-sm" />
                        </button>
                        <span className="text-white font-semibold text-sm">{title()}</span>

                        <div className="ml-auto flex items-center gap-2">
                            <div className={`w-2 h-2 rounded-full ${loading ? 'bg-amber-400 animate-pulse' : 'bg-green-400'}`} />
                            <span className="text-blue-200 text-xs">{loading ? 'Loading…' : `${events.length} event${events.length !== 1 ? 's' : ''}`}</span>
                        </div>
                    </div>
                </div>
            </section>

            {/* CALENDAR BODY */}
            <div className="flex-1 overflow-hidden bg-white flex flex-col">
                {loading && (
                    <div className="flex items-center justify-center flex-1">
                        <div className="text-center">
                            <i className="fas fa-spinner fa-spin text-4xl text-blue-400 mb-3" />
                            <p className="text-slate-400 text-sm">Loading schedule from Jobber…</p>
                        </div>
                    </div>
                )}

                {error && !loading && (
                    <div className="flex items-center justify-center flex-1">
                        <div className="text-center">
                            <i className="fas fa-exclamation-triangle text-4xl text-red-400 mb-3" />
                            <p className="text-slate-600 font-semibold mb-2">{error}</p>
                            <button onClick={fetchJobs} className="bg-blue-700 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-800">Retry</button>
                        </div>
                    </div>
                )}

                {!loading && !error && (
                    <div className="flex flex-col flex-1 overflow-hidden max-w-full px-4 sm:px-6 lg:px-8 py-4">
                        {events.length === 0 && (
                            <div className="flex items-center justify-center flex-1 text-center">
                                <div>
                                    <i className="fas fa-calendar-alt text-5xl text-slate-200 mb-4" />
                                    <p className="text-slate-500 font-semibold">No scheduled visits found</p>
                                    <p className="text-slate-400 text-sm mt-1">Schedule visits on a job through the Clients page.</p>
                                    <Link to="/clients" className="mt-4 inline-block text-blue-600 hover:underline text-sm">→ Go to Clients</Link>
                                </div>
                            </div>
                        )}

                        {events.length > 0 && view === 'day' && <DayView date={current} events={events} />}
                        {events.length > 0 && view === 'week' && <WeekView date={current} events={events} />}
                        {events.length > 0 && view === 'month' && <MonthView date={current} events={events} />}
                    </div>
                )}
            </div>
        </div>
    );
}
