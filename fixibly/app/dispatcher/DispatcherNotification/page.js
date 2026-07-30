"use client";
import React, { useState } from "react";
import { useAppStore } from "../../context/AppStore";
import NotificationCard from "../../components/admin/NotificationCard";
import EmptyState from "../../components/common/EmptyState";
import { FiBell, FiCheckCircle, FiArrowLeft } from "react-icons/fi";

const TABS = ["All", "Unread", "Read"];

const DispatcherNotifications = ({ onBack }) => {
  const { dispNotifs, setDispNotifs } = useAppStore();
  const [tab, setTab] = useState("All");

  const markRead = (id) => setDispNotifs(n => n.map(x => x.id === id ? { ...x, read: true } : x));
  const markAllRead = () => setDispNotifs(n => n.map(x => ({ ...x, read: true })));

  const filtered = dispNotifs.filter(n => tab === "All" || (tab === "Unread" ? !n.read : n.read));
  const unreadCount = dispNotifs.filter(n => !n.read).length;

  return (
    <div className="space-y-5 animate-fadeIn">
      <button onClick={onBack} className="flex items-center gap-2 text-sm text-gray-500 hover:text-dark-900 transition-colors">
        <FiArrowLeft className="w-4 h-4" /> Back to Dashboard
      </button>

      <div className="ff-card p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-orange-50 rounded-xl flex items-center justify-center">
            <FiBell className="w-5 h-5 text-primary" />
          </div>
          <div>
            <p className="font-bold text-dark-900">Operational Notifications</p>
            <p className="text-xs text-gray-400">{unreadCount} unread</p>
          </div>
        </div>
        {unreadCount > 0 && (
          <button onClick={markAllRead} className="ff-btn-secondary flex items-center gap-2 text-xs">
            <FiCheckCircle className="w-3.5 h-3.5" /> Mark All Read
          </button>
        )}
      </div>

      <div className="ff-card p-1 flex gap-1 w-fit">
        {TABS.map(t => (
          <button key={t} onClick={() => setTab(t)}
            className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all duration-200 ${tab === t ? "bg-primary text-white" : "text-gray-500 hover:bg-gray-100"}`}>
            {t} {t === "Unread" && unreadCount > 0 && <span className="ml-1 bg-red-500 text-white text-xs px-1.5 py-0.5 rounded-full">{unreadCount}</span>}
          </button>
        ))}
      </div>

      <div className="space-y-2">
        {filtered.length > 0
          ? filtered.map(n => <NotificationCard key={n.id} notification={n} onMarkRead={markRead} />)
          : <div className="ff-card"><EmptyState icon={FiBell} title="No notifications" description="You're all caught up!" /></div>
        }
      </div>
    </div>
  );
};

export default DispatcherNotifications;
