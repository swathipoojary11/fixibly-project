// "use client";
// import React from "react";
// import {
//   FiCalendar, FiZap, FiPlusCircle, FiUsers, FiActivity,
//   FiBell, FiClock, FiCheckCircle, FiXCircle,
// } from "react-icons/fi";
// import { useDispatcherStore as useAppStore } from "../DispatcherStore";

// const actionCards = [
//   { key: "bookings",     label: "View Bookings",      icon: FiCalendar,   desc: "Monitor all incoming bookings",   color: "from-orange-500 to-orange-600" },
//   { key: "emergency",    label: "Emergency Bookings", icon: FiZap,        desc: "Handle critical emergency jobs",  color: "from-red-500 to-red-600" },
//   { key: "manual",       label: "Manual Booking",     icon: FiPlusCircle, desc: "Create booking for walk-in/call", color: "from-blue-500 to-blue-600" },
//   { key: "availability", label: "Technician Avail.",  icon: FiUsers,      desc: "Check who's free right now",      color: "from-green-500 to-green-600" },
//   { key: "status",       label: "Current Status",     icon: FiActivity,   desc: "Track live job progress",         color: "from-purple-500 to-purple-600" },
//   { key: "notifications",label: "Notifications",      icon: FiBell,       desc: "Operational alerts & updates",    color: "from-gray-700 to-gray-900" },
// ];

// const colorMap = {
//   yellow: { bg: "bg-yellow-50", text: "text-yellow-600", border: "border-yellow-100" },
//   green:  { bg: "bg-green-50",  text: "text-green-600",  border: "border-green-100" },
//   orange: { bg: "bg-orange-50", text: "text-primary",    border: "border-orange-100" },
//   red:    { bg: "bg-red-50",    text: "text-red-500",    border: "border-red-100" },
//   purple: { bg: "bg-purple-50", text: "text-purple-600", border: "border-purple-100" },
// };

// const DispatcherDashboard = ({ onNavigate }) => {
//   const { getLiveStats } = useAppStore();
//   const { dispatcher: stats } = getLiveStats();

//   const kpis = [
//     { icon: FiClock,       label: "Pending Bookings",      value: stats.pendingBookings,      color: "yellow", nav: "bookings" },
//     { icon: FiCheckCircle, label: "Available Technicians", value: stats.availableTechnicians, color: "green",  nav: "availability" },
//     { icon: FiUsers,       label: "Busy Technicians",      value: stats.busyTechnicians,      color: "orange", nav: "availability" },
//     { icon: FiZap,         label: "Active Emergencies",    value: stats.emergencyJobs,        color: "red",    nav: "emergency" },
//     { icon: FiXCircle,     label: "Cancelled Today",       value: stats.cancelledToday,       color: "purple", nav: "cancelled" },
//   ];

//   return (
//     <div className="space-y-6 animate-fadeIn">
//       {/* Action Cards */}
//       <div>
//         <p className="ff-section-title mb-4">Quick Actions</p>
//         <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
//           {actionCards.map(({ key, label, icon: Icon, desc, color }) => (
//             <button key={key} onClick={() => onNavigate(key)}
//               className="ff-card p-5 text-left group hover:border-orange-200 hover:-translate-y-0.5 transition-all duration-200 cursor-pointer">
//               <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-200`}>
//                 <Icon className="w-6 h-6 text-white" />
//               </div>
//               <p className="font-bold text-dark-900 text-sm mb-1">{label}</p>
//               <p className="text-xs text-gray-400 leading-relaxed">{desc}</p>
//             </button>
//           ))}
//         </div>
//       </div>

//       {/* KPI Stats — each navigates to relevant page */}
//       <div>
//         <p className="ff-section-title mb-4">Live Statistics</p>
//         <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
//           {kpis.map(({ icon: Icon, label, value, color, nav }) => {
//             const c = colorMap[color];
//             return (
//               <button key={label} onClick={() => onNavigate(nav)}
//                 className={`ff-card p-4 border ${c.border} group text-left cursor-pointer hover:-translate-y-0.5 transition-all duration-200`}>
//                 <div className={`w-10 h-10 ${c.bg} rounded-xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-200`}>
//                   <Icon className={`w-5 h-5 ${c.text}`} />
//                 </div>
//                 <p className={`text-3xl font-bold ${c.text}`}>{value}</p>
//                 <p className="text-xs text-gray-500 mt-1">{label}</p>
//               </button>
//             );
//           })}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default DispatcherDashboard;


