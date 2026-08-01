'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Navbar from "@/app/components/navbar";
import Footer from "@/app/components/footer";
import { fetchApi } from "@/app/utils/api";
import { Star, CheckCircle2, MessageSquare, ThumbsUp, Sparkles, Loader2, ArrowRight } from "lucide-react";

function FeedbackContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const bookingId = searchParams.get('bookingId');
  const technicianId = searchParams.get('technicianId');

  const [overallRating, setOverallRating] = useState(5);
  const [professionalBehaviour, setProfessionalBehaviour] = useState(5);
  const [serviceQuality, setServiceQuality] = useState(5);
  const [timeliness, setTimeliness] = useState(5);
  const [cleanliness, setCleanliness] = useState(5);
  const [problemResolution, setProblemResolution] = useState(5);
  const [comments, setComments] = useState('');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!bookingId) {
      setError('Missing booking ID for feedback submission.');
      return;
    }

    try {
      setLoading(true);
      setError('');

      const result = await fetchApi('/customer/feedback', {
        method: 'POST',
        body: JSON.stringify({
          bookingId: Number(bookingId),
          technicianId: technicianId ? Number(technicianId) : 1,
          overallRating,
          professionalBehaviour,
          serviceQuality,
          timeliness,
          cleanliness,
          problemResolution,
          comments
        })
      });

      setLoading(false);

      if (result.success) {
        setSuccess('Feedback submitted successfully! Thank you for helping us maintain high service quality.');
        setTimeout(() => {
          router.push('/customer');
        }, 1200);
      } else {
        setError(result.message || 'Failed to submit feedback.');
      }
    } catch (err) {
      setLoading(false);
      setError(err.message || 'Failed to submit feedback.');
    }
  };

  const renderStarRating = (val, setVal, label) => (
    <div className="flex items-center justify-between p-3 bg-slate-50 border border-slate-200 rounded-xl">
      <span className="text-xs font-bold text-slate-800">{label}</span>
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => setVal(star)}
            className="p-1 hover:scale-110 transition-all cursor-pointer"
          >
            <Star
              size={18}
              className={star <= val ? "text-amber-400 fill-amber-400" : "text-slate-300"}
            />
          </button>
        ))}
      </div>
    </div>
  );

  return (
    <div className="max-w-3xl mx-auto px-4 py-10 pt-24 space-y-6">
      
      {/* Header */}
      <div className="bg-slate-900 text-white rounded-2xl p-6 shadow-md text-center">
        <div className="w-12 h-12 rounded-full bg-orange-500 text-white flex items-center justify-center mx-auto mb-3">
          <Star size={24} fill="currentColor" />
        </div>
        <h1 className="text-2xl font-black tracking-tight">Technician Feedback & Rating</h1>
        <p className="text-slate-400 text-xs mt-1">
          Booking #{bookingId || 'Recent'} • Help us evaluate your service technician's performance
        </p>
      </div>

      {/* Alerts */}
      {error && (
        <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-semibold">
          {error}
        </div>
      )}
      {success && (
        <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-semibold">
          {success}
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-slate-200 p-6 space-y-6 shadow-sm">
        
        {/* Overall Score */}
        <div className="text-center pb-4 border-b border-slate-100">
          <label className="text-xs font-extrabold text-slate-500 uppercase tracking-wider block mb-2">Overall Experience Rating</label>
          <div className="flex items-center justify-center gap-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setOverallRating(star)}
                className="p-1.5 transition-transform hover:scale-110 cursor-pointer"
              >
                <Star
                  size={32}
                  className={star <= overallRating ? "text-amber-400 fill-amber-400 drop-shadow" : "text-slate-300"}
                />
              </button>
            ))}
          </div>
          <span className="text-xs font-bold text-orange-600 mt-2 block">{overallRating} / 5 Stars</span>
        </div>

        {/* Detailed Metrics */}
        <div className="space-y-2.5">
          <label className="text-xs font-extrabold text-slate-500 uppercase tracking-wider block mb-1">Detailed Evaluation</label>
          {renderStarRating(professionalBehaviour, setProfessionalBehaviour, "Professional Behaviour")}
          {renderStarRating(serviceQuality, setServiceQuality, "Service Quality")}
          {renderStarRating(timeliness, setTimeliness, "Timeliness & Punctuality")}
          {renderStarRating(cleanliness, setCleanliness, "Cleanliness of Work Area")}
          {renderStarRating(problemResolution, setProblemResolution, "Problem Resolution Effectiveness")}
        </div>

        {/* Comments */}
        <div>
          <label className="text-xs font-extrabold text-slate-700 block mb-1.5">Additional Comments & Remarks</label>
          <textarea
            rows={3}
            placeholder="Share details about your experience with the technician..."
            value={comments}
            onChange={(e) => setComments(e.target.value)}
            className="w-full border border-slate-300 rounded-xl p-3 text-xs outline-none focus:border-orange-500"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 rounded-xl shadow transition flex items-center justify-center gap-2 text-xs disabled:opacity-50 cursor-pointer"
        >
          {loading ? (
            <Loader2 size={16} className="animate-spin" />
          ) : (
            <>
              <span>Submit Technician Feedback</span>
              <ArrowRight size={15} />
            </>
          )}
        </button>
      </form>

    </div>
  );
}

export default function FeedbackPage() {
  return (
    <div className="bg-slate-100 min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <Suspense fallback={<div className="text-center py-24 text-xs font-semibold text-slate-500">Loading feedback form...</div>}>
          <FeedbackContent />
        </Suspense>
      </main>
      <Footer />
    </div>
  );
}