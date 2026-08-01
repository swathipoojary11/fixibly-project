"use client";
import React from "react";
import {
    FiCalendar, FiClock, FiTool, FiCheckCircle, FiXCircle,
    FiAlertTriangle, FiZap, FiUsers, FiDollarSign,
} from "react-icons/fi";
import {
    AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from "recharts";
import { useAdminStore } from "../AdminStore";

const CustomTooltip = ({ active, payload, label }) => {
    if (!active || !payload?.length) return null;
    return (
        <div className="bg-white border border-gray-100 rounded-xl shadow-card p-3 text-xs">
            <p className="font-semibold text-dark-800 mb-1">{label}</p>
            {payload.map((p, i) => (
                <p key={i} style={{ color: p.color }} className="font-medium">{p.name}: {p.value}</p>
            ))}
        </div>
    );
};

const colorMap = {
    orange: { bg: "bg-orange-50", icon: "text-primary",    border: "border-orange-100" },
    yellow: { bg: "bg-yellow-50", icon: "text-yellow-600", border: "border-yellow-100" },
    blue:   { bg: "bg-blue-50",   icon: "text-blue-600",   border: "border-blue-100"   },
    green:  { bg: "bg-green-50",  icon: "text-green-600",  border: "border-green-100"  },
    red:    { bg: "bg-red-50",    icon: "text-red-500",    border: "border-red-100"    },
    purple: { bg: "bg-purple-50", icon: "text-purple-600", border: "border-purple-100" },
    cyan:   { bg: "bg-cyan-50",   icon: "text-cyan-600",   border: "border-cyan-100"   },
};

const Dashboard = ({ onNavigate }) => {
    const { getLiveStats, userCounts, loading, fetchError } = useAdminStore();
    const { kpi, charts } = getLiveStats();

    if (loading) return (
        <div className="flex items-center justify-center h-64">
            <div className="w-8 h-8 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
        </div>
    );

    if (fetchError) return (
        <div className="ff-card p-6 border-red-100 bg-red-50 text-center">
            <p className="text-red-600 font-semibold text-sm">Failed to load dashboard</p>
            <p className="text-xs text-red-400 mt-1">{fetchError}</p>
            <button onClick={() => window.location.reload()} className="mt-3 ff-btn-primary text-xs">Retry</button>
        </div>
    );

    const kpis = [
        { icon: FiUsers,       label: "Total Users",          value: userCounts.total,        color: "blue",   nav: "users"        },
        { icon: FiUsers,       label: "Total Customers",      value: userCounts.customers,    color: "cyan",   nav: "users"        },
        { icon: FiTool,        label: "Total Technicians",    value: userCounts.technicians,  color: "orange", nav: "technicians"  },
        { icon: FiCheckCircle, label: "Dispatchers",          value: userCounts.dispatchers,  color: "purple", nav: "users"        },
        { icon: FiCalendar,    label: "Today's Bookings",     value: kpi.totalBookingsToday,  color: "orange", nav: "bookings"     },
        { icon: FiClock,       label: "Pending Bookings",     value: kpi.pendingBookings,     color: "yellow", nav: "bookings"     },
        { icon: FiCheckCircle, label: "Completed Bookings",   value: kpi.completedJobs,       color: "green",  nav: "bookings"     },
        { icon: FiDollarSign,  label: "Revenue Today",        value: `₹${(kpi.expectedRevenueToday || 0).toLocaleString()}`, color: "green", nav: "revenue" },
        { icon: FiAlertTriangle,label: "Late Jobs",           value: kpi.lateJobs,            color: "red",    nav: "bookings"     },
        { icon: FiUsers,       label: "Active Technicians",   value: kpi.activeTechnicians,   color: "green",  nav: "technicians"  },
        { icon: FiZap,         label: "Emergency Bookings",   value: kpi.emergencyBookings,   color: "red",    nav: "bookings"     },
    ];

    return (
        <div className="space-y-6 animate-fadeIn">
            <div>
                <p className="ff-section-title mb-4">Key Metrics</p>
                <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-4">
                    {kpis.slice(0, 4).map((k, i) => {
                        const c = colorMap[k.color] || colorMap.orange;
                        return (
                            <button key={i} onClick={() => onNavigate(k.nav)}
                                className={`ff-card p-5 border ${c.border} group text-left cursor-pointer hover:-translate-y-0.5 transition-all duration-200`}>
                                <div className="flex items-start justify-between mb-4">
                                    <div className={`w-11 h-11 rounded-xl ${c.bg} flex items-center justify-center group-hover:scale-110 transition-transform duration-200`}>
                                        <k.icon className={`w-5 h-5 ${c.icon}`} />
                                    </div>
                                </div>
                                <p className="text-2xl font-bold text-dark-900 mb-0.5">{k.value}</p>
                                <p className="text-xs font-semibold text-dark-700">{k.label}</p>
                            </button>
                        );
                    })}
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-4 mt-4">
                    {kpis.slice(4).map((k, i) => {
                        const c = colorMap[k.color] || colorMap.orange;
                        return (
                            <button key={i} onClick={() => onNavigate(k.nav)}
                                className={`ff-card p-5 border ${c.border} group text-left cursor-pointer hover:-translate-y-0.5 transition-all duration-200`}>
                                <div className="flex items-start justify-between mb-4">
                                    <div className={`w-11 h-11 rounded-xl ${c.bg} flex items-center justify-center group-hover:scale-110 transition-transform duration-200`}>
                                        <k.icon className={`w-5 h-5 ${c.icon}`} />
                                    </div>
                                </div>
                                <p className="text-2xl font-bold text-dark-900 mb-0.5">{k.value}</p>
                                <p className="text-xs font-semibold text-dark-700">{k.label}</p>
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Charts Row 1 */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                <div className="ff-card p-5 lg:col-span-2">
                    <p className="ff-section-title mb-4">Weekly Booking Trend</p>
                    <ResponsiveContainer width="100%" height={220}>
                        <AreaChart data={charts.weeklyBookingTrend}>
                            <defs>
                                <linearGradient id="bookGrad" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%"  stopColor="#F97316" stopOpacity={0.15} />
                                    <stop offset="95%" stopColor="#F97316" stopOpacity={0} />
                                </linearGradient>
                                <linearGradient id="compGrad" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%"  stopColor="#22C55E" stopOpacity={0.15} />
                                    <stop offset="95%" stopColor="#22C55E" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" />
                            <XAxis dataKey="day"       tick={{ fontSize: 11, fill: "#9CA3AF" }} axisLine={false} tickLine={false} />
                            <YAxis                     tick={{ fontSize: 11, fill: "#9CA3AF" }} axisLine={false} tickLine={false} />
                            <Tooltip content={<CustomTooltip />} />
                            <Legend wrapperStyle={{ fontSize: 11 }} />
                            <Area type="monotone" dataKey="bookings"  name="Bookings"  stroke="#F97316" strokeWidth={2} fill="url(#bookGrad)" />
                            <Area type="monotone" dataKey="completed" name="Completed" stroke="#22C55E" strokeWidth={2} fill="url(#compGrad)" />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>

                <button className="ff-card p-5 text-left cursor-pointer hover:border-orange-200 transition-all" onClick={() => onNavigate("bookings")}>
                    <p className="ff-section-title mb-4">Booking Status</p>
                    <ResponsiveContainer width="100%" height={180}>
                        <PieChart>
                            <Pie data={charts.bookingStatusDistribution} cx="50%" cy="50%" innerRadius={50} outerRadius={75} paddingAngle={3} dataKey="value">
                                {charts.bookingStatusDistribution.map((entry, i) => (
                                    <Cell key={i} fill={entry.color} />
                                ))}
                            </Pie>
                            <Tooltip formatter={(v, n) => [v, n]} />
                        </PieChart>
                    </ResponsiveContainer>
                    <div className="space-y-1.5 mt-2">
                        {charts.bookingStatusDistribution.map((d, i) => (
                            <div key={i} className="flex items-center justify-between text-xs">
                                <div className="flex items-center gap-2">
                                    <div className="w-2.5 h-2.5 rounded-full" style={{ background: d.color }} />
                                    <span className="text-gray-500">{d.name}</span>
                                </div>
                                <span className="font-semibold text-dark-700">{d.value}</span>
                            </div>
                        ))}
                    </div>
                </button>
            </div>

            {/* Charts Row 2 */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div className="ff-card p-5">
                    <p className="ff-section-title mb-4">Emergency vs Normal Jobs</p>
                    <ResponsiveContainer width="100%" height={200}>
                        <BarChart data={charts.emergencyVsNormal} barSize={16}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" />
                            <XAxis dataKey="month"    tick={{ fontSize: 11, fill: "#9CA3AF" }} axisLine={false} tickLine={false} />
                            <YAxis                    tick={{ fontSize: 11, fill: "#9CA3AF" }} axisLine={false} tickLine={false} />
                            <Tooltip content={<CustomTooltip />} />
                            <Legend wrapperStyle={{ fontSize: 11 }} />
                            <Bar dataKey="normal"    name="Normal"    fill="#F97316" radius={[4, 4, 0, 0]} />
                            <Bar dataKey="emergency" name="Emergency" fill="#EF4444" radius={[4, 4, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>

                <div className="ff-card p-5">
                    <p className="ff-section-title mb-4">Today's Booking Volume</p>
                    <ResponsiveContainer width="100%" height={200}>
                        <LineChart data={charts.dailyBookingVolume}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" />
                            <XAxis dataKey="hour"     tick={{ fontSize: 10, fill: "#9CA3AF" }} axisLine={false} tickLine={false} interval={2} />
                            <YAxis                    tick={{ fontSize: 11, fill: "#9CA3AF" }} axisLine={false} tickLine={false} />
                            <Tooltip content={<CustomTooltip />} />
                            <Line type="monotone" dataKey="bookings" name="Bookings" stroke="#F97316" strokeWidth={2.5} dot={{ fill: "#F97316", r: 3 }} activeDot={{ r: 5 }} />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Technician Workload */}
            <button className="ff-card p-5 w-full text-left cursor-pointer hover:border-orange-200 transition-all" onClick={() => onNavigate("technicians")}>
                <p className="ff-section-title mb-4">Technician Workload <span className="text-xs font-normal text-gray-400 ml-1">(click to view details)</span></p>
                <ResponsiveContainer width="100%" height={200}>
                    <BarChart data={charts.technicianWorkload} barSize={20}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" />
                        <XAxis dataKey="name"      tick={{ fontSize: 11, fill: "#9CA3AF" }} axisLine={false} tickLine={false} />
                        <YAxis                     tick={{ fontSize: 11, fill: "#9CA3AF" }} axisLine={false} tickLine={false} />
                        <Tooltip content={<CustomTooltip />} />
                        <Legend wrapperStyle={{ fontSize: 11 }} />
                        <Bar dataKey="jobs"      name="Assigned"  fill="#F97316" radius={[4, 4, 0, 0]} />
                        <Bar dataKey="completed" name="Completed" fill="#22C55E" radius={[4, 4, 0, 0]} />
                    </BarChart>
                </ResponsiveContainer>
            </button>
        </div>
    );
};

export default Dashboard;
