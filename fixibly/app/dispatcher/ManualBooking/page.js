"use client";
import React, { useState, useCallback } from "react";
import { useDispatcherStore } from "../DispatcherStore";
import {
    FiUser, FiPhone, FiMapPin, FiTag, FiFileText,
    FiCalendar, FiAlertTriangle, FiCheck, FiX, FiArrowLeft
} from "react-icons/fi";

const INITIAL = {
    name: "", phone: "", address: "", category: "",
    issue: "", priority: "Normal", emergency: "No", preferredDate: ""
};

const CATEGORIES = ["Plumbing", "Electrical", "HVAC", "House Cleaning", "Exterior Cleaning", "Handyman", "Landscaping", "Pest Control", "Home Remodeling", "Painting & Decoration"];

// Defined OUTSIDE component so React doesn't remount on every render
const Field = ({ label, error, children }) => (
    <div>
        <label className="ff-label block text-xs font-semibold text-gray-600 mb-1">{label}</label>
        {children}
        {error && (
            <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
                <FiAlertTriangle className="w-3 h-3" />{error}
            </p>
        )}
    </div>
);

const ManualBooking = ({ onBack = () => {} }) => {
    const { createBooking } = useDispatcherStore();
    const [form, setForm] = useState(INITIAL);
    const [errors, setErrors] = useState({});
    const [submitted, setSubmitted] = useState(null);
    const [loading, setLoading] = useState(false);
    const [apiError, setApiError] = useState(null);

    // Single handler — uses input's name attribute
    const handleChange = useCallback((e) => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));
        setErrors(prev => { const n = { ...prev }; delete n[name]; return n; });
    }, []);

    const validate = () => {
        const e = {};
        if (!form.name.trim())                              e.name         = "Customer name is required";
        if (!form.phone.trim() || !/^\d{10}$/.test(form.phone)) e.phone   = "Valid 10-digit phone required";
        if (!form.address.trim())                           e.address      = "Address is required";
        if (!form.category)                                 e.category     = "Service category is required";
        if (!form.issue.trim())                             e.issue        = "Issue description is required";
        if (!form.preferredDate)                            e.preferredDate = "Preferred date is required";
        return e;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const errs = validate();
        if (Object.keys(errs).length > 0) { setErrors(errs); return; }
        setLoading(true);
        setApiError(null);
        try {
            const result = await createBooking({
                customer: form.name,
                phone: form.phone,
                address: form.address,
                category: form.category,
                issue: form.issue,
                priority: form.priority,
                emergency: form.emergency === "Yes",
                scheduledAt: new Date(form.preferredDate).toISOString()
            });
            if (result) setSubmitted(result);
            else setApiError("Booking creation failed. Please try again.");
        } catch (err) {
            setApiError(err.message || "An unexpected error occurred.");
        } finally {
            setLoading(false);
        }
    };

    if (submitted) return (
        <div className="max-w-lg mx-auto animate-fadeIn space-y-4">
            <button onClick={onBack} className="flex items-center gap-2 text-sm text-gray-500 hover:text-dark-900 transition-colors">
                <FiArrowLeft className="w-4 h-4" /> Back to Dashboard
            </button>
            <div className="ff-card p-8 text-center">
                <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <FiCheck className="w-8 h-8 text-green-500" />
                </div>
                <p className="text-xl font-bold text-dark-900 mb-2">Booking Created!</p>
                <p className="text-sm text-gray-500 mb-4">
                    Booking <span className="font-mono font-bold text-primary">#{submitted.id}</span> added successfully.
                </p>
                <div className="bg-gray-50 rounded-xl p-4 text-left space-y-2 mb-6">
                    {[
                        { label: "Customer", value: submitted.customer },
                        { label: "Category", value: submitted.category },
                        { label: "Priority", value: submitted.priority },
                        { label: "Type",     value: submitted.emergency ? "🚨 Emergency" : "Normal" },
                    ].map(({ label, value }) => (
                        <div key={label} className="flex justify-between text-sm">
                            <span className="text-gray-400">{label}</span>
                            <span className="font-semibold text-dark-800">{value}</span>
                        </div>
                    ))}
                </div>
                <button onClick={() => { setSubmitted(null); setForm(INITIAL); }} className="ff-btn-primary w-full">
                    Create Another Booking
                </button>
            </div>
        </div>
    );

    return (
        <div className="max-w-2xl mx-auto animate-fadeIn space-y-4">
            <button onClick={onBack} className="flex items-center gap-2 text-sm text-gray-500 hover:text-dark-900 transition-colors">
                <FiArrowLeft className="w-4 h-4" /> Back to Dashboard
            </button>
            <div className="ff-card overflow-hidden">
                <div className="bg-gradient-to-r from-orange-500 to-orange-600 p-5 text-white">
                    <p className="font-bold text-lg">Create Manual Booking</p>
                    <p className="text-xs text-white/70 mt-0.5">For walk-in customers or phone-in requests</p>
                </div>
                <form onSubmit={handleSubmit} className="p-6 space-y-5">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                        <Field label="Customer Name *" error={errors.name}>
                            <div className="relative">
                                <FiUser className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                                <input
                                    name="name"
                                    value={form.name}
                                    onChange={handleChange}
                                    placeholder="Full name"
                                    autoComplete="off"
                                    className={`ff-input !pl-10 ${errors.name ? "border-red-300" : ""}`}
                                />
                            </div>
                        </Field>
                        <Field label="Phone Number *" error={errors.phone}>
                            <div className="relative">
                                <FiPhone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                                <input
                                    name="phone"
                                    value={form.phone}
                                    onChange={handleChange}
                                    placeholder="10-digit number"
                                    maxLength={10}
                                    autoComplete="off"
                                    className={`ff-input !pl-10 ${errors.phone ? "border-red-300" : ""}`}
                                />
                            </div>
                        </Field>
                    </div>

                    <Field label="Address *" error={errors.address}>
                        <div className="relative">
                            <FiMapPin className="absolute left-3 top-3 text-gray-400 w-4 h-4" />
                            <textarea
                                name="address"
                                value={form.address}
                                onChange={handleChange}
                                placeholder="Full address"
                                rows={2}
                                className={`ff-input !pl-10 pt-3 resize-none ${errors.address ? "border-red-300" : ""}`}
                            />
                        </div>
                    </Field>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                        <Field label="Service Category *" error={errors.category}>
                            <div className="relative">
                                <FiTag className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                                <select
                                    name="category"
                                    value={form.category}
                                    onChange={handleChange}
                                    className={`ff-input !pl-10 ${errors.category ? "border-red-300" : ""}`}
                                >
                                    <option value="">Select category...</option>
                                    {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                                </select>
                            </div>
                        </Field>
                        <Field label="Preferred Date & Time *" error={errors.preferredDate}>
                            <div className="relative">
                                <FiCalendar className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                                <input
                                    type="datetime-local"
                                    name="preferredDate"
                                    value={form.preferredDate}
                                    onChange={handleChange}
                                    className={`ff-input !pl-10 ${errors.preferredDate ? "border-red-300" : ""}`}
                                />
                            </div>
                        </Field>
                    </div>

                    <Field label="Issue Description *" error={errors.issue}>
                        <div className="relative">
                            <FiFileText className="absolute left-3 top-3 text-gray-400 w-4 h-4" />
                            <textarea
                                name="issue"
                                value={form.issue}
                                onChange={handleChange}
                                placeholder="Describe the issue in detail..."
                                rows={3}
                                className={`ff-input !pl-10 pt-3 resize-none ${errors.issue ? "border-red-300" : ""}`}
                            />
                        </div>
                    </Field>

                    <div className="grid grid-cols-2 gap-5">
                        <Field label="Priority">
                            <select name="priority" value={form.priority} onChange={handleChange} className="ff-input">
                                <option value="Normal">Normal</option>
                                <option value="Emergency">Emergency</option>
                            </select>
                        </Field>
                        <Field label="Emergency?">
                            <select
                                name="emergency"
                                value={form.emergency}
                                onChange={handleChange}
                                className={`ff-input ${form.emergency === "Yes" ? "border-red-300 text-red-600" : ""}`}
                            >
                                <option value="No">No</option>
                                <option value="Yes">Yes – Emergency</option>
                            </select>
                        </Field>
                    </div>

                    {form.emergency === "Yes" && (
                        <div className="bg-red-50 border border-red-100 rounded-xl p-3 flex items-center gap-2">
                            <FiAlertTriangle className="w-4 h-4 text-red-500 shrink-0" />
                            <p className="text-xs text-red-600">
                                This booking will be added to the Emergency queue and broadcast to available technicians.
                            </p>
                        </div>
                    )}

                    {apiError && (
                        <div className="bg-red-50 border border-red-100 rounded-xl p-3 flex items-center gap-2">
                            <FiAlertTriangle className="w-4 h-4 text-red-500 shrink-0" />
                            <p className="text-xs text-red-600">{apiError}</p>
                        </div>
                    )}

                    <div className="flex gap-3 pt-2">
                        <button
                            type="button"
                            onClick={() => { setForm(INITIAL); setErrors({}); setApiError(null); }}
                            className="ff-btn-secondary flex items-center gap-2"
                        >
                            <FiX className="w-4 h-4" /> Clear Form
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="ff-btn-primary flex-1 flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
                        >
                            {loading
                                ? <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Submitting...</>
                                : <><FiCheck className="w-4 h-4" /> Submit Booking</>
                            }
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ManualBooking;
