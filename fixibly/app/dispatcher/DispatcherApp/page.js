// // "use client";
// // import React, { useState } from "react";
// // import {
// //   FiGrid, FiCalendar, FiZap, FiPlusCircle, FiUsers,
// //   FiActivity, FiBell, FiXCircle, FiMenu, FiX,
// // } from "react-icons/fi";
// // import DispatcherDashboard from "../DispatcherDashboard/page";
// // import ViewBookings from "../ViewBookings/page";
// // import EmergencyBookings from "../EmergencyBookings/page";
// // import ManualBooking from "../ManualBooking/page";
// // import TechnicianAvailability from "../TechnicianAvailability/page";
// // import CurrentStatus from "../CurrentStatus/page";
// // import CancelledBookings from "../CancelledBookings/page";
// // import DispatcherNotifications from "../DispatcherNotification/page";
// // import { useDispatcherStore as useAppStore } from "../DispatcherStore";

// // const navItems = [
// //   { key: "dashboard",     label: "Dashboard",         icon: FiGrid },
// //   { key: "bookings",      label: "View Bookings",     icon: FiCalendar },
// //   { key: "emergency",     label: "Emergency",         icon: FiZap },
// //   { key: "manual",        label: "Manual Booking",    icon: FiPlusCircle },
// //   { key: "availability",  label: "Technician Avail.", icon: FiUsers },
// //   { key: "status",        label: "Current Status",    icon: FiActivity },
// //   { key: "cancelled",     label: "Cancelled",         icon: FiXCircle },
// //   { key: "notifications", label: "Notifications",     icon: FiBell },
// // ];

// // const DispatcherApp = () => {
// //   const [activePage, setActivePage] = useState("dashboard");
// //   const [mobileOpen, setMobileOpen] = useState(false);
// //   const { dispNotifs, loading, fetchError } = useAppStore();
// //   const unreadCount = dispNotifs.filter(n => !n.read).length;

// //   const goBack = () => setActivePage("dashboard");

// //   const renderPage = () => {
// //     if (loading) return (
// //       <div className="flex items-center justify-center h-64">
// //         <div className="w-8 h-8 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
// //       </div>
// //     );
// //     if (fetchError) return (
// //       <div className="ff-card p-6 border-red-100 bg-red-50 text-center">
// //         <p className="text-red-600 font-semibold text-sm">Failed to load data</p>
// //         <p className="text-xs text-red-400 mt-1">{fetchError}</p>
// //         <button onClick={() => window.location.reload()} className="mt-3 ff-btn-primary text-xs">Retry</button>
// //       </div>
// //     );
// //     switch (activePage) {
// //       case "dashboard":     return <DispatcherDashboard onNavigate={setActivePage} />;
// //       case "bookings":      return <ViewBookings onBack={goBack} />;
// //       case "emergency":     return <EmergencyBookings onBack={goBack} />;
// //       case "manual":        return <ManualBooking onBack={goBack} />;
// //       case "availability":  return <TechnicianAvailability onBack={goBack} />;
// //       case "status":        return <CurrentStatus onBack={goBack} />;
// //       case "cancelled":     return <CancelledBookings onBack={goBack} />;
// //       case "notifications": return <DispatcherNotifications onBack={goBack} />;
// //       default:              return <DispatcherDashboard onNavigate={setActivePage} />;
// //     }
// //   };

// //   return (
// //     <div className="flex flex-col h-screen bg-background text-foreground">
// //       {/* ── Navbar ── */}
// //       <header className="bg-dark-900 text-white shrink-0 shadow-lg z-40">
// //         <div className="px-4 lg:px-6 flex items-center justify-between h-14">
// //           {/* Logo */}
// //           <div className="flex items-center gap-2.5 shrink-0">
// //             <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
// //               <FiZap className="w-4 h-4 text-white" />
// //             </div>
// //             <div className="hidden sm:block">
// //               <p className="text-white font-bold text-sm leading-tight">FieldFlow</p>
// //               <p className="text-gray-400 text-xs">Dispatcher</p>
// //             </div>
// //           </div>

