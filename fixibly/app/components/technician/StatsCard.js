import React from "react";

function StatsCard({ title, value, subtitle, icon }) {
  return (
    <div className="bg-white rounded-none p-7 border border-[#ECECEC] shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-0.5">
      <div className="flex justify-between items-start gap-4">
        <div>
          <p className="text-[#7B7B7B] text-xs font-bold uppercase tracking-wider mb-2">{title}</p>
          <h3 className="text-2xl font-extrabold text-[#202020]">{value}</h3>
          <p className="text-xs font-semibold text-[#9A9A9A] mt-3">{subtitle}</p>
        </div>
        <div className="w-14 h-14 rounded-none bg-[#FFF3EE] text-[#F54C0F] border border-[#F54C0F]/20 flex items-center justify-center shadow-sm shrink-0">
          {icon}
        </div>
      </div>
    </div>
  );
}

export default StatsCard;