"use client";
import React from "react";
import {
  FiCalendar, FiUsers, FiBell, FiClock, FiCheckCircle, FiXCircle, FiZap,
} from "react-icons/fi";
import { useDispatcherStore as useAppStore } from "../DispatcherStore";

const actionCards = [
  {
    key: "bookings",
    label: "Bookings",
    icon: FiCalendar,
    desc: "View, assign and manage bookings",
    color: "from-orange-500 to-orange-600",
  },
  {
    key: "availability",
    label: "Technicians",
    icon: FiUsers,
    desc: "Manage technician availability",
    color: "from-green-500 to-green-600",
  },
  {
    key: "notifications",
    label: "Notifications",
    icon: FiBell,
    desc: "View alerts and updates",
    color: "from-slate-700 to-slate-900",
  },
];

const colorMap = {
  yellow: { bg: "bg-yellow-50", text: "text-yellow-600", border: "border-yellow-100" },
  green:  { bg: "bg-green-50",  text: "text-green-600",  border: "border-green-100" },
  orange: { bg: "bg-orange-50", text: "text-primary",    border: "border-orange-100" },
  red:    { bg: "bg-red-50",    text: "text-red-500",    border: "border-red-100" },
  purple: { bg: "bg-purple-50", text: "text-purple-600", border: "border-purple-100" },
};

const DispatcherDashboard = ({ onNavigate = () => {} }) => {
  const { getLiveStats } = useAppStore();
  const { dispatcher: stats } = getLiveStats();

  const kpis = [
    { icon: FiClock,       label: "Pending Bookings",      value: stats.pendingBookings,       color: "yellow", nav: "bookings" },
    { icon: FiCheckCircle, label: "Available Technicians", value: stats.availableTechnicians, color: "green",  nav: "availability" },
    { icon: FiUsers,       label: "Busy Technicians",      value: stats.busyTechnicians,       color: "orange", nav: "availability" },
    { icon: FiZap,         label: "Active Emergencies",    value: stats.emergencyJobs,         color: "red",    nav: "emergency" },
    { icon: FiXCircle,     label: "Cancelled Today",       value: stats.cancelledToday,        color: "purple", nav: "cancelled" },
  ];

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Hero Welcome Section */}
      <div className="rounded-2xl bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 text-white p-8">
        <h1 className="text-3xl font-bold">
          Welcome Back, Dispatcher 👋
        </h1>
        <p className="mt-2 text-gray-300 max-w-2xl">
          Manage bookings, assign technicians, monitor emergencies and coordinate
          field operations from one central dashboard.
        </p>
      </div>

      {/* Action Cards */}
      <div>
        <p className="ff-section-title mb-4">Quick Actions</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {actionCards.map(({ key, label, icon: Icon, desc, color }) => (
            <button key={key} onClick={() => onNavigate(key)}
              className="ff-card p-6 text-left group hover:border-orange-200 hover:-translate-y-1 hover:shadow-xl transition-all duration-200 cursor-pointer">
              <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-200`}>
                <Icon className="w-7 h-7 text-white" />
              </div>
              <p className="font-bold text-dark-900 text-base mb-1">{label}</p>
              <p className="text-xs text-gray-400 leading-relaxed">{desc}</p>
            </button>
          ))}
        </div>
      </div>

      {/* KPI Stats — each navigates to relevant page */}
      <div>
        <p className="ff-section-title mb-4">Today's Operations</p>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
          {kpis.map(({ icon: Icon, label, value, color, nav }) => {
            const c = colorMap[color];
            return (
              <button key={label} onClick={() => onNavigate(nav)}
                className={`ff-card p-4 border ${c.border} group text-left cursor-pointer hover:-translate-y-1 hover:shadow-xl transition-all duration-200`}>
                <div className={`w-10 h-10 ${c.bg} rounded-xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-200`}>
                  <Icon className={`w-5 h-5 ${c.text}`} />
                </div>
                <p className={`text-3xl font-bold ${c.text}`}>{value}</p>
                <p className="text-xs text-gray-500 mt-1">{label}</p>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default DispatcherDashboard;