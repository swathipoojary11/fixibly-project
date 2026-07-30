// src/components/admin/KPICard.jsx
import React from "react";
import { FiTrendingUp, FiTrendingDown, FiMinus } from "react-icons/fi";

const KPICard = ({ icon: Icon, label, value, description, trend, trendValue, color = "orange", prefix = "" }) => {
  const colorMap = {
    orange: { bg: "bg-orange-50", icon: "text-primary", border: "border-orange-100" },
    green:  { bg: "bg-green-50",  icon: "text-green-600", border: "border-green-100" },
    red:    { bg: "bg-red-50",    icon: "text-red-500",   border: "border-red-100" },
    blue:   { bg: "bg-blue-50",   icon: "text-blue-600",  border: "border-blue-100" },
    purple: { bg: "bg-purple-50", icon: "text-purple-600",border: "border-purple-100" },
    yellow: { bg: "bg-yellow-50", icon: "text-yellow-600",border: "border-yellow-100" },
    cyan:   { bg: "bg-cyan-50",   icon: "text-cyan-600",  border: "border-cyan-100" },
  };
  const c = colorMap[color] || colorMap.orange;
  const TrendIcon = trend === "up" ? FiTrendingUp : trend === "down" ? FiTrendingDown : FiMinus;
  const trendColor = trend === "up" ? "text-green-500" : trend === "down" ? "text-red-500" : "text-gray-400";

  return (
    <div className={`ff-card p-5 group cursor-default border ${c.border}`}>
      <div className="flex items-start justify-between mb-4">
        <div className={`w-11 h-11 rounded-xl ${c.bg} flex items-center justify-center group-hover:scale-110 transition-transform duration-200`}>
          <Icon className={`w-5 h-5 ${c.icon}`} />
        </div>
        {trendValue !== undefined && (
          <div className={`flex items-center gap-1 text-xs font-semibold ${trendColor}`}>
            <TrendIcon className="w-3.5 h-3.5" />
            <span>{trendValue}%</span>
          </div>
        )}
      </div>
      <div>
        <p className="text-2xl font-bold text-dark-900 mb-0.5">
          {prefix}{typeof value === "number" ? value.toLocaleString() : value}
        </p>
        <p className="text-sm font-semibold text-dark-700">{label}</p>
        {description && <p className="text-xs text-gray-400 mt-1">{description}</p>}
      </div>
    </div>
  );
};

export default KPICard;
