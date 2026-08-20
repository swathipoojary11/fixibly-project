import React from "react";
import { FiCalendar, FiUser } from "react-icons/fi";

const ActivityTimeline = ({ logs }) => (
    <div className="space-y-0">
        {logs.map((log, i) => (
            <div key={log.id ?? i} className="flex gap-4 group">
                <div className="flex flex-col items-center">
                    <div className="w-3 h-3 rounded-full bg-primary mt-1.5 shrink-0 group-hover:scale-125 transition-transform duration-200" />
                    {i < logs.length - 1 && <div className="w-0.5 bg-gray-100 flex-1 mt-1" />}
                </div>
                <div className="pb-5 flex-1">
                    <div className="ff-card p-4 hover:border-orange-200">
                        <div className="flex items-start justify-between gap-2 flex-wrap">
                            <div>
                                <p className="text-sm font-semibold text-dark-800">{log.action || "System Event"}</p>
                                <p className="text-xs text-gray-500 mt-0.5">{log.description || "—"}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-4 mt-2 text-xs text-gray-400">
                            <span className="flex items-center gap-1">
                                <FiUser className="w-3 h-3" />
                                {log.actor || "System"}
                            </span>
                            <span className="flex items-center gap-1">
                                <FiCalendar className="w-3 h-3" />
                                {log.timestamp
                                    ? new Date(log.timestamp).toLocaleString([], { dateStyle: "short", timeStyle: "short" })
                                    : "—"}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        ))}
    </div>
);

export default ActivityTimeline;
