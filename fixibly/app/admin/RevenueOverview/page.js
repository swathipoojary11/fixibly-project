"use client";
import React from "react";
import { useAdminStore } from "../AdminStore";
import RevenueCard from "../../components/admin/RevenueCard";
import {
    AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid,
    Tooltip, Legend, ResponsiveContainer,
} from "recharts";
import { FiArrowLeft } from "react-icons/fi";

const CustomTooltip = ({ active, payload, label }) => {
    if (!active || !payload?.length) return null;
    return (
        <div className="bg-white border border-gray-100 rounded-xl shadow-card p-3 text-xs">
            <p className="font-semibold text-dark-800 mb-1">{label}</p>
            {payload.map((p, i) => (
                <p key={i} style={{ color: p.color }} className="font-medium">
                    {p.name}: {p.name?.toLowerCase().includes("revenue") ? `₹${Number(p.value).toLocaleString()}` : p.value}
                </p>
            ))}
        </div>
    );
};

const RevenueOverview = ({ onBack = () => {} }) => {
    const { getLiveStats, loading, fetchError } = useAdminStore();
    const { kpi, charts } = getLiveStats();

    if (loading) return (
        <div className="flex items-center justify-center h-64">
            <div className="w-8 h-8 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
        </div>
    );

    if (fetchError) return (
        <div className="ff-card p-6 border-red-100 bg-red-50 text-center">
            <p className="text-red-600 font-semibold text-sm">Failed to load revenue data</p>
            <p className="text-xs text-red-400 mt-1">{fetchError}</p>
            <button onClick={() => window.location.reload()} className="mt-3 ff-btn-primary text-xs">Retry</button>
        </div>
    );

    const monthlyTrend = charts.monthlyRevenueTrend || [];
    const hasRevenue = monthlyTrend.some(m => m.revenue > 0);
    const hasBookings = monthlyTrend.some(m => m.bookings > 0);

    return (
        <div className="space-y-6 animate-fadeIn">
            <button onClick={onBack} className="flex items-center gap-2 text-sm text-gray-500 hover:text-dark-900 transition-colors">
                <FiArrowLeft className="w-4 h-4" /> Back to Dashboard
            </button>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <RevenueCard label="Today's Revenue"  amount={kpi.expectedRevenueToday}  period="Estimated from completed payments" />
                <RevenueCard label="This Week"        amount={kpi.expectedRevenueWeek}   period="Last 7 days" />
                <RevenueCard label="This Month"       amount={kpi.expectedRevenueMonth}  period="Last 30 days" />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="ff-card p-4">
                    <p className="text-xs text-gray-400">Avg Booking Value</p>
                    <p className="text-2xl font-bold text-dark-900">
                        {kpi.avgBookingValue > 0 ? `₹${kpi.avgBookingValue.toLocaleString()}` : "—"}
                    </p>
                </div>
                <div className="ff-card p-4">
                    <p className="text-xs text-gray-400">Monthly Growth</p>
                    <p className="text-2xl font-bold text-green-600">
                        {kpi.monthlyGrowth > 0 ? `+${kpi.monthlyGrowth}%` : "—"}
                    </p>
                </div>
            </div>

            <div className="ff-card p-5">
                <p className="ff-section-title mb-4">Monthly Revenue Trend</p>
                {hasRevenue ? (
                    <ResponsiveContainer width="100%" height={240}>
                        <AreaChart data={monthlyTrend}>
                            <defs>
                                <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%"  stopColor="#F97316" stopOpacity={0.15} />
                                    <stop offset="95%" stopColor="#F97316" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" />
                            <XAxis dataKey="month"   tick={{ fontSize: 11, fill: "#9CA3AF" }} axisLine={false} tickLine={false} />
                            <YAxis tick={{ fontSize: 11, fill: "#9CA3AF" }} axisLine={false} tickLine={false}
                                tickFormatter={v => `₹${(v / 1000).toFixed(0)}k`} />
                            <Tooltip content={<CustomTooltip />} />
                            <Legend wrapperStyle={{ fontSize: 11 }} />
                            <Area type="monotone" dataKey="revenue" name="Revenue" stroke="#F97316" strokeWidth={2} fill="url(#revGrad)" />
                        </AreaChart>
                    </ResponsiveContainer>
                ) : (
                    <div className="h-40 flex items-center justify-center text-gray-400 text-sm">
                        No payment data available yet
                    </div>
                )}
            </div>

            <div className="ff-card p-5">
                <p className="ff-section-title mb-4">Monthly Bookings</p>
                {hasBookings ? (
                    <ResponsiveContainer width="100%" height={200}>
                        <BarChart data={monthlyTrend} barSize={20}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" />
                            <XAxis dataKey="month"    tick={{ fontSize: 11, fill: "#9CA3AF" }} axisLine={false} tickLine={false} />
                            <YAxis                    tick={{ fontSize: 11, fill: "#9CA3AF" }} axisLine={false} tickLine={false} />
                            <Tooltip content={<CustomTooltip />} />
                            <Bar dataKey="bookings" name="Bookings" fill="#F97316" radius={[4, 4, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                ) : (
                    <div className="h-40 flex items-center justify-center text-gray-400 text-sm">
                        No booking data available yet
                    </div>
                )}
            </div>
        </div>
    );
};

export default RevenueOverview;
