"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import HistoryCard from "./historyCard";
import { fetchApi } from "@/app/utils/api";
import { Clock, Loader2 } from "lucide-react";

export default function HistorySection() {
  const router = useRouter();
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchApi('/customer/bookings/history')
      .then(res => {
        if (res.history) {
          const formatted = res.history.map(b => ({
            id: b.booking_id,
            service: b.service_categories?.category_name || "Service Booking",
            technician: b.technicians?.users?.full_name || "Assigned Tech",
            completedDate: new Date(b.updated_at).toLocaleDateString([], { day: 'numeric', month: 'short', year: 'numeric' }),
            rating: b.feedback?.overall_rating || 5,
            description: b.issue_description || b.service_problems?.problem_name || "Completed Field Service Repair.",
            status: b.booking_status,
            image: "https://trusteyman.com/wp-content/uploads/2019/02/how-does-plumbing-work-e1548696261445.jpeg"
          }));
          setHistory(formatted);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <section className="py-20 bg-slate-50 border-t border-slate-200">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex justify-between items-center mb-10 flex-wrap gap-6">
          <div>
            <span className="uppercase tracking-widest text-orange-500 font-bold text-xs">
              Recent Services
            </span>
            <h2 className="text-4xl font-extrabold mt-2 text-slate-900 tracking-tight">
              Your Completed & Past Bookings
            </h2>
          </div>

          <button 
            onClick={() => router.push('/customer/history')}
            className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-xl font-bold text-xs shadow-sm transition"
          >
            View Full History →
          </button>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12 text-xs font-semibold text-slate-500 gap-2">
            <Loader2 size={16} className="animate-spin text-orange-500" />
            <span>Loading completed history...</span>
          </div>
        ) : history.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center text-slate-500 text-xs font-semibold">
            No completed booking history found.
          </div>
        ) : (
          <div className="space-y-6">
            {history.slice(0, 3).map((booking) => (
              <HistoryCard key={booking.id} {...booking} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}