// src/components/admin/NotificationCard.jsx
import React from "react";
import { FiBell, FiAlertTriangle, FiX, FiClock, FiSettings, FiCheckCircle, FiNavigation, FiMapPin } from "react-icons/fi";

const iconMap = {
  alert:     { icon: FiAlertTriangle, bg: "bg-red-50",    color: "text-red-500" },
  booking:   { icon: FiBell,          bg: "bg-orange-50", color: "text-primary" },
  delay:     { icon: FiClock,         bg: "bg-purple-50", color: "text-purple-500" },
  cancel:    { icon: FiX,             bg: "bg-red-50",    color: "text-red-500" },
  system:    { icon: FiSettings,      bg: "bg-blue-50",   color: "text-blue-500" },
  accept:    { icon: FiCheckCircle,   bg: "bg-green-50",  color: "text-green-500" },
  journey:   { icon: FiNavigation,    bg: "bg-cyan-50",   color: "text-cyan-500" },
  onway:     { icon: FiNavigation,    bg: "bg-cyan-50",   color: "text-cyan-500" },
  arrived:   { icon: FiMapPin,        bg: "bg-indigo-50", color: "text-indigo-500" },
  completed: { icon: FiCheckCircle,   bg: "bg-green-50",  color: "text-green-500" },
};

const NotificationCard = ({ notification, onMarkRead }) => {
  const { icon: Icon, bg, color } = iconMap[notification.icon] || iconMap.booking;
  return (
    <div className={`ff-card p-4 flex gap-3 transition-all duration-200 ${!notification.read ? "border-l-4 border-l-primary bg-orange-50/30" : ""}`}>
      <div className={`w-10 h-10 rounded-xl ${bg} flex items-center justify-center shrink-0`}>
        <Icon className={`w-5 h-5 ${color}`} />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <div>
            <p className={`text-sm font-semibold ${!notification.read ? "text-dark-900" : "text-dark-700"}`}>{notification.title}</p>
            <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">{notification.description}</p>
          </div>
          {!notification.read && (
            <button onClick={() => onMarkRead && onMarkRead(notification.id)} className="shrink-0 w-2 h-2 rounded-full bg-primary mt-1.5 animate-pulse-dot" title="Mark as read" />
          )}
        </div>
        <div className="flex items-center gap-3 mt-2">
          <span className="text-xs text-gray-400">{notification.time}</span>
          <span className="text-xs font-medium text-primary bg-orange-50 px-2 py-0.5 rounded-full">{notification.type}</span>
        </div>
      </div>
    </div>
  );
};

export default NotificationCard;
