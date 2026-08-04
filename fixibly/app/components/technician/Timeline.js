import React from "react";
import { Clock } from "lucide-react";

function Timeline({ timeline }) {
  const items = Array.isArray(timeline) && timeline.length > 0 ? timeline.slice(0, 4) : [];

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
      <div className="flex items-center gap-3 mb-5">
        <div className="w-10 h-10 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center">
          <Clock size={20} />
        </div>
        <div>
          <h3 className="text-base font-bold text-gray-900">Today's Schedule</h3>
          <p className="text-xs text-gray-500">Upcoming field workload</p>
        </div>
      </div>

      <div className="space-y-3">
        {items.length === 0 ? (
          <div className="text-center py-8 text-gray-400">
            <Clock size={32} className="mx-auto mb-2 opacity-30" />
            <p className="text-sm text-gray-500">No jobs scheduled right now</p>
          </div>
        ) : (
          items.map((item, index) => (
            <div key={index} className="flex items-center gap-3">
              <span className="bg-orange-50 text-orange-600 border border-orange-100 text-xs font-bold px-3 py-1.5 rounded-xl shrink-0 min-w-[4rem] text-center">
                {item.time}
              </span>
              <span className="flex-1 bg-gray-50 border border-gray-100 text-gray-700 text-xs font-medium px-3 py-2 rounded-xl truncate">
                {item.task}
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default Timeline;