// //           {/* Desktop Nav */}
// //           <nav className="hidden lg:flex items-center gap-1">
// //             {navItems.map(({ key, label, icon: Icon }) => {
// //               const active = activePage === key;
// //               return (
// //                 <button key={key} onClick={() => setActivePage(key)}
// //                   className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold transition-all duration-150 relative ${active ? "bg-primary text-white" : "text-gray-300 hover:bg-white/10 hover:text-white"}`}>
// //                   <Icon className="w-3.5 h-3.5 shrink-0" />
// //                   {label}
// //                   {key === "notifications" && unreadCount > 0 && (
// //                     <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-bold">{unreadCount}</span>
// //                   )}
// //                 </button>
// //               );
// //             })}
// //           </nav>

// //           {/* Right */}
// //           <div className="flex items-center gap-2">
// //             <button onClick={() => setActivePage("notifications")} className="relative p-2 rounded-lg hover:bg-white/10 text-gray-300 lg:hidden">
// //               <FiBell className="w-5 h-5" />
// //               {unreadCount > 0 && <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />}
// //             </button>
// //             <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-white text-xs font-bold">D</div>
// //             <button onClick={() => setMobileOpen(o => !o)} className="lg:hidden p-2 rounded-lg hover:bg-white/10 text-gray-300">
// //               {mobileOpen ? <FiX className="w-5 h-5" /> : <FiMenu className="w-5 h-5" />}
// //             </button>
// //           </div>
// //         </div>

// //         {/* Mobile dropdown */}
// //         {mobileOpen && (
// //           <div className="lg:hidden border-t border-white/10 px-4 py-3 grid grid-cols-2 gap-1">
// //             {navItems.map(({ key, label, icon: Icon }) => {
// //               const active = activePage === key;
// //               return (
// //                 <button key={key} onClick={() => { setActivePage(key); setMobileOpen(false); }}
// //                   className={`flex items-center gap-2 px-3 py-2.5 rounded-lg text-xs font-semibold transition-all ${active ? "bg-primary text-white" : "text-gray-300 hover:bg-white/10"}`}>
// //                   <Icon className="w-3.5 h-3.5 shrink-0" />
// //                   {label}
// //                   {key === "notifications" && unreadCount > 0 && (
// //                     <span className="ml-auto w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-bold">{unreadCount}</span>
// //                   )}
// //                 </button>
// //               );
// //             })}
// //           </div>
// //         )}
// //       </header>

// //       {/* ── Page content — scroll here, NOT on main, so fixed modals escape correctly ── */}
// //       <div className="flex-1 overflow-y-auto">
// //         <div className="p-4 lg:p-6">
// //           {renderPage()}
// //         </div>
// //       </div>
// //     </div>
// //   );
// // };

// // export default DispatcherApp;


// "use client";
// import React, { useState } from "react";
// import {
//   FiGrid, FiCalendar, FiZap, FiPlusCircle, FiUsers,
//   FiActivity, FiBell, FiXCircle, FiMenu, FiX,
// } from "react-icons/fi";
// import DispatcherDashboard from "../DispatcherDashboard/page";
// import ViewBookings from "../ViewBookings/page";
// import EmergencyBookings from "../EmergencyBookings/page";
// import ManualBooking from "../ManualBooking/page";
// import TechnicianAvailability from "../TechnicianAvailability/page";
// import CurrentStatus from "../CurrentStatus/page";
// import CancelledBookings from "../CancelledBookings/page";
// import DispatcherNotifications from "../DispatcherNotification/page";
// import { useDispatcherStore as useAppStore } from "../DispatcherStore";

// const navItems = [
//   { key: "dashboard",     label: "Dashboard",         icon: FiGrid },
//   { key: "bookings",      label: "View Bookings",     icon: FiCalendar },
//   { key: "emergency",     label: "Emergency",         icon: FiZap },
//   { key: "manual",        label: "Manual Booking",    icon: FiPlusCircle },
//   { key: "availability",  label: "Technician Avail.", icon: FiUsers },
//   { key: "status",        label: "Current Status",    icon: FiActivity },
//   { key: "cancelled",     label: "Cancelled",         icon: FiXCircle },
//   { key: "notifications", label: "Notifications",     icon: FiBell },
// ];

// const DispatcherApp = () => {
//   const [activePage, setActivePage] = useState("dashboard");
//   const [mobileOpen, setMobileOpen] = useState(false);
//   const { dispNotifs, loading, fetchError } = useAppStore();
//   const unreadCount = dispNotifs.filter(n => !n.read).length;

