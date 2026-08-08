"use client";

// Import React hooks, icons, and AuthContext for universal multi-role profile rendering
import React, { useEffect, useState } from "react";
import {
  FaUserCircle, FaEnvelope, FaPhoneAlt, FaMapMarkerAlt,
  FaIdBadge, FaCheckCircle, FaEdit, FaSignOutAlt, FaSpinner,
  FaWrench, FaHeadset, FaUserShield, FaStar
} from "react-icons/fa";
import { useAuth } from "../context/AuthContext";

const ProfileCard = ({ user: propUser, onEdit, onLogout: propLogout, floating = false, className = "", compact = false }) => {
  const { user: contextUser, updateUserProfile, logout: contextLogout } = useAuth();
  const activeUser = propUser || contextUser || {};
  const activeLogout = propLogout || contextLogout;

  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({ name: "", phone: "", customField: "" });

  // Normalize user role across login formats
  const rawRole = (activeUser.roles?.role_name || activeUser.role_name || activeUser.role || "Customer").toString();
  const lowerRole = rawRole.toLowerCase();

  const isTech = lowerRole.includes("tech");
  const isDisp = lowerRole.includes("dispatch");
  const isAdmin = lowerRole.includes("admin");

  // Determine role metadata (Title, Badge Colors, Icons, IDs)
  let roleTitle = "Verified Customer";
  let roleBadgeStyle = "bg-[#FF5500]/10 text-[#FF5500] border-[#FF5500]/20";
  let RoleIcon = FaCheckCircle;
  let idPrefix = "CUST";
  let extraLabel = "Delivery Address";
  let extraValue = activeUser.address || "FieldFlow Location";

  if (isTech) {
    roleTitle = "Field Technician";
    roleBadgeStyle = "bg-blue-500/10 text-blue-600 border-blue-500/20";
    RoleIcon = FaWrench;
    idPrefix = "TECH";
    extraLabel = "Specialization";
    extraValue = activeUser.specialization || activeUser.category || "General Repairs";
  } else if (isDisp) {
    roleTitle = "Operations Dispatcher";
    roleBadgeStyle = "bg-purple-500/10 text-purple-600 border-purple-500/20";
    RoleIcon = FaHeadset;
    idPrefix = "DISP";
    extraLabel = "Dispatch Region";
    extraValue = activeUser.region || activeUser.zone || "Central Operations Hub";
  } else if (isAdmin) {
    roleTitle = "System Administrator";
    roleBadgeStyle = "bg-emerald-500/10 text-emerald-600 border-emerald-500/20";
    RoleIcon = FaUserShield;
    idPrefix = "ADM";
    extraLabel = "Access Level";
    extraValue = activeUser.access_level || "Super Administrator";
  }

  const displayName = activeUser.full_name || activeUser.name || `${roleTitle} User`;
  const displayEmail = activeUser.email || `${lowerRole}@fieldflow.com`;
  const displayPhone = activeUser.phone || "+91 98765 43210";
  const displayId = activeUser.user_id || activeUser.id ? `${idPrefix}-${activeUser.user_id || activeUser.id}` : `${idPrefix}-1024`;

  useEffect(() => {
    setFormData({
      name: activeUser.full_name || activeUser.name || "",
      phone: activeUser.phone || "",
      customField: extraValue,
    });
  }, [activeUser]);

  const handleEditStart = () => { setIsEditing(true); if (onEdit) onEdit(); };
  const handleFieldChange = (field, value) => setFormData((prev) => ({ ...prev, [field]: value }));

  const handleSave = async () => {
    setSaving(true);
    const updatePayload = {
      full_name: formData.name,
      name: formData.name,
      phone: formData.phone,
    };
    if (!isTech && !isDisp && !isAdmin) {
      updatePayload.address = formData.customField;
    } else if (isTech) {
      updatePayload.specialization = formData.customField;
    } else if (isDisp) {
      updatePayload.region = formData.customField;
    }
    await updateUserProfile(updatePayload);
    setSaving(false);
    setIsEditing(false);
  };

  const content = (
    <div className={`w-full ${compact ? "max-w-sm" : "max-w-md"} rounded-3xl bg-white text-gray-900 shadow-2xl border border-gray-100 p-6 sm:p-8 relative overflow-hidden transition-all duration-300 ${floating ? "shadow-[#FF5500]/20 border-[#FF5500]/20" : ""} ${className}`}>
      {/* Background Banner Decor */}
      <div className="absolute top-0 left-0 right-0 h-24 bg-gradient-to-r from-[#FF5500]/10 via-[#FF5500]/5 to-orange-100/30 pointer-events-none"></div>

      {/* Header: Avatar, Name & Role Badge */}
      <div className="flex flex-col items-center text-center relative z-10 pt-2">
        <div className="relative group">
          <div className="w-24 h-24 rounded-full border-4 border-white shadow-2xl ring-4 ring-[#FF5500]/25 overflow-hidden flex items-center justify-center bg-orange-50 shrink-0">
            {activeUser.avatar ? (
              <img src={activeUser.avatar} alt="Avatar" className="w-full h-full object-cover" />
            ) : (
              <FaUserCircle className="text-[84px] text-[#FF5500]" />
            )}
          </div>
          <span className="absolute bottom-1 right-1 w-5 h-5 bg-emerald-500 border-2 border-white rounded-full shadow-md" title="Active Session"></span>
        </div>

        <h2 className="mt-4 text-2xl font-black text-gray-900 tracking-tight leading-snug">
          {isEditing ? (formData.name || "Edit Profile") : displayName}
        </h2>

        <div className="mt-2.5 flex items-center gap-2 flex-wrap justify-center">
          <span className={`px-3.5 py-1 text-[11px] font-extrabold uppercase tracking-wider rounded-full border inline-flex items-center gap-1.5 shadow-sm ${roleBadgeStyle}`}>
            <RoleIcon className="text-[10px]" /> {roleTitle}
          </span>
          {isTech && (
            <span className="px-3 py-1 bg-amber-50 text-amber-600 text-[11px] font-bold rounded-full border border-amber-200 inline-flex items-center gap-1">
              <FaStar className="text-[10px] text-amber-500" /> {activeUser.rating || activeUser.avgRating || "4.9"}
            </span>
          )}
        </div>
      </div>

      <div className="my-6 border-t border-gray-100"></div>

      {/* Edit Mode vs Information Card Display */}
      {isEditing ? (
        <div className="space-y-4 text-xs font-semibold text-gray-700">
          <div>
            <label className="text-[10px] font-extrabold uppercase tracking-wider text-gray-500 mb-1 block">Full Name</label>
            <input type="text" value={formData.name} onChange={(e) => handleFieldChange("name", e.target.value)} className="w-full border border-gray-200 bg-gray-50 rounded-xl px-4 py-3 text-sm font-bold text-gray-900 focus:bg-white focus:border-[#FF5500] outline-none shadow-sm" placeholder="Full Name" />
          </div>
          <div>
            <label className="text-[10px] font-extrabold uppercase tracking-wider text-gray-500 mb-1 block">Phone Number</label>
            <input type="text" value={formData.phone} onChange={(e) => handleFieldChange("phone", e.target.value)} className="w-full border border-gray-200 bg-gray-50 rounded-xl px-4 py-3 text-sm font-bold text-gray-900 focus:bg-white focus:border-[#FF5500] outline-none shadow-sm" placeholder="Phone Number" />
          </div>
          <div>
            <label className="text-[10px] font-extrabold uppercase tracking-wider text-gray-500 mb-1 block">{extraLabel}</label>
            <input type="text" value={formData.customField} onChange={(e) => handleFieldChange("customField", e.target.value)} className="w-full border border-gray-200 bg-gray-50 rounded-xl px-4 py-3 text-sm font-bold text-gray-900 focus:bg-white focus:border-[#FF5500] outline-none shadow-sm" placeholder={extraLabel} />
          </div>
          <div className="flex gap-3 pt-2">
            <button onClick={handleSave} disabled={saving} className="flex-1 bg-[#FF5500] hover:bg-[#e04b00] text-white py-3 rounded-xl font-extrabold text-sm shadow-lg transition flex items-center justify-center gap-2">
              {saving ? <FaSpinner className="animate-spin" /> : <FaCheckCircle />} {saving ? "Saving..." : "Save Changes"}
            </button>
            <button onClick={() => setIsEditing(false)} className="flex-1 bg-gray-100 border border-gray-200 text-gray-700 hover:bg-gray-200 py-3 rounded-xl font-extrabold text-sm transition">Cancel</button>
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          <div className="bg-gray-50/80 border border-gray-100 p-3.5 rounded-2xl flex items-center gap-4 hover:border-[#FF5500]/30 transition">
            <div className="w-10 h-10 rounded-xl bg-[#FF5500] text-white flex items-center justify-center shadow-md shrink-0"><FaIdBadge className="text-base" /></div>
            <div><p className="text-[10px] font-extrabold uppercase tracking-wider text-gray-400">System ID</p><p className="text-sm font-bold text-gray-900">{displayId}</p></div>
          </div>
          <div className="bg-gray-50/80 border border-gray-100 p-3.5 rounded-2xl flex items-center gap-4 hover:border-[#FF5500]/30 transition">
            <div className="w-10 h-10 rounded-xl bg-[#FF5500] text-white flex items-center justify-center shadow-md shrink-0"><FaEnvelope className="text-base" /></div>
            <div className="overflow-hidden"><p className="text-[10px] font-extrabold uppercase tracking-wider text-gray-400">Email Address</p><p className="text-sm font-bold text-gray-900 truncate max-w-[220px]">{displayEmail}</p></div>
          </div>
          <div className="bg-gray-50/80 border border-gray-100 p-3.5 rounded-2xl flex items-center gap-4 hover:border-[#FF5500]/30 transition">
            <div className="w-10 h-10 rounded-xl bg-[#FF5500] text-white flex items-center justify-center shadow-md shrink-0"><FaPhoneAlt className="text-base" /></div>
            <div><p className="text-[10px] font-extrabold uppercase tracking-wider text-gray-400">Phone Number</p><p className="text-sm font-bold text-gray-900">{displayPhone}</p></div>
          </div>
          <div className="bg-gray-50/80 border border-gray-100 p-3.5 rounded-2xl flex items-center gap-4 hover:border-[#FF5500]/30 transition">
            <div className="w-10 h-10 rounded-xl bg-[#FF5500] text-white flex items-center justify-center shadow-md shrink-0"><FaMapMarkerAlt className="text-base" /></div>
            <div><p className="text-[10px] font-extrabold uppercase tracking-wider text-gray-400">{extraLabel}</p><p className="text-sm font-bold text-gray-900 leading-snug">{extraValue}</p></div>
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="mt-6 space-y-3">
        {!isEditing && (
          <button onClick={handleEditStart} className="w-full bg-[#FF5500] hover:bg-[#e04b00] text-white py-3.5 rounded-xl font-extrabold text-sm shadow-lg hover:shadow-xl transition duration-200 flex items-center justify-center gap-2">
            <FaEdit className="text-base" /> Edit Profile Details
          </button>
        )}
        <button onClick={activeLogout} className="w-full bg-gray-50 hover:bg-red-50 border border-gray-200 text-red-600 hover:text-red-700 py-3 rounded-xl font-extrabold text-sm transition duration-200 flex items-center justify-center gap-2">
          <FaSignOutAlt className="text-base" /> Log Out
        </button>
      </div>
    </div>
  );

  return floating ? <div className="absolute right-0 top-full mt-3 z-50 w-88 max-w-[calc(100vw-2rem)]">{content}</div> : content;
};

export default ProfileCard;
