"use client";
import React from "react";
import { useAppStore } from "../../context/AppStore";
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
        <p key={i} style={{ color: p.color }} className="font-medium">{p.name}: {typeof p.value === "number" && p.name?.toLowerCase().includes("revenue") ? `₹${p.value.toLocaleString()}` : p.value}</p>
      ))}
    </div>
  );
};

const defaultRevenueTrend = [
  { month: "Jan", revenue: 150000, bookings: 45 },
  { month: "Feb", revenue: 180000, bookings: 52 },
  { month: "Mar", revenue: 210000, bookings: 60 },
  { month: "Apr", revenue: 250000, bookings: 75 },
];

const RevenueOverview = ({ onBack }) => {
  const { getLiveStats } = useAppStore();
  const { kpi, charts } = getLiveStats();

  const monthlyTrendData = charts?.monthlyRevenueTrend?.length > 0 ? charts.monthlyRevenueTrend : defaultRevenueTrend;

  return (
    <div className="space-y-6 animate-fadeIn">
      <button onClick={onBack} className="flex items-center gap-2 text-sm text-gray-500 hover:text-dark-900 transition-colors">
        <FiArrowLeft className="w-4 h-4" /> Back to Dashboard
      </button>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <RevenueCard label="Today's Revenue" amount={kpi?.expectedRevenueToday ?? kpi?.revenueToday ?? 12500} growth={10.2} period="Estimated based on bookings" />
        <RevenueCard label="This Week" amount={kpi?.expectedRevenueWeek ?? 85000} growth={8.5} period="Jan 9 – Jan 15, 2025" />
        <RevenueCard label="This Month" amount={kpi?.expectedRevenueMonth ?? 340000} growth={12.5} period="January 2025" />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="ff-card p-4">
          <p className="text-xs text-gray-400">Avg Booking Value</p>
          <p className="text-2xl font-bold text-dark-900">₹{(kpi?.avgBookingValue ?? 450).toLocaleString()}</p>
        </div>
        <div className="ff-card p-4">
          <p className="text-xs text-gray-400">Monthly Growth</p>
          <p className="text-2xl font-bold text-green-600">+{kpi?.monthlyGrowth ?? 12}%</p>
        </div>
      </div>

      <div className="ff-card p-5">
        <p className="ff-section-title mb-4">Monthly Revenue Trend</p>
        <ResponsiveContainer width="100%" height={240}>
          <AreaChart data={monthlyTrendData}>
            <defs>
              <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#F97316" stopOpacity={0.15} />
                <stop offset="95%" stopColor="#F97316" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" />
            <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#9CA3AF" }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 11, fill: "#9CA3AF" }} axisLine={false} tickLine={false} tickFormatter={v => `₹${(v/1000).toFixed(0)}k`} />
            <Tooltip content={<CustomTooltip />} />
            <Legend wrapperStyle={{ fontSize: 11 }} />
            <Area type="monotone" dataKey="revenue" name="Revenue" stroke="#F97316" strokeWidth={2} fill="url(#revGrad)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="ff-card p-5">
        <p className="ff-section-title mb-4">Monthly Bookings</p>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={monthlyTrendData} barSize={20}>
            <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" />
            <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#9CA3AF" }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 11, fill: "#9CA3AF" }} axisLine={false} tickLine={false} />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="bookings" name="Bookings" fill="#F97316" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default RevenueOverview;