//   const goBack = () => setActivePage("dashboard");

//   const renderPage = () => {
//     if (loading) return (
//       <div className="flex items-center justify-center h-64">
//         <div className="w-8 h-8 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
//       </div>
//     );
//     if (fetchError) return (
//       <div className="ff-card p-6 border-red-100 bg-red-50 text-center">
//         <p className="text-red-600 font-semibold text-sm">Failed to load data</p>
//         <p className="text-xs text-red-400 mt-1">{fetchError}</p>
//         <button onClick={() => window.location.reload()} className="mt-3 ff-btn-primary text-xs">Retry</button>
//       </div>
//     );
//     switch (activePage) {
//       case "dashboard":     return <DispatcherDashboard onNavigate={setActivePage} />;
//       case "bookings":      return <ViewBookings onBack={goBack} />;
//       case "emergency":     return <EmergencyBookings onBack={goBack} />;
//       case "manual":        return <ManualBooking onBack={goBack} />;
//       case "availability":  return <TechnicianAvailability onBack={goBack} />;
//       case "status":        return <CurrentStatus onBack={goBack} />;
//       case "cancelled":     return <CancelledBookings onBack={goBack} />;
//       case "notifications": return <DispatcherNotifications onBack={goBack} />;
//       default:              return <DispatcherDashboard onNavigate={setActivePage} />;
//     }
//   };

//   return (
//     <div className="flex flex-col h-screen bg-background text-foreground">
//       {/* ── Navbar styled like the Customer Dashboard reference ── */}
//       <header className="bg-[#0b1329] text-white shrink-0 shadow-lg z-40">
//         <div className="px-4 lg:px-8 flex items-center justify-between h-20">
//           {/* Logo */}
//           <div className="flex items-center gap-2.5 shrink-0 cursor-pointer" onClick={() => setActivePage("dashboard")}>
//             <span className="text-xl lg:text-2xl font-extrabold tracking-wide text-white">
//               Field<span className="text-orange-500">Flow</span>
//             </span>
//           </div>

//           {/* Desktop Nav Links (Clean text layout matching customer dashboard style) */}
//           <nav className="hidden lg:flex items-center gap-6">
//             {navItems.map(({ key, label, icon: Icon }) => {
//               const active = activePage === key;
//               return (
//                 <button
//                   key={key}
//                   onClick={() => setActivePage(key)}
//                   className={`text-sm font-medium transition-colors duration-150 relative py-1 ${
//                     active ? "text-orange-500 font-semibold" : "text-gray-300 hover:text-white"
//                   }`}
//                 >
//                   {label}
//                   {key === "notifications" && unreadCount > 0 && (
//                     <span className="absolute -top-1 -right-2.5 w-4 h-4 bg-orange-500 text-white text-[10px] rounded-full flex items-center justify-center font-bold">
//                       {unreadCount}
//                     </span>
//                   )}
//                 </button>
//               );
//             })}
//           </nav>

//           {/* Right Profile & Mobile Menu Toggles */}
//           <div className="flex items-center gap-3">
//             <button
//               onClick={() => setActivePage("notifications")}
//               className="relative p-2 rounded-full hover:bg-white/10 text-gray-300 lg:hidden"
//             >
//               <FiBell className="w-5 h-5" />
//               {unreadCount > 0 && (
//                 <span className="absolute top-1 right-1 w-2 h-2 bg-orange-500 rounded-full" />
//               )}
//             </button>
            
//             <div className="w-9 h-9 rounded-full bg-orange-500 flex items-center justify-center text-white text-sm font-bold shadow-md">
//               D
//             </div>

//             <button
//               onClick={() => setMobileOpen(o => !o)}
//               className="lg:hidden p-2 rounded-lg hover:bg-white/10 text-gray-300 focus:outline-none"
//             >
//               {mobileOpen ? <FiX className="w-6 h-6" /> : <FiMenu className="w-6 h-6" />}
//             </button>
//           </div>
//         </div>

