"use client";

// fixibly/app/customer/history/historySection.js
// Booking History overview rendering Active/Confirmed, Completed, and Cancelled bookings

import { useEffect, useState } from "react";
import HistoryCard from "./historyCard";

export default function HistorySection() {
  const [historyList, setHistoryList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState("ALL");

  // Fetch complete booking history on load from GET /api/customer/bookings/history
  useEffect(() => {
    async function fetchHistory() {
      const token = localStorage.getItem("token") || localStorage.getItem("accessToken");

      try {
        const res = await fetch("http://localhost:5000/api/customer/bookings/history", {
          headers: { Authorization: `Bearer ${token}` }
        });
        const result = await res.json();

        if (result.success) {
          const raw = result.history || result.data || [];
          // Mapping Supabase response objects into clear display cards
          const formatted = raw.map((b) => ({
            id: b.booking_id,
            categoryName: b.service_categories?.category_name || 'Service',
            problemName: b.service_problems?.problem_name || 'General Repair',
            service: `${b.service_categories?.category_name || 'Service'} - ${b.service_problems?.problem_name || 'General Repair'}`,
            technician: b.technicians?.users?.full_name || "Awaiting Technician",
            completedDate: new Date(b.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }),
            status: b.booking_status,
            estimatedAmount: b.estimated_amount,
            description: b.issue_description || `Booking #${b.booking_id} status: ${b.booking_status}`,
            image: b.service_categories?.category_image_url || "https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=900&q=80"
          }));
          setHistoryList(formatted);
        } else {
          setError(result.message || "Failed to load booking history.");
        }
      } catch (err) {
        setError("Network error fetching booking history.");
      } finally {
        setLoading(false);
      }
    }

    fetchHistory();
  }, []);

  // Filter history items according to selected filter tab
  const filteredHistory = historyList.filter(item => {
    if (filter === "ALL") return true;
    if (filter === "COMPLETED") return item.status === "Completed";
    if (filter === "CANCELLED") return item.status === "Cancelled";
    if (filter === "CONFIRMED") return !["Completed", "Cancelled"].includes(item.status);
    return true;
  });

  if (loading) {
    return (
      <section className="py-16 bg-gray-50 text-center">
        <p className="text-lg font-medium text-gray-600">Loading your complete booking history...</p>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-16 bg-gray-50 text-center">
        <p className="text-lg font-medium text-red-500">{error}</p>
      </section>
    );
  }

  return (
    <section className="py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex justify-between items-center mb-10 flex-wrap gap-6">
          <div>
            <p className="uppercase tracking-widest text-orange-500 font-semibold">
              Complete Booking Overview
            </p>
            <h2 className="text-5xl font-bold mt-2 text-gray-900">
              Your Service
              <br />
              Booking History
            </h2>
          </div>

          {/* FILTER BUTTON TABS */}
          <div className="flex bg-white p-1.5 rounded-2xl border border-gray-200 shadow-sm text-sm font-semibold">
            <button
              onClick={() => setFilter("ALL")}
              className={`px-4 py-2 rounded-xl transition ${filter === "ALL" ? "bg-orange-500 text-white shadow" : "text-gray-600 hover:text-gray-900"}`}
            >
              All ({historyList.length})
            </button>
            <button
              onClick={() => setFilter("CONFIRMED")}
              className={`px-4 py-2 rounded-xl transition ${filter === "CONFIRMED" ? "bg-orange-500 text-white shadow" : "text-gray-600 hover:text-gray-900"}`}
            >
              Active / Confirmed
            </button>
            <button
              onClick={() => setFilter("COMPLETED")}
              className={`px-4 py-2 rounded-xl transition ${filter === "COMPLETED" ? "bg-orange-500 text-white shadow" : "text-gray-600 hover:text-gray-900"}`}
            >
              Completed
            </button>
            <button
              onClick={() => setFilter("CANCELLED")}
              className={`px-4 py-2 rounded-xl transition ${filter === "CANCELLED" ? "bg-orange-500 text-white shadow" : "text-gray-600 hover:text-gray-900"}`}
            >
              Cancelled
            </button>
          </div>
        </div>

        {filteredHistory.length === 0 ? (
          <p className="text-center text-gray-500 py-12 bg-white rounded-3xl border border-gray-200">No bookings found matching selected filter.</p>
        ) : (
          <div className="space-y-8">
            {filteredHistory.map((booking) => (
              <HistoryCard
                key={booking.id}
                {...booking}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}