'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Navbar from "@/app/components/navbar";
import Footer from "@/app/components/footer";
import { fetchApi } from "@/app/utils/api";
import { 
  CheckCircle2, CalendarDays, Clock3, MapPin, Receipt, CreditCard,
  User, Phone, Mail, Wrench, Home, AlertTriangle, FileText, MapPinned,
  PhoneCall, CircleX, Headphones, Check, Loader2, Sparkles, Star
} from "lucide-react";

function BookingConfirmationContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const bookingId = searchParams.get('bookingId');

  const [booking, setBooking] = useState(null);
  const [tracking, setTracking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const loadBookingData = async () => {
    if (!bookingId) {
      // Try fetching latest booking if no ID provided
      try {
        const hist = await fetchApi('/customer/dashboard');
        if (hist.recentBookings && hist.recentBookings.length > 0) {
          const latest = hist.recentBookings[0];
          setBooking(latest);
          setLoading(false);
          return;
        }
      } catch (e) {}
      setLoading(false);
      return;
    }

    try {
      const res = await fetchApi(`/customer/bookings/${bookingId}`);
      if (res.booking) {
        setBooking(res.booking);
      }
      const trackRes = await fetchApi(`/customer/bookings/${bookingId}/tracking`).catch(() => null);
      if (trackRes?.tracking) {
        setTracking(trackRes.tracking);
      }
    } catch (err) {
      setError(err.message || 'Failed to load booking details.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBookingData();
    // Poll tracking every 8 seconds
    const interval = setInterval(() => {
      if (bookingId) loadBookingData();
    }, 8000);
    return () => clearInterval(interval);
  }, [bookingId]);

  const handleCancelBooking = async () => {
    if (!booking) return;
    if (!confirm("Are you sure you want to cancel this booking?")) return;

    try {
      setActionLoading(true);
      setError('');
      const res = await fetchApi(`/customer/bookings/${booking.booking_id}/cancel`, {
        method: 'PATCH'
      });
      setActionLoading(false);
      if (res.success) {
        setMessage('Booking cancelled successfully.');
        loadBookingData();
      }
    } catch (err) {
      setActionLoading(false);
      setError(err.message || 'Failed to cancel booking.');
    }
  };

  const handleConfirmCompletion = async () => {
    if (!booking) return;

    try {
      setActionLoading(true);
      setError('');
      const res = await fetchApi(`/customer/bookings/${booking.booking_id}/confirm-completion`, {
        method: 'PATCH'
      });
      setActionLoading(false);
      if (res.success) {
        setMessage('Job completion confirmed! Thank you.');
        setTimeout(() => {
          router.push(`/customer/feedback?bookingId=${booking.booking_id}&technicianId=${booking.technician_id || ''}`);
        }, 1200);
      }
    } catch (err) {
      setActionLoading(false);
      setError(err.message || 'Failed to confirm completion.');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col justify-center items-center bg-slate-50 py-24">
        <Loader2 className="w-8 h-8 text-orange-500 animate-spin mb-3" />
        <p className="text-slate-600 text-sm font-semibold">Loading booking tracking details...</p>
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="min-h-screen flex flex-col justify-center items-center bg-slate-50 py-24 px-4 text-center">
        <AlertTriangle className="w-12 h-12 text-amber-500 mb-3" />
        <h2 className="text-xl font-extrabold text-slate-900">No Booking Found</h2>
        <p className="text-slate-500 text-xs mt-1 max-w-sm">
          Please check your history or create a new booking from the customer dashboard.
        </p>
        <button
          onClick={() => router.push('/customer')}
          className="mt-4 px-5 py-2.5 bg-orange-500 text-white font-bold text-xs rounded-xl hover:bg-orange-600 transition-all"
        >
          Go to Dashboard
        </button>
      </div>
    );
  }

  const currentStatus = booking.booking_status || 'Pending';
  const isWaitingConfirmation = currentStatus === 'Waiting for Customer Confirmation';
  const isCompleted = currentStatus === 'Completed';
  const isCancelled = currentStatus === 'Cancelled';

  const customerName = booking.users?.full_name || 'Customer';
  const customerPhone = booking.users?.phone || 'N/A';
  const customerEmail = booking.users?.email || 'N/A';
  const categoryName = booking.service_categories?.category_name || 'Home Service';
  const problemName = booking.service_problems?.problem_name || booking.issue_description || 'General Service';
  const techInfo = booking.technicians;

  const timelineSteps = [
    { label: "Booked", status: "Pending" },
    { label: "Technician Assigned", status: "Assigned" },
    { label: "Accepted", status: "Accepted" },
    { label: "On The Way", status: "On The Way" },
    { label: "Arrived / Working", status: "Working" },
    { label: "Awaiting Confirmation", status: "Waiting for Customer Confirmation" },
    { label: "Completed", status: "Completed" }
  ];

  const getStepIndex = (status) => {
    switch (status) {
      case 'Pending': return 0;
      case 'Assigned': return 1;
      case 'Accepted': return 2;
      case 'On The Way': return 3;
      case 'Arrived':
      case 'Working': return 4;
      case 'Waiting for Customer Confirmation': return 5;
      case 'Completed': return 6;
      default: return 0;
    }
  };

  const activeStepIdx = getStepIndex(currentStatus);

  return (
    <div className="max-w-6xl mx-auto px-4 py-10 pt-24 space-y-8">
      
      {/* Alert Banner */}
      {error && (
        <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-semibold">
          {error}
        </div>
      )}
      {message && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-semibold">
          {message}
        </div>
      )}

      {/* Customer Handshake Confirmation Banner */}
      {isWaitingConfirmation && (
        <div className="p-6 bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-2xl shadow-xl flex flex-col md:flex-row items-center justify-between gap-4 animate-pulse">
          <div>
            <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider bg-white/20 px-3 py-1 rounded-full w-fit mb-2">
              <Sparkles size={14} />
              Technician Finished Work!
            </div>
            <h2 className="text-2xl font-black">Please Confirm Work Completion</h2>
            <p className="text-xs text-orange-100 mt-1">
              Your technician has finished the work. Confirming will finalize the job and prompt you for feedback.
            </p>
          </div>
          <button
            onClick={handleConfirmCompletion}
            disabled={actionLoading}
            className="px-6 py-3 bg-white text-orange-600 font-extrabold text-xs rounded-xl shadow-lg hover:bg-orange-50 transition-all flex items-center gap-2 shrink-0 cursor-pointer disabled:opacity-50"
          >
            {actionLoading ? <Loader2 size={16} className="animate-spin" /> : <Check size={16} />}
            <span>Confirm Job Completed</span>
          </button>
        </div>
      )}

      {/* Booking Header & Success Card */}
      <section className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="bg-slate-900 text-white px-8 py-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="bg-orange-500 text-white p-3 rounded-2xl">
              <CheckCircle2 size={36} />
            </div>
            <div>
              <span className="text-xs font-bold text-orange-400 uppercase tracking-widest">Booking #{booking.booking_id}</span>
              <h1 className="text-3xl font-extrabold text-white tracking-tight mt-0.5">
                {isCancelled ? 'Booking Cancelled' : isCompleted ? 'Booking Completed' : 'Booking Active & Tracked'}
              </h1>
            </div>
          </div>
          <div className="bg-slate-800 border border-slate-700 px-4 py-2 rounded-xl text-xs font-bold">
            Status: <span className="text-orange-400">{currentStatus}</span>
          </div>
        </div>

        <div className="p-8 grid grid-cols-1 md:grid-cols-3 gap-6 bg-slate-50/50">
          <div className="bg-white p-5 rounded-xl border border-slate-200">
            <CalendarDays className="text-orange-500 mb-2" size={20} />
            <p className="text-slate-400 text-xs font-medium">Preferred Schedule</p>
            <h3 className="font-extrabold text-sm text-slate-800 mt-1">
              {booking.anytime_service ? 'Anytime Service' : booking.preferred_date || 'Standard Request'}
            </h3>
          </div>
          <div className="bg-white p-5 rounded-xl border border-slate-200">
            <Clock3 className="text-orange-500 mb-2" size={20} />
            <p className="text-slate-400 text-xs font-medium">Estimated Arrival</p>
            <h3 className="font-extrabold text-sm text-slate-800 mt-1">
              {booking.estimated_arrival ? new Date(booking.estimated_arrival).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Pending Dispatcher ETA'}
            </h3>
          </div>
          <div className="bg-white p-5 rounded-xl border border-slate-200">
            <MapPin className="text-orange-500 mb-2" size={20} />
            <p className="text-slate-400 text-xs font-medium">Location</p>
            <h3 className="font-extrabold text-sm text-slate-800 mt-1 truncate">
              {booking.street || ''} {booking.area || ''}, {booking.city || 'Mangalore'}
            </h3>
          </div>
        </div>
      </section>

      {/* Live Timeline Tracker */}
      <section className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
        <h2 className="text-lg font-extrabold text-slate-900 mb-6">Live Status Progress</h2>
        <div className="relative flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          {timelineSteps.map((step, idx) => {
            const isDone = idx <= activeStepIdx && !isCancelled;
            const isCurrent = idx === activeStepIdx && !isCancelled;
            return (
              <div key={idx} className="flex md:flex-col items-center gap-3 flex-1">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                  isDone ? 'bg-orange-500 text-white shadow' : 'bg-slate-100 text-slate-400 border border-slate-200'
                } ${isCurrent ? 'ring-4 ring-orange-100' : ''}`}>
                  {isDone ? <Check size={14} /> : idx + 1}
                </div>
                <span className={`text-xs font-semibold ${isCurrent ? 'text-orange-600 font-extrabold' : isDone ? 'text-slate-900' : 'text-slate-400'}`}>
                  {step.label}
                </span>
              </div>
            );
          })}
        </div>
      </section>

      {/* Details & Technician Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Customer & Service Info */}
        <section className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 space-y-4">
          <h2 className="text-base font-extrabold text-slate-900 flex items-center gap-2 border-b pb-3">
            <FileText className="text-orange-500" size={18} />
            <span>Booking Information</span>
          </h2>
          <div className="space-y-3 text-xs text-slate-700">
            <div className="flex justify-between">
              <span className="text-slate-400 font-medium">Customer:</span>
              <span className="font-bold">{customerName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400 font-medium">Phone:</span>
              <span className="font-bold">{customerPhone}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400 font-medium">Category:</span>
              <span className="font-bold text-orange-600">{categoryName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400 font-medium">Problem:</span>
              <span className="font-bold">{problemName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400 font-medium">Emergency Flag:</span>
              <span className={`font-bold ${booking.emergency_flag ? 'text-red-600' : 'text-slate-600'}`}>
                {booking.emergency_flag ? 'YES (High Priority)' : 'No'}
              </span>
            </div>
          </div>
        </section>

        {/* Technician Card */}
        <section className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 space-y-4">
          <h2 className="text-base font-extrabold text-slate-900 flex items-center gap-2 border-b pb-3">
            <User className="text-orange-500" size={18} />
            <span>Assigned Technician</span>
          </h2>
          {techInfo ? (
            <div className="space-y-3 text-xs">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-orange-100 text-orange-600 font-extrabold flex items-center justify-center text-lg">
                  {techInfo.users?.full_name?.charAt(0) || 'T'}
                </div>
                <div>
                  <h3 className="font-bold text-sm text-slate-900">{techInfo.users?.full_name || 'Assigned Technician'}</h3>
                  <div className="flex items-center gap-1 text-amber-500 font-bold mt-0.5">
                    <Star size={12} fill="currentColor" />
                    <span>{techInfo.rating || '5.0'} Rating • {techInfo.experience || 3} Yrs Exp</span>
                  </div>
                </div>
              </div>
              <div className="pt-2 border-t text-slate-600 space-y-1">
                <p><span className="font-semibold text-slate-900">Phone:</span> {techInfo.users?.phone || 'N/A'}</p>
                <p><span className="font-semibold text-slate-900">Availability:</span> {techInfo.availability_status}</p>
              </div>
            </div>
          ) : (
            <div className="py-6 text-center text-xs text-slate-500 bg-slate-50 rounded-xl border border-dashed border-slate-200">
              <p className="font-semibold">Technician Assignment Pending</p>
              <p className="text-[11px] mt-1 text-slate-400">Dispatcher is matching an available technician in your category.</p>
            </div>
          )}
        </section>
      </div>

      {/* Action Buttons */}
      <section className="flex flex-wrap gap-4 pt-4 border-t border-slate-200">
        {!isCompleted && !isCancelled && (
          <button
            onClick={handleCancelBooking}
            disabled={actionLoading}
            className="px-5 py-2.5 bg-red-50 text-red-600 hover:bg-red-100 border border-red-200 font-bold text-xs rounded-xl transition-all flex items-center gap-2 cursor-pointer"
          >
            <CircleX size={15} />
            <span>Cancel Booking</span>
          </button>
        )}

        {isCompleted && (
          <button
            onClick={() => router.push(`/customer/feedback?bookingId=${booking.booking_id}&technicianId=${booking.technician_id || ''}`)}
            className="px-5 py-2.5 bg-emerald-500 text-white hover:bg-emerald-600 font-bold text-xs rounded-xl shadow transition-all flex items-center gap-2 cursor-pointer"
          >
            <Star size={15} />
            <span>Leave Feedback & Rating</span>
          </button>
        )}

        <button
          onClick={() => router.push('/customer')}
          className="px-5 py-2.5 bg-slate-900 text-white hover:bg-slate-800 font-bold text-xs rounded-xl transition-all ml-auto cursor-pointer"
        >
          Back to Dashboard
        </button>
      </section>

    </div>
  );
}

export default function BookingConfirmationPage() {
  return (
    <div className="bg-slate-100 min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <Suspense fallback={<div className="text-slate-500 text-xs text-center py-24">Loading confirmation...</div>}>
          <BookingConfirmationContent />
        </Suspense>
      </main>
      <Footer />
    </div>
  );
}