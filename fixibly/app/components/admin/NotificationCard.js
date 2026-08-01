import React from "react";
import {
    FiBell, FiAlertTriangle, FiX, FiClock,
    FiSettings, FiCheckCircle, FiNavigation, FiMapPin, FiZap
} from "react-icons/fi";

// Maps notification_type (from DB) → icon + colour
const typeIconMap = {
    Emergency:    { icon: FiZap,          bg: "bg-red-50",    color: "text-red-500"    },
    Booking:      { icon: FiBell,         bg: "bg-orange-50", color: "text-primary"    },
    Assignment:   { icon: FiCheckCircle,  bg: "bg-green-50",  color: "text-green-500"  },
    Cancellation: { icon: FiX,            bg: "bg-red-50",    color: "text-red-500"    },
    Delay:        { icon: FiClock,        bg: "bg-purple-50", color: "text-purple-500" },
    System:       { icon: FiSettings,     bg: "bg-blue-50",   color: "text-blue-500"   },
    OnTheWay:     { icon: FiNavigation,   bg: "bg-cyan-50",   color: "text-cyan-500"   },
    Arrived:      { icon: FiMapPin,       bg: "bg-indigo-50", color: "text-indigo-500" },
};

const NotificationCard = ({ notification, onMarkRead }) => {
    const typeKey = notification.notification_type || notification.type || "System";
    const { icon: Icon, bg, color } = typeIconMap[typeKey] || typeIconMap.System;

    const bookingId = notification.booking_id
        ? `#${notification.booking_id}`
        : null;

    return (
        <div className={`ff-card p-4 flex flex-col gap-3 transition-all duration-200 ${!notification.read ? "border-l-4 border-l-primary bg-orange-50/10" : ""}`}>
            <div className="flex gap-3">
                <div className={`w-10 h-10 rounded-xl ${bg} flex items-center justify-center shrink-0`}>
                    <Icon className={`w-5 h-5 ${color}`} />
                </div>
                <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                        <div>
                            <p className={`text-sm font-bold ${!notification.read ? "text-dark-900" : "text-dark-700"}`}>
                                {notification.title}
                            </p>
                            <p className="text-xs text-gray-500 mt-1">{notification.description}</p>
                        </div>
                        {!notification.read && (
                            <button
                                onClick={() => onMarkRead && onMarkRead(notification.id)}
                                className="shrink-0 w-2 h-2 rounded-full bg-primary mt-1.5"
                                title="Mark as read"
                            />
                        )}
                    </div>
                </div>
            </div>

            <div className="flex items-center justify-between mt-1">
                <span className="text-[10px] font-bold text-primary bg-orange-50 px-2 py-0.5 rounded-md uppercase tracking-wider">
                    {typeKey}
                </span>
                <div className="flex items-center gap-3 text-xs text-gray-400">
                    {bookingId && <span className="font-mono text-primary">{bookingId}</span>}
                    <span>
                        {notification.created_at
                            ? new Date(notification.created_at).toLocaleString([], { dateStyle: "short", timeStyle: "short" })
                            : "—"}
                    </span>
                </div>
            </div>
        </div>
    );
};

export default NotificationCard;
