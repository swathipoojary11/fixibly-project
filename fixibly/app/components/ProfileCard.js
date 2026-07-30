"use client";
import React, { useEffect, useState } from "react";
import {
  FaUserCircle,
  FaEnvelope,
  FaPhoneAlt,
  FaMapMarkerAlt,
  FaIdBadge,
} from "react-icons/fa";

const ProfileCard = ({
  user,
  onEdit,
  onLogout,
  floating = false,
  className = "",
  compact = false,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: "", role: "", id: "", email: "", phone: "", address: "",
  });

  const profileUser = user || {};
  const roleText = profileUser.role || "Field Technician";
  const roleParts = roleText.split(" ").filter(Boolean);

  useEffect(() => {
    setFormData({
      name: profileUser.name || "Alex Carter",
      role: profileUser.role || "Field Technician",
      id: profileUser.id || "FT-1024",
      email: profileUser.email || "alex.carter@fieldflow.com",
      phone: profileUser.phone || "+91 98765 43210",
      address: profileUser.address || "Mangalore, Karnataka",
    });
  }, [profileUser]);

  const handleEditStart = () => { setIsEditing(true); if (onEdit) onEdit(); };
  const handleFieldChange = (field, value) => setFormData((prev) => ({ ...prev, [field]: value }));
  const handleSave = () => setIsEditing(false);

  const content = (
    <div className={`w-full ${compact ? "max-w-sm" : "max-w-md"} rounded-none bg-[#181818] text-white shadow-2xl border border-white/10 p-5 sm:p-6 ${floating ? "shadow-[#F54C0F]/10" : ""} ${className}`}>
      <div className="flex flex-col items-center text-center">
        {profileUser.avatar ? (
          <img src={profileUser.avatar} alt="Profile" className="w-20 h-20 rounded-none object-cover border-2 border-[#F54C0F] shadow-lg shadow-[#F54C0F]/20" />
        ) : (
          <div className="w-20 h-20 rounded-none bg-[#F54C0F]/15 text-[#F54C0F] flex items-center justify-center border border-[#F54C0F]/20">
            <FaUserCircle className="text-[72px]" />
          </div>
        )}

        <h2 className="mt-4 text-[18px] font-bold text-white leading-snug">
          {isEditing ? formData.name : profileUser.name || "Alex Carter"}
        </h2>

        <div className="mt-2 flex flex-wrap items-center justify-center gap-2">
          {isEditing ? (
            <input
              value={formData.role}
              onChange={(e) => handleFieldChange("role", e.target.value)}
              className="w-full rounded-none border border-white/10 bg-[#202020] px-3 py-2 text-[11px] font-bold uppercase tracking-wider text-[#F54C0F] text-center"
            />
          ) : (
            roleParts.map((part, index) => (
              <span key={`${part}-${index}`} className="px-3 py-1 rounded-none bg-[#FFF3EE] text-[#F54C0F] text-[11px] font-bold uppercase tracking-wider border border-[#F54C0F]/20">
                {part}
              </span>
            ))
          )}
        </div>
      </div>

      <div className="my-5 border-t border-white/10"></div>

      {isEditing ? (
        <div className="space-y-3 text-[12px] text-[#D7D7D7]">
          <input value={formData.name} onChange={(e) => handleFieldChange("name", e.target.value)} className="w-full rounded-none border border-white/10 bg-[#202020] px-3 py-2 text-white" placeholder="Name" />
          <input value={formData.email} onChange={(e) => handleFieldChange("email", e.target.value)} className="w-full rounded-none border border-white/10 bg-[#202020] px-3 py-2 text-white" placeholder="Email" />
          <input value={formData.phone} onChange={(e) => handleFieldChange("phone", e.target.value)} className="w-full rounded-none border border-white/10 bg-[#202020] px-3 py-2 text-white" placeholder="Phone" />
          <input value={formData.address} onChange={(e) => handleFieldChange("address", e.target.value)} className="w-full rounded-none border border-white/10 bg-[#202020] px-3 py-2 text-white" placeholder="Address" />
          <div className="flex gap-2 pt-1">
            <button onClick={handleSave} className="flex-1 bg-[#F54C0F] hover:bg-[#DB4206] text-white py-2 rounded-none text-[13px] font-bold">Save</button>
            <button onClick={() => setIsEditing(false)} className="flex-1 border border-white/10 text-white hover:bg-white/10 py-2 rounded-none text-[13px] font-bold">Cancel</button>
          </div>
        </div>
      ) : (
        <div className="space-y-3 text-[13px] text-[#D7D7D7]">
          <div className="flex items-center gap-3.5">
            <FaIdBadge className="text-[#F54C0F] text-[15px] shrink-0" />
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-wider text-[#9A9A9A]">User ID</p>
              <p className="font-semibold text-white">{profileUser.id || "FT-1024"}</p>
            </div>
          </div>
          <div className="flex items-center gap-3.5">
            <FaEnvelope className="text-[#F54C0F] text-[15px] shrink-0" />
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-wider text-[#9A9A9A]">Email</p>
              <p className="font-semibold text-white">{profileUser.email || "alex.carter@fieldflow.com"}</p>
            </div>
          </div>
          <div className="flex items-center gap-3.5">
            <FaPhoneAlt className="text-[#F54C0F] text-[15px] shrink-0" />
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-wider text-[#9A9A9A]">Phone</p>
              <p className="font-semibold text-white">{profileUser.phone || "+91 98765 43210"}</p>
            </div>
          </div>
          <div className="flex items-center gap-3.5">
            <FaMapMarkerAlt className="text-[#F54C0F] text-[15px] shrink-0" />
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-wider text-[#9A9A9A]">Address</p>
              <p className="font-semibold text-white">{profileUser.address || "Mangalore, Karnataka"}</p>
            </div>
          </div>
          {profileUser.extraFields?.map((field, index) => (
            <div key={index} className="flex justify-between items-center py-2 border-b border-white/10">
              <span className="text-[10px] font-semibold uppercase tracking-wider text-[#9A9A9A]">{field.label}</span>
              <span className="font-semibold text-white">{field.value}</span>
            </div>
          ))}
        </div>
      )}

      <div className="mt-5 space-y-3">
        {!isEditing && (
          <button onClick={handleEditStart} className="w-full bg-[#F54C0F] hover:bg-[#DB4206] text-white py-2.5 rounded-none text-[13px] font-bold transition-all duration-200 shadow-lg shadow-[#F54C0F]/20">
            Edit Profile
          </button>
        )}
        <button onClick={onLogout} className="w-full border border-[#F54C0F]/30 text-[#F54C0F] hover:bg-[#F54C0F]/10 py-2.5 rounded-none text-[13px] font-bold transition-all duration-200">
          Logout
        </button>
      </div>
    </div>
  );

  return floating ? (
    <div className="absolute right-0 top-full mt-3 z-50 w-80 max-w-[calc(100vw-2rem)]">{content}</div>
  ) : content;
};

export default ProfileCard;
