"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Bell, Check, Calendar, Activity, CheckCircle2, Clock } from 'lucide-react';

export default function HeroSection() {
  const router = useRouter();
  const [dashboardData, setDashboardData] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);

  const fetchDashboard = async () => {
    const token = localStorage.getItem('token') || localStorage.getItem('accessToken');
    if (!token) return;

    try {
      // 1. Fetch Dashboard Overview
      const res = await fetch('http://localhost:5000/api/customer/dashboard', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const result = await res.json();
      if (result.success) {
        setDashboardData(result.data);
      }

      // 2. Fetch Notifications
      const notifRes = await fetch('http://localhost:5000/api/customer/notifications', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const notifResult = await notifRes.json();
      if (notifResult.success) {
        setNotifications(notifResult.notifications || notifResult.data || []);
      }
    } catch (err) {
      console.error('Error loading dashboard hero data:', err);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  const handleMarkAsRead = async (notifId) => {
    const token = localStorage.getItem('token') || localStorage.getItem('accessToken');
    try {
      const res = await fetch(`http://localhost:5000/api/customer/notifications/${notifId}/read`, {
        method: 'PATCH',
        headers: { Authorization: `Bearer ${token}` }
      });
      const result = await res.json();
      if (result.success) {
        fetchDashboard();
      }
    } catch (err) {
      console.error('Error marking notification read:', err);
    }
  };

  const customerName = dashboardData?.customer?.full_name || 'Customer';
  const stats = dashboardData?.stats || { total: 0, pending: 0, active: 0, completed: 0, cancelled: 0 };
  const unreadCount = notifications.filter(n => !n.is_read).length;

  return (
    <section className="relative items-center bg-[#111827] text-white overflow-hidden">
      <div className="absolute inset-0 bg-black/50 z-0"></div>
      <div
        className="absolute inset-0 bg-cover bg-center opacity-30"
        style={{ backgroundImage: "url('https://images.unsplash.com/photo-1581578731548-c64695cc6952?q=80&w=1920&auto=format&fit=crop')" }}
      ></div>

      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 py-20 flex flex-col lg:flex-row items-center justify-between gap-12">
        <div className="lg:w-1/2">
          <div className="flex items-center gap-3 mb-6">
            <span className="inline-block bg-orange-500/20 text-orange-400 px-4 py-2 rounded-full text-sm font-semibold">
              CUSTOMER DASHBOARD
            </span>

            {/* NOTIFICATION TOGGLE BUTTON */}
            <div className="relative">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative bg-gray-800 hover:bg-gray-700 text-white p-2.5 rounded-full border border-gray-700 transition"
              >
                <Bell size={20} />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-orange-500 text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
                    {unreadCount}
                  </span>
                )}
              </button>

              {/* NOTIFICATION DROPDOWN */}
              {showNotifications && (
                <div className="absolute top-12 left-0 w-80 sm:w-96 bg-white text-gray-900 rounded-2xl shadow-2xl border border-gray-200 z-50 p-4 max-h-96 overflow-y-auto space-y-3">
                  <div className="flex justify-between items-center pb-2 border-b border-gray-100">
                    <h4 className="font-bold text-sm text-gray-900">Notifications ({notifications.length})</h4>
                    <button onClick={() => setShowNotifications(false)} className="text-xs text-orange-600 font-semibold">Close</button>
                  </div>

                  {notifications.length === 0 ? (
                    <p className="text-xs text-gray-500 text-center py-4">No notifications.</p>
                  ) : (
                    notifications.map((n) => (
                      <div key={n.notification_id} className={`p-3 rounded-xl border text-xs space-y-1 ${n.is_read ? 'bg-gray-50 border-gray-200' : 'bg-orange-50/70 border-orange-200'}`}>
                        <div className="flex justify-between items-start">
                          <span className="font-bold text-gray-900">{n.title}</span>
                          {!n.is_read && (
                            <button
                              onClick={() => handleMarkAsRead(n.notification_id)}
                              className="text-orange-600 hover:underline flex items-center gap-1 font-semibold text-[10px]"
                            >
                              <Check size={12} /> Mark Read
                            </button>
                          )}
                        </div>
                        <p className="text-gray-600">{n.description}</p>
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>
          </div>

          <h1 className="text-5xl lg:text-6xl font-bold leading-tight mb-4">
            Welcome back,
            <br />
            <span className="text-orange-500">{customerName}</span>
          </h1>

          <p className="text-gray-300 text-base leading-7 mb-8">
            Book trusted home repair & field service professionals. Track active requests, review past bookings, and manage services seamlessly.
          </p>

          <div className="flex flex-wrap gap-4">
            <button onClick={() => router.push('/customer/categories')} className="bg-orange-500 hover:bg-orange-600 transition px-8 py-4 rounded-xl font-semibold text-white shadow-lg">
              Explore Services
            </button>
            <button onClick={() => router.push('/customer/history')} className="border border-white hover:bg-white hover:text-black transition px-8 py-4 rounded-xl font-semibold text-white">
              View History
            </button>
          </div>
        </div>

        {/* LIVE BOOKING STATS CARD */}
        <div className="lg:w-1/2 w-full">
          <div className="bg-gray-900/90 border border-gray-800 rounded-3xl p-8 shadow-2xl backdrop-blur-md space-y-6">
            <h3 className="text-xl font-bold text-orange-400 flex items-center gap-2">
              <Activity size={22} />
              Your Real-Time Booking Overview
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
              <div className="bg-gray-800/80 p-4 rounded-2xl border border-gray-700">
                <span className="text-2xl font-extrabold text-white">{stats.total}</span>
                <p className="text-xs text-gray-400 font-medium mt-1">Total</p>
              </div>

              <div className="bg-amber-950/40 p-4 rounded-2xl border border-amber-800/50">
                <span className="text-2xl font-extrabold text-amber-400">{stats.pending}</span>
                <p className="text-xs text-amber-300 font-medium mt-1">Pending</p>
              </div>

              <div className="bg-orange-950/40 p-4 rounded-2xl border border-orange-800/50">
                <span className="text-2xl font-extrabold text-orange-400">{stats.active}</span>
                <p className="text-xs text-orange-300 font-medium mt-1">Active</p>
              </div>

              <div className="bg-green-950/40 p-4 rounded-2xl border border-green-800/50">
                <span className="text-2xl font-extrabold text-green-400">{stats.completed}</span>
                <p className="text-xs text-green-300 font-medium mt-1">Completed</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}