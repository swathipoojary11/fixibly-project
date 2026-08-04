import React from "react";

function StatsCard({ title, value, subtitle, icon, color = "orange" }) {
  const colors = {
    orange: { bg: "bg-orange-50", text: "text-orange-600", icon: "bg-orange-100 text-orange-600" },
    green:  { bg: "bg-green-50",  text: "text-green-600",  icon: "bg-green-100 text-green-600"  },
    red:    { bg: "bg-red-50",    text: "text-red-500",    icon: "bg-red-100 text-red-500"      },
    blue:   { bg: "bg-blue-50",   text: "text-blue-600",   icon: "bg-blue-100 text-blue-600"    },
  };
  const c = colors[color] || colors.orange;

  return (
    <div className={`rounded-2xl px-5 py-4 ${c.bg} flex items-center gap-4`}>
      <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${c.icon}`}>
        {icon}
      </div>
      <div>
        <p className="text-xs font-medium text-gray-500 mb-0.5">{title}</p>
        <p className={`text-2xl font-bold ${c.text}`}>{value}</p>
        {subtitle && <p className="text-xs text-gray-400 mt-0.5">{subtitle}</p>}
      </div>
    </div>
  );
}

export default StatsCard;
