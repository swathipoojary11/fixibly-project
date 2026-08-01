"use client";
import React, { useState } from "react";
import { useDispatcherStore as useAppStore } from "../DispatcherStore";
import StatusBadge from "../../components/dispatcher-admin/StatusBadge";
import SearchBar from "../../components/dispatcher-admin/SearchBar";
import FilterBar from "../../components/dispatcher-admin/FilterBar";
import EmptyState from "../../components/dispatcher-admin/EmptyState";
import { FiCalendar, FiUser, FiMapPin, FiPhone, FiTag, FiClock, FiX, FiSearch, FiStar, FiCheck, FiArrowLeft, FiMail } from "react-icons/fi";
import Portal from "../../components/dispatcher-admin/Portal";

const BookingCard = ({ booking, onView }) => (
  <div className={`ff-card p-4 hover:border-orange-200 cursor-pointer ${booking.emergency ? "border-l-4 border-l-red-500" : ""}`} onClick={() => onView(booking)}>
    <div className="flex items-start justify-between gap-2 mb-3">
      <div>
        <p className="font-mono text-xs text-primary font-semibold">{booking.id}</p>
        <p className="font-bold text-dark-900 text-sm mt-0.5">{booking.customer}</p>
      </div>
      <div className="flex flex-col gap-1 items-end">
        <StatusBadge astatus={booking.status} />
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
  const [skillFilter, setSkillFilter] = useState(booking.category || "");
  const [availFilter, setAvailFilter] = useState("Available");

  const filtered = techs.filter(t => {
    const matchSearch = !search || t.name.toLowerCase().includes(search.toLowerCase());
    const matchSkill = !skillFilter || t.category === skillFilter;
    const matchAvail = !availFilter || t.availability === availFilter;
    return matchSearch && matchSkill && matchAvail;
  }).sort((a, b) => {
    if (a.completedJobs !== b.completedJobs) return (b.completedJobs || 0) - (a.completedJobs || 0);
    return b.avgRating - a.avgRating;
  });

  const topRecommend = filtered.length > 0 && skillFilter === booking.category && availFilter === "Available" ? filtered[0] : null;

  return (
    <Portal>
      <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
        <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
        <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] flex flex-col animate-fadeIn">
          <div className="bg-gradient-to-r from-orange-500 to-orange-600 p-5 text-white rounded-t-2xl shrink-0">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-bold text-lg">Assign Technician</p>
                <p className="text-xs text-white/70">Booking {booking.id} · {booking.category}</p>
              </div>
              <button onClick={onClose} className="p-2 rounded-lg bg-white/20 hover:bg-white/30"><FiX className="w-5 h-5" /></button>
            </div>
          </div>
          <div className="p-4 border-b border-gray-100 shrink-0 space-y-3 bg-gray-50">
            <div className="relative">
              <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search technician by name or skill..." className="ff-input pl-9 bg-white w-full" />
            </div>
            <div className="flex gap-2 flex-wrap">
              {["", "Electrician", "Plumber", "AC Repair", "Carpenter", "Painter"].map(s => (
                <button key={s} onClick={() => setSkillFilter(s)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${skillFilter === s ? "bg-primary text-white" : "bg-white text-gray-500 border border-gray-200 hover:bg-gray-100"}`}>
                  {s || "All Skills"}
                </button>
              ))}
              <button onClick={() => setAvailFilter(v => v === "Available" ? "" : "Available")}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${availFilter === "Available" ? "bg-green-500 text-white" : "bg-white text-gray-500 border border-gray-200"}`}>
                Available Only
              </button>
            </div>
          </div>
          <div className="overflow-y-auto flex-1 p-4 space-y-4">
            {filtered.length === 0 && <EmptyState title="No technicians match criteria" />}

            {topRecommend && (
              <div className="space-y-2">
                <p className="text-sm font-bold text-dark-800 flex items-center gap-2"><FiStar className="w-4 h-4 text-yellow-500 fill-current" /> System Recommended</p>
                <div className="border-2 border-primary/30 bg-orange-50 rounded-xl p-4 flex gap-4">
                  <div className="w-14 h-14 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center text-white font-bold text-xl shadow-lg shrink-0">{topRecommend.name.charAt(0)}</div>
                  <div className="flex-1">
                    <p className="font-bold text-lg text-dark-900">{topRecommend.name}</p>
                    <div className="flex gap-4 text-xs text-gray-600 mt-1">
                      <span className="flex items-center gap-1"><FiPhone className="w-3 h-3" /> {topRecommend.phone}</span>
                      <span className="flex items-center gap-1"><FiMail className="w-3 h-3" /> {topRecommend.email || "N/A"}</span>
                    </div>
                    <div className="mt-3 flex gap-2 flex-wrap text-[11px] font-medium">
                      <span className="bg-white px-2 py-1 rounded-md text-primary flex items-center gap-1">✓ {topRecommend.category} Specialist</span>
                      <span className="bg-white px-2 py-1 rounded-md text-green-700 flex items-center gap-1">✓ {topRecommend.availability}</span>
                      <span className="bg-white px-2 py-1 rounded-md text-yellow-600 flex items-center gap-1">✓ {topRecommend.avgRating} Rating</span>
                      <span className="bg-white px-2 py-1 rounded-md text-indigo-600 flex items-center gap-1">✓ {topRecommend.completedJobs || 0} Jobs Done</span>
                      <span className="bg-white px-2 py-1 rounded-md text-blue-600 flex items-center gap-1">✓ 1.2 km away</span>
                    </div>
                  </div>
                  <button onClick={() => onAssign(booking, topRecommend)} className="ff-btn-primary h-fit mt-auto whitespace-nowrap">Assign Match</button>
                </div>
              </div>
            )}

            {filtered.filter(t => t.id !== topRecommend?.id).length > 0 && (
              <div className="space-y-3 mt-4">
                <p className="text-sm font-bold text-gray-500">Other Matches</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {filtered.filter(t => t.id !== topRecommend?.id).map(t => (
                    <div key={t.id} className={`ff-card p-4 flex flex-col gap-3 ${t.availability !== "Available" ? "opacity-60" : "hover:border-orange-200"}`}>
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-dark-700 font-bold text-lg shrink-0">{t.name.charAt(0)}</div>
                        <div className="flex-1 min-w-0">
                          <p className="font-bold text-dark-900 text-sm truncate">{t.name}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <StatusBadge status={t.availability} size="xs" />
                            <span className="flex items-center gap-1 text-xs text-yellow-500 font-semibold"><FiStar className="w-3 h-3 fill-current" />{t.avgRating}</span>
                          </div>
                        </div>
                      </div>
                      <div className="text-xs text-gray-500 space-y-1 bg-gray-50 p-2 rounded-lg">
                        <p>Skills: {t.category}</p>
                        <p>Exp: {Math.floor((t.completedJobs || 15) / 15)} Years</p>
                        <p>Completed: {t.completedJobs || 0} jobs</p>
                      </div>
                      {t.availability === "Available" && (
                        <button onClick={() => onAssign(booking, t)} className="w-full py-2 bg-orange-100 text-primary font-bold text-sm rounded-lg hover:bg-orange-200 transition-colors mt-auto flex justify-center items-center gap-2">
                          <FiCheck className="w-4 h-4" /> Select
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </Portal>
  );
};

const BookingDetailModal = ({ booking, onClose, onAssign, onMarkCompleted }) => {
  return (
    <Portal>
      <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
        <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
        <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] flex flex-col animate-fadeIn overflow-hidden">
          <div className={`p-5 text-white shrink-0 ${booking.emergency ? "bg-gradient-to-r from-red-500 to-red-600" : "bg-gradient-to-r from-orange-500 to-orange-600"}`}>
            <div className="flex items-center justify-between pointer-events-auto">
              <div>
                <p className="font-mono text-sm text-white/70">ID: {booking.id}</p>
                <p className="text-2xl font-bold">{booking.customer}</p>
              </div>
              <button onClick={onClose} className="p-2 rounded-lg bg-white/20 hover:bg-white/30"><FiX className="w-5 h-5" /></button>
            </div>
            <div className="flex gap-2 mt-3"><StatusBadge status={booking.status} /><StatusBadge status={booking.priority} /></div>
          </div>
          <div className="flex-1 overflow-y-auto p-0">
            <div className="grid grid-cols-1 md:grid-cols-2">
              {/* Left Column: Details */}
              <div className="p-5 border-r border-gray-100 space-y-4">
                <p className="font-bold text-dark-900 border-b border-gray-100 pb-2">Customer & Booking Info</p>
                <div className="space-y-3">
                  {[
                    { label: "Category", value: booking.category },
                    { label: "Phone", value: booking.phone || "9876543210" },
                    { label: "Email", value: booking.email || "customer@example.com" },
                    { label: "Address", value: booking.address },
                    { label: "City", value: booking.city || "Bangalore" },
                    { label: "Pincode", value: booking.pincode || "560001" },
                    { label: "Pref. Time", value: booking.scheduledAt ? new Date(booking.scheduledAt).toLocaleString() : "ASAP" },
                    { label: "Created At", value: new Date(booking.createdAt).toLocaleString() },
                  ].map(({ label, value }) => (
                    <div key={label} className="grid grid-cols-3 text-xs">
                      <span className="text-gray-400 col-span-1">{label}</span>
                      <span className="font-medium text-dark-800 col-span-2">{value}</span>
                    </div>
                  ))}
                </div>

                <div className="bg-gray-50 rounded-xl p-3">
                  <p className="text-xs font-semibold text-gray-500 mb-1">Issue Description</p>
                  <p className="text-sm text-dark-700">{booking.issue}</p>
                </div>

                {booking.status === "Pending" && (
                  <button onClick={() => onAssign(booking)} className="ff-btn-primary w-full flex items-center justify-center gap-2">
                    <FiUser className="w-4 h-4" /> Assign Technician
                  </button>
                )}

                {booking.technicianName && !["Completed", "Cancelled"].includes(booking.status) && (
                  <button onClick={() => { onMarkCompleted(booking.id); onClose(); }} className="w-full py-2.5 rounded-xl bg-green-500 hover:bg-green-600 text-white text-sm font-bold flex items-center justify-center gap-2 mt-4">
                    <FiCheck className="w-4 h-4" /> Customer Confirms Completed
                  </button>
                )}
              </div>

              {/* Right Column: Timeline & Technician */}
              <div className="p-5 space-y-4 bg-gray-50">
                {booking.technicianName && (
                  <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm space-y-2">
                    <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Assigned Technician</p>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center text-primary font-bold text-lg shrink-0">{booking.technicianName.charAt(0)}</div>
                      <div>
                        <p className="font-bold text-dark-800">{booking.technicianName}</p>
                        <p className="text-xs text-gray-500 flex items-center gap-1"><FiStar className="w-3 h-3 text-yellow-500 fill-current" /> {booking.technicianRating || "4.8"}</p>
                      </div>
                    </div>
                    <div className="pt-2 mt-2 border-t border-gray-100 flex flex-col gap-1 text-xs text-gray-600">
                      <span className="flex items-center gap-2"><FiPhone className="w-3 h-3 text-gray-400" /> {booking.technicianPhone || "N/A"}</span>
                      <span className="flex items-center gap-2"><FiTag className="w-3 h-3 text-gray-400" /> {booking.technicianCategory || "General"}</span>
                    </div>
                  </div>
                )}

                <div>
                  <p className="font-bold text-dark-900 border-b border-gray-200 pb-2 mb-3">Live Timeline</p>
                  <div className="space-y-4">
                    <div className="flex gap-3">
                      <div className="flex flex-col items-center">
                        <div className="w-2.5 h-2.5 rounded-full bg-primary mt-1" />
                        {booking.technicianName && <div className="w-0.5 h-full bg-primary my-1" />}
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-dark-800">Booking Created</p>
                        <p className="text-[10px] text-gray-400">{new Date(booking.createdAt).toLocaleString()}</p>
                      </div>
                    </div>
                    {booking.technicianName && (
                      <div className="flex gap-3">
                        <div className="flex flex-col items-center">
                          <div className="w-2.5 h-2.5 rounded-full bg-primary mt-1" />
                          {booking.status !== "Assigned" && <div className="w-0.5 h-full bg-primary my-1" />}
                        </div>
                        <div>
                          <p className="text-xs font-semibold text-dark-800">Dispatcher Assigned</p>
                          <p className="text-[10px] text-gray-400">{booking.technicianName} was assigned.</p>
                        </div>
                      </div>
                    )}
                    {["On The Way", "In Progress", "Completed"].includes(booking.status) && (
                      <div className="flex gap-3">
                        <div className="flex flex-col items-center">
                          <div className={`w-2.5 h-2.5 rounded-full mt-1 ${booking.status === "Completed" ? "bg-primary" : "bg-orange-400 animate-pulse"}`} />
                        </div>
                        <div>
                          <p className="text-xs font-semibold text-dark-800">{booking.status === "Completed" ? "Job Completed" : "Technician En Route / Working"}</p>
                          <p className="text-[10px] text-gray-400">Live GPS tracking active in backend.</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Portal>
  );
};

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
            { key: "status", label: "Status", options: ["Pending", "Assigned", "On The Way", "In Progress", "Completed", "Cancelled", "Delayed"] },
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
