"use client";
import React, { useState } from "react";
import { Mail, Phone, MapPin, Star, Check } from "lucide-react";
import useTechnicianStore from "../../technician/store/technicianStore";
import StatusBadge from "./StatusBadge";

function TechnicianProfile({ technician }) {
  const availability          = useTechnicianStore((state) => state.availability);
  const updateAvailability    = useTechnicianStore((state) => state.updateAvailability);
  const assignedJobs          = useTechnicianStore((state) => state.assignedJobs);
  const serviceCategories     = useTechnicianStore((state) => state.serviceCategories);
  const updateServiceCategory = useTechnicianStore((state) => state.updateServiceCategory);

  const [categoryUpdating, setCategoryUpdating] = useState(false);
  const [categorySaved, setCategorySaved]       = useState(false);

  const name       = technician?.full_name || technician?.name || "—";
  const email      = technician?.email || null;
  const phone      = technician?.phone || null;
  const address    = technician?.address || null;
  const category   = technician?.service_category || "—";
  const rating     = technician?.rating != null ? Number(technician.rating).toFixed(1) : null;
  const profilePic = technician?.profile_picture || null;

  const initials = name !== "—"
    ? name.split(" ").map((n) => n[0]).join("").substring(0, 2).toUpperCase()
    : "??";

  const activeJobs = assignedJobs.filter(
    (j) => !["completed", "cancelled"].includes(j.status)
  ).length;

  const handleCategoryChange = async (e) => {
    const categoryId = Number(e.target.value);
    if (!categoryId) return;
    setCategoryUpdating(true);
    await updateServiceCategory(categoryId);
    setCategoryUpdating(false);
    setCategorySaved(true);
    setTimeout(() => setCategorySaved(false), 2000);
  };

  const modeOptions = ["available", "busy", "offline"];

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">

      {/* Avatar + Name */}
      <div className="flex flex-col items-center text-center pb-5 border-b border-gray-100">
        {profilePic ? (
          <img src={profilePic} alt={name} className="w-20 h-20 rounded-full object-cover shadow" />
        ) : (
          <div className="w-20 h-20 rounded-full bg-orange-500 text-white flex items-center justify-center text-xl font-bold shadow">
            {initials}
          </div>
        )}
        <h3 className="mt-3 text-base font-bold text-gray-900">{name}</h3>
        <p className="text-xs text-gray-500 mt-0.5">{category}</p>
        <div className="mt-2">
          <StatusBadge status={availability} />
        </div>
      </div>

      {/* Details */}
      <div className="py-4 border-b border-gray-100 space-y-2.5">
        {email && (
          <div className="flex items-center gap-2.5 text-sm text-gray-600">
            <Mail size={14} className="text-orange-500 shrink-0" />
            <span className="truncate">{email}</span>
          </div>
        )}
        {phone && (
          <div className="flex items-center gap-2.5 text-sm text-gray-600">
            <Phone size={14} className="text-orange-500 shrink-0" />
            <span>{phone}</span>
          </div>
        )}
        {address && (
          <div className="flex items-center gap-2.5 text-sm text-gray-600">
            <MapPin size={14} className="text-orange-500 shrink-0" />
            <span className="truncate">{address}</span>
          </div>
        )}
        {rating && (
          <div className="flex items-center gap-2.5 text-sm text-gray-600">
            <Star size={14} className="text-orange-500 shrink-0" />
            <span>Rating: <span className="font-bold text-gray-900">{rating}</span></span>
          </div>
        )}
      </div>

      {/* Work Mode */}
      <div className="py-4 border-b border-gray-100">
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2.5">Work Mode</p>
        <div className="grid grid-cols-3 gap-2">
          {modeOptions.map((opt) => (
            <button
              key={opt}
              onClick={() => updateAvailability(opt)}
              className={`py-2 rounded-xl text-xs font-semibold border transition-all capitalize ${
                availability === opt
                  ? "bg-orange-500 border-orange-500 text-white"
                  : "border-gray-200 text-gray-600 hover:border-orange-300"
              }`}
            >
              {opt.charAt(0).toUpperCase() + opt.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Service Type */}
      {serviceCategories.length > 0 && (
        <div className="py-4 border-b border-gray-100">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2.5">Service Type</p>
          <div className="flex items-center gap-2">
            <select
              defaultValue=""
              onChange={handleCategoryChange}
              disabled={categoryUpdating}
              className="flex-1 border border-gray-200 rounded-xl px-3 py-2 text-sm text-gray-700 bg-white focus:outline-none focus:border-orange-400 disabled:opacity-50"
            >
              <option value="" disabled>{category}</option>
              {serviceCategories.map((cat) => (
                <option key={cat.category_id} value={cat.category_id}>{cat.category_name}</option>
              ))}
            </select>
            {categorySaved && <Check size={18} className="text-green-500 shrink-0" />}
          </div>
        </div>
      )}

      {/* Active Jobs */}
      <div className="pt-4">
        <div className="bg-orange-50 rounded-xl p-4">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Current Assignment</p>
          <p className="mt-1 text-2xl font-bold text-orange-600">{activeJobs}</p>
          <p className="text-xs text-gray-500 mt-0.5">active {activeJobs === 1 ? "job" : "jobs"}</p>
        </div>
      </div>
    </div>
  );
}

export default TechnicianProfile;