//         {/* Mobile dropdown menu */}
//         {mobileOpen && (
//           <div className="lg:hidden border-t border-white/10 px-4 py-3 grid grid-cols-2 gap-2 bg-[#0b1329]">
//             {navItems.map(({ key, label, icon: Icon }) => {
//               const active = activePage === key;
//               return (
//                 <button
//                   key={key}
//                   onClick={() => { setActivePage(key); setMobileOpen(false); }}
//                   className={`flex items-center gap-2 px-3 py-2.5 rounded-lg text-xs font-semibold transition-all ${
//                     active ? "bg-orange-500 text-white" : "text-gray-300 hover:bg-white/10"
//                   }`}
//                 >
//                   <Icon className="w-3.5 h-3.5 shrink-0" />
//                   {label}
//                   {key === "notifications" && unreadCount > 0 && (
//                     <span className="ml-auto w-4 h-4 bg-orange-500 text-white text-xs rounded-full flex items-center justify-center font-bold">
//                       {unreadCount}
//                     </span>
//                   )}
//                 </button>
//               );
//             })}
//           </div>
//         )}
//       </header>

//       {/* ── Page content ── */}
//       <div className="flex-1 overflow-y-auto">
//         <div className="p-4 lg:p-6">
//           {renderPage()}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default DispatcherApp;


"use client";
import React, { useState } from "react";
import {
  FiGrid, FiCalendar, FiZap, FiPlusCircle, FiUsers,
  FiActivity, FiBell, FiXCircle, FiMenu, FiX,
} from "react-icons/fi";
import DispatcherDashboard from "../DispatcherDashboard/page";
import ViewBookings from "../ViewBookings/page";
import EmergencyBookings from "../EmergencyBookings/page";
import ManualBooking from "../ManualBooking/page";
import TechnicianAvailability from "../TechnicianAvailability/page";
import CurrentStatus from "../CurrentStatus/page";
import CancelledBookings from "../CancelledBookings/page";
import DispatcherNotifications from "../DispatcherNotification/page";
import { useDispatcherStore as useAppStore } from "../DispatcherStore";
import ProfileCard from "../../components/ProfileCard";
const navItems = [
  { key: "dashboard",     label: "Dashboard",         icon: FiGrid },
  { key: "bookings",      label: "View Bookings",     icon: FiCalendar },
  { key: "emergency",     label: "Emergency",         icon: FiZap },
  { key: "manual",        label: "Manual Booking",    icon: FiPlusCircle },
  { key: "availability",  label: "Technician Avail.", icon: FiUsers },
  { key: "status",        label: "Current Status",    icon: FiActivity },
  { key: "cancelled",     label: "Cancelled",         icon: FiXCircle },
  { key: "notifications", label: "Notifications",     icon: FiBell },
];

