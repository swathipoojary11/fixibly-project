// src/components/admin/RevenueCard.jsx
import React from "react";
import { FiTrendingUp } from "react-icons/fi";

const RevenueCard = ({ label, amount, growth, period }) => (
  <div className="ff-card p-5 hover:border-orange-200">
    <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">{label}</p>
    <p className="text-3xl font-bold text-dark-900 mb-1">
      ₹{amount.toLocaleString()}
    </p>
    <p className="text-xs text-gray-400 mb-3">{period}</p>
    {growth !== undefined && (
      <div className="flex items-center gap-1.5 text-green-500 text-xs font-semibold">
        <FiTrendingUp className="w-3.5 h-3.5" />
        <span>+{growth}% vs last period</span>
      </div>
    )}
  </div>
);

export default RevenueCard;
