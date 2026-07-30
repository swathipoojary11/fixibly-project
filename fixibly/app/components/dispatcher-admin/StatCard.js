// src/components/common/StatCard.jsx
import React from "react";

const StatCard = ({ label, value, sub, color = "orange" }) => {
  const colors = {
    orange: "bg-orange-50 text-primary",
    green: "bg-green-50 text-green-600",
    red: "bg-red-50 text-red-500",
    blue: "bg-blue-50 text-blue-600",
    purple: "bg-purple-50 text-purple-600",
    yellow: "bg-yellow-50 text-yellow-600",
  };
  return (
    <div className={`rounded-xl px-4 py-3 ${colors[color].split(" ")[0]}`}>
      <p className="text-xs font-medium text-gray-500 mb-0.5">{label}</p>
      <p className={`text-2xl font-bold ${colors[color].split(" ")[1]}`}>{value}</p>
      {sub && <p className="text-xs text-gray-400 mt-0.5">{sub}</p>}
    </div>
  );
};

export default StatCard;