const DispatcherApp = () => {
  const [activePage, setActivePage] = useState("dashboard");
  const [mobileOpen, setMobileOpen] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [dispatcherProfile, setDispatcherProfile] = useState(null);
  const { dispNotifs, loading, fetchError } = useAppStore();

  React.useEffect(() => {
    try {
      const stored = localStorage.getItem('user');
      if (stored) {
        const parsed = JSON.parse(stored);
        setDispatcherProfile(parsed);
      }
    } catch {}
  }, []);
  const unreadCount = dispNotifs.filter(n => !n.read).length;
  const goBack = () => setActivePage("dashboard");

  const renderPage = () => {
    if (loading) return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
      </div>
    );
    if (fetchError) return (
      <div className="ff-card p-6 border-red-100 bg-red-50 text-center">
        <p className="text-red-600 font-semibold text-sm">Failed to load data</p>
        <p className="text-xs text-red-400 mt-1">{fetchError}</p>
        <button onClick={() => window.location.reload()} className="mt-3 ff-btn-primary text-xs">Retry</button>
      </div>
    );
    switch (activePage) {
      case "dashboard":     return <DispatcherDashboard onNavigate={setActivePage} dispatcherName={dispatcherProfile?.full_name || ""} />;
      case "bookings":      return <ViewBookings onBack={goBack} />;
      case "emergency":     return <EmergencyBookings onBack={goBack} />;
      case "manual":        return <ManualBooking onBack={goBack} />;
      case "availability":  return <TechnicianAvailability onBack={goBack} />;
      case "status":        return <CurrentStatus onBack={goBack} />;
      case "cancelled":     return <CancelledBookings onBack={goBack} />;
      case "notifications": return <DispatcherNotifications onBack={goBack} />;
      default:              return <DispatcherDashboard onNavigate={setActivePage} dispatcherName={dispatcherProfile?.full_name || ""} />;
    }
  };

  return (
    <div className="flex flex-col h-screen bg-background text-foreground">
      {/* ── Navbar styled like the Customer Dashboard reference ── */}
      <header className="bg-[#0b1329] text-white shrink-0 shadow-lg z-40">
        <div className="px-4 lg:px-8 flex items-center justify-between h-20">
          {/* Logo */}
          <div className="flex items-center gap-2.5 shrink-0 cursor-pointer" onClick={() => setActivePage("dashboard")}>
            <span className="text-xl lg:text-2xl font-extrabold tracking-wide text-white">
              Field<span className="text-orange-500">Flow</span>
            </span>
          </div>

          {/* Desktop Nav Links (Clean text layout matching customer dashboard style) */}
          <nav className="hidden lg:flex items-center gap-6">
            {navItems.map(({ key, label, icon: Icon }) => {
              const active = activePage === key;
              return (
                <button
                  key={key}
                  onClick={() => setActivePage(key)}
                  className={`text-sm font-medium transition-colors duration-150 relative py-1 ${
                    active ? "text-orange-500 font-semibold" : "text-gray-300 hover:text-white"
                  }`}
                >
                  {label}
                  {key === "notifications" && unreadCount > 0 && (
                    <span className="absolute -top-1 -right-2.5 w-4 h-4 bg-orange-500 text-white text-[10px] rounded-full flex items-center justify-center font-bold">
                      {unreadCount}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Right Profile & Mobile Menu Toggles */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setActivePage("notifications")}
              className="relative p-2 rounded-full hover:bg-white/10 text-gray-300 lg:hidden"
            >
              <FiBell className="w-5 h-5" />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 w-2 h-2 bg-orange-500 rounded-full" />
              )}
            </button>
            
            {/* <div className="w-9 h-9 rounded-full bg-orange-500 flex items-center justify-center text-white text-sm font-bold shadow-md">
              D
            </div> */}

            <div className="relative">
  <button
    onClick={() => setShowProfile(!showProfile)}
    className="w-9 h-9 rounded-full bg-orange-500 flex items-center justify-center text-white text-sm font-bold shadow-md hover:scale-105 transition"
  >
    {(dispatcherProfile?.full_name || dispatcherProfile?.email || "D")[0].toUpperCase()}
  </button>

  {showProfile && (
    <ProfileCard
      floating
      user={{
        name: dispatcherProfile?.full_name || dispatcherProfile?.email?.split('@')[0] || "Dispatcher",
        role: "Dispatcher",
        id: dispatcherProfile?.user_id || "—",
        email: dispatcherProfile?.email || "—",
        phone: dispatcherProfile?.phone || "—",
        address: dispatcherProfile?.address || "—"
      }}
      onLogout={() => { window.location.href = "/authentication/login"; }}
    />
  )}
</div>

            <button
              onClick={() => setMobileOpen(o => !o)}
              className="lg:hidden p-2 rounded-lg hover:bg-white/10 text-gray-300 focus:outline-none"
            >
              {mobileOpen ? <FiX className="w-6 h-6" /> : <FiMenu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile dropdown menu */}
        {mobileOpen && (
          <div className="lg:hidden border-t border-white/10 px-4 py-3 grid grid-cols-2 gap-2 bg-[#0b1329]">
            {navItems.map(({ key, label, icon: Icon }) => {
              const active = activePage === key;
              return (
                <button
                  key={key}
                  onClick={() => { setActivePage(key); setMobileOpen(false); }}
                  className={`flex items-center gap-2 px-3 py-2.5 rounded-lg text-xs font-semibold transition-all ${
                    active ? "bg-orange-500 text-white" : "text-gray-300 hover:bg-white/10"
                  }`}
                >
                  <Icon className="w-3.5 h-3.5 shrink-0" />
                  {label}
                  {key === "notifications" && unreadCount > 0 && (
                    <span className="ml-auto w-4 h-4 bg-orange-500 text-white text-xs rounded-full flex items-center justify-center font-bold">
                      {unreadCount}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        )}
      </header>

      {/* ── Page content ── */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-4 lg:p-6">
          {renderPage()}
        </div>
      </div>
    </div>
  );
};

export default DispatcherApp;