"use client";
import React, { useState } from "react";
import { useAppStore } from "../../context/AppStore";
import StatusBadge from "../../components/common/StatusBadge";
import SearchBar from "../../components/common/SearchBar";
import FilterBar from "../../components/common/FilterBar";
import EmptyState from "../../components/common/EmptyState";
import { FiCalendar, FiUser, FiMapPin, FiPhone, FiTag, FiClock, FiX, FiSearch, FiStar, FiCheck, FiArrowLeft } from "react-icons/fi";
import Portal from "../../components/common/Portal";

const BookingCard = ({ booking, onView }) => (
  <div className={`ff-card p-4 hover:border-orange-200 cursor-pointer ${booking.emergency ? "border-l-4 border-l-red-500" : ""}`} onClick={() => onView(booking)}>
    <div className="flex items-start justify-between gap-2 mb-3">
      <div>
        <p className="font-mono text-xs text-primary font-semibold">{booking.id}</p>
        <p className="font-bold text-dark-900 text-sm mt-0.5">{booking.customer}</p>
      </div>
      <div className="flex flex-col gap-1 items-end">
        <StatusBadge status={booking.status} />
        <StatusBadge status={booking.priority} size="xs" />
      </div>
    </div>
    <div className="space-y-1.5 text-xs text-gray-500">
      <div className="flex items-center gap-2"><FiTag className="w-3 h-3 text-primary" />{booking.category}</div>
      <div className="flex items-center gap-2"><FiUser className="w-3 h-3 text-gray-400" />{booking.technicianName || <span className="text-red-400 font-medium">Unassigned</span>}</div>
      <div className="flex items-center gap-2 truncate"><FiMapPin className="w-3 h-3 text-gray-400 shrink-0" /><span className="truncate">{booking.address}</span></div>
      <div className="flex items-center gap-2"><FiClock className="w-3 h-3 text-gray-400" />{new Date(booking.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</div>
    </div>
    <p className="text-xs text-gray-400 mt-2 line-clamp-1 italic">"{booking.issue}"</p>
  </div>
);

const TechnicianSelectModal = ({ booking, techs, onAssign, onClose }) => {
  const [search, setSearch] = useState("");
  const [skillFilter, setSkillFilter] = useState("");
  const [availFilter, setAvailFilter] = useState("Available");

  const filtered = techs.filter(t => {
    const matchSearch = !search || t.name.toLowerCase().includes(search.toLowerCase());
    const matchSkill = !skillFilter || t.category === skillFilter;
    const matchAvail = !availFilter || t.availability === availFilter;
    return matchSearch && matchSkill && matchAvail;
  }).sort((a, b) => b.avgRating - a.avgRating);

  return (
    <Portal>
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[85vh] flex flex-col animate-fadeIn">
        <div className="bg-gradient-to-r from-orange-500 to-orange-600 p-5 text-white rounded-t-2xl shrink-0">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-bold text-lg">Assign Technician</p>
              <p className="text-xs text-white/70">Booking {booking.id} · {booking.category}</p>
            </div>
            <button onClick={onClose} className="p-2 rounded-lg bg-white/20 hover:bg-white/30"><FiX className="w-5 h-5" /></button>
          </div>
        </div>
        <div className="p-4 border-b border-gray-100 shrink-0 space-y-3">
          <div className="relative">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search technician..." className="ff-input pl-9" />
          </div>
          <div className="flex gap-2 flex-wrap">
            {["", "Electrician", "Plumber", "AC Repair", "Carpenter", "Painter"].map(s => (
              <button key={s} onClick={() => setSkillFilter(s)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${skillFilter === s ? "bg-primary text-white" : "bg-gray-100 text-gray-500 hover:bg-gray-200"}`}>
                {s || "All Skills"}
              </button>
            ))}
            <button onClick={() => setAvailFilter(v => v === "Available" ? "" : "Available")}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${availFilter === "Available" ? "bg-green-500 text-white" : "bg-gray-100 text-gray-500"}`}>
              Available Only
            </button>
          </div>
        </div>
        <div className="overflow-y-auto flex-1 p-4 space-y-3">
          {filtered.length === 0 && <EmptyState title="No technicians found" />}
          {filtered.map(t => (
            <div key={t.id} className={`ff-card p-4 flex items-center gap-3 ${t.availability !== "Available" ? "opacity-60" : "hover:border-orange-200"}`}>
              <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center text-white font-bold text-lg shrink-0">{t.name.charAt(0)}</div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="font-bold text-dark-900 text-sm">{t.name}</p>
                  <span className="text-xs text-gray-400">{t.id}</span>
                </div>
                <p className="text-xs text-gray-500">{t.category}</p>
                <div className="flex items-center gap-3 mt-1">
                  <StatusBadge status={t.availability} size="xs" />
                  <span className="flex items-center gap-1 text-xs text-yellow-500 font-semibold"><FiStar className="w-3 h-3 fill-current" />{t.avgRating}</span>
                  <span className="text-xs text-gray-400">{t.avgResponseTime} avg</span>
                </div>
                {t.currentBooking && <p className="text-xs text-orange-500 mt-0.5">Current: {t.currentBooking}</p>}
              </div>
              {t.availability === "Available" && (
                <button onClick={() => onAssign(booking, t)} className="ff-btn-primary flex items-center gap-1.5 shrink-0">
                  <FiCheck className="w-3.5 h-3.5" /> Assign
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
    </Portal>
  );
};

const BookingDetailModal = ({ booking, onClose, onAssign, onMarkCompleted }) => (
  <Portal>
  <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
    <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
    <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg animate-fadeIn overflow-hidden">
      <div className={`p-5 text-white ${booking.emergency ? "bg-gradient-to-r from-red-500 to-red-600" : "bg-gradient-to-r from-orange-500 to-orange-600"}`}>
        <div className="flex items-center justify-between">
          <div>
            <p className="font-mono text-sm text-white/70">{booking.id}</p>
            <p className="text-xl font-bold">{booking.customer}</p>
          </div>
          <button onClick={onClose} className="p-2 rounded-lg bg-white/20 hover:bg-white/30"><FiX className="w-5 h-5" /></button>
        </div>
        <div className="flex gap-2 mt-2"><StatusBadge status={booking.status} /><StatusBadge status={booking.priority} /></div>
      </div>
      <div className="p-5 space-y-3">
        {[
          { icon: FiTag,    label: "Category",   value: booking.category },
          { icon: FiPhone,  label: "Phone",      value: booking.phone },
          { icon: FiMapPin, label: "Address",    value: booking.address },
          { icon: FiClock,  label: "Scheduled",  value: new Date(booking.scheduledAt).toLocaleString() },
        ].map(({ icon: Icon, label, value }) => (
          <div key={label} className="flex items-start gap-3">
            <div className="w-8 h-8 bg-orange-50 rounded-lg flex items-center justify-center shrink-0"><Icon className="w-4 h-4 text-primary" /></div>
            <div><p className="text-xs text-gray-400">{label}</p><p className="text-sm font-medium text-dark-800">{value}</p></div>
          </div>
        ))}

        {/* Technician info shown to customer after assignment */}
        {booking.technicianName ? (
          <div className="bg-green-50 border border-green-100 rounded-xl p-3 space-y-1.5">
            <p className="text-xs font-bold text-green-700 mb-1">Assigned Technician (visible to customer)</p>
            <div className="flex items-center gap-2 text-xs text-green-700"><FiUser className="w-3 h-3" />{booking.technicianName}</div>
            {booking.technicianPhone && <div className="flex items-center gap-2 text-xs text-green-700"><FiPhone className="w-3 h-3" />{booking.technicianPhone}</div>}
            {booking.technicianCategory && <div className="flex items-center gap-2 text-xs text-green-700"><FiTag className="w-3 h-3" />{booking.technicianCategory}</div>}
            {booking.technicianRating && <div className="flex items-center gap-2 text-xs text-green-700"><FiStar className="w-3 h-3" />Rating: {booking.technicianRating}</div>}
          </div>
        ) : booking.status !== "Cancelled" && (
          <button onClick={() => onAssign(booking)} className="ff-btn-primary w-full flex items-center justify-center gap-2">
            <FiUser className="w-4 h-4" /> Assign Technician
          </button>
        )}

        {/* Customer info shown to technician (booking details) */}
        {booking.technicianName && (
          <div className="bg-blue-50 border border-blue-100 rounded-xl p-3 space-y-1.5">
            <p className="text-xs font-bold text-blue-700 mb-1">Customer Info (sent to technician)</p>
            <div className="flex items-center gap-2 text-xs text-blue-700"><FiUser className="w-3 h-3" />{booking.customer}</div>
            <div className="flex items-center gap-2 text-xs text-blue-700"><FiPhone className="w-3 h-3" />{booking.phone}</div>
            <div className="flex items-center gap-2 text-xs text-blue-700"><FiMapPin className="w-3 h-3" />{booking.address}</div>
          </div>
        )}

        {/* Customer mark completed */}
        {booking.technicianName && !["Completed", "Cancelled"].includes(booking.status) && (
          <button onClick={() => { onMarkCompleted(booking.id); onClose(); }}
            className="w-full py-2.5 rounded-xl bg-green-500 hover:bg-green-600 text-white text-sm font-bold flex items-center justify-center gap-2">
            <FiCheck className="w-4 h-4" /> Customer Confirms Completed
          </button>
        )}

        <div className="bg-gray-50 rounded-xl p-3">
          <p className="text-xs text-gray-400 mb-1">Issue</p>
          <p className="text-sm text-dark-700">{booking.issue}</p>
        </div>
      </div>
    </div>
    </div>
  </Portal>
);

const ViewBookings = ({ onBack }) => {
  const { bookings, technicians, assignTechnician, customerMarkCompleted } = useAppStore();
  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState({});
  const [selected, setSelected] = useState(null);
  const [assigning, setAssigning] = useState(null);
  const [toast, setToast] = useState(null);

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(null), 3000); };

  const handleAssign = (booking, tech) => {
    assignTechnician(booking.id, tech, false);
    setAssigning(null); setSelected(null);
    showToast(`✅ ${tech.name} assigned to ${booking.id}`);
  };

  const emergency = bookings.filter(b => b.emergency || b.priority === "Emergency");
  const normal = bookings.filter(b => !b.emergency && b.priority !== "Emergency");

  const applyFilters = (list) => list.filter(b => {
    const matchSearch = !search || [b.id, b.customer, b.category].some(v => v?.toLowerCase().includes(search.toLowerCase()));
    const matchStatus = !filters.status || b.status === filters.status;
    const matchPriority = !filters.priority || b.priority === filters.priority;
    const matchCategory = !filters.category || b.category === filters.category;
    return matchSearch && matchStatus && matchPriority && matchCategory;
  });

  const filteredEmergency = applyFilters(emergency);
  const filteredNormal = applyFilters(normal);

  return (
    <div className="space-y-5 animate-fadeIn">
      {toast && (
        <div className="fixed top-4 right-4 z-50 bg-dark-900 text-white px-4 py-3 rounded-xl shadow-2xl text-sm font-medium animate-fadeIn">{toast}</div>
      )}

      <button onClick={onBack} className="flex items-center gap-2 text-sm text-gray-500 hover:text-dark-900 transition-colors">
        <FiArrowLeft className="w-4 h-4" /> Back to Dashboard
      </button>

      <div className="ff-card p-4 flex flex-col sm:flex-row gap-3">
        <SearchBar value={search} onChange={setSearch} placeholder="Search bookings..." className="flex-1" />
        <FilterBar
          filters={[
            { key: "status",   label: "Status",   options: ["Pending", "Assigned", "On The Way", "In Progress", "Completed", "Cancelled", "Delayed"] },
            { key: "priority", label: "Priority", options: ["High", "Normal", "Low", "Emergency"] },
            { key: "category", label: "Category", options: ["Electrician", "Plumber", "AC Repair", "Carpenter", "Painter"] },
          ]}
          values={filters}
          onChange={(k, v) => setFilters(f => ({ ...f, [k]: v }))}
        />
      </div>

      {filteredEmergency.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-3">
            <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse-dot" />
            <p className="font-bold text-red-600 text-sm">Emergency Bookings ({filteredEmergency.length})</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredEmergency.map(b => <BookingCard key={b.id} booking={b} onView={setSelected} />)}
          </div>
        </div>
      )}

      <div>
        <p className="font-bold text-dark-800 text-sm mb-3">Normal Bookings ({filteredNormal.length})</p>
        {filteredNormal.length > 0
          ? <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">{filteredNormal.map(b => <BookingCard key={b.id} booking={b} onView={setSelected} />)}</div>
          : <div className="ff-card"><EmptyState icon={FiCalendar} title="No bookings found" /></div>
        }
      </div>

      {selected && !assigning && (
        <BookingDetailModal
          booking={selected}
          onClose={() => setSelected(null)}
          onAssign={(b) => { setAssigning(b); }}
          onMarkCompleted={(id) => { customerMarkCompleted(id); showToast("✅ Booking marked completed. Technician is now available."); }}
        />
      )}
      {assigning && (
        <TechnicianSelectModal booking={assigning} techs={technicians} onAssign={handleAssign} onClose={() => setAssigning(null)} />
      )}
    </div>
  );
};

export default ViewBookings;
