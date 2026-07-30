// "use client";

// import { useState } from "react";

// import {
//   User,
//   Phone,
//   Mail,
//   MapPin,
//   CalendarDays,
//   Clock,
//   AlertTriangle,
//   Check,
//   ChevronDown,
// } from "lucide-react";

// export default function BookingForm() {

//   const [emergency, setEmergency] = useState(false);

//   const [selectedProblem, setSelectedProblem] = useState("");

//   const [scheduleType, setScheduleType] = useState("anytime");


//   const problems = [
//     {
//       name: "Water Leakage",
//       price: 30,
//     },
//     {
//       name: "Blocked / Clogged Drain",
//       price: 35,
//     },
//     {
//       name: "Broken Pipe",
//       price: 45,
//     },
//     {
//       name: "Water Heater Problem",
//       price: 50,
//     },
//   ];


//   const selectedService =
//     "Plumbing Services";


//   const selectedPrice =
//     problems.find(
//       (problem) => problem.name === selectedProblem
//     )?.price || null;


//   return (

//     <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">

//       {/* ================= HEADER ================= */}

//       <div className="px-7 md:px-10 pt-9 pb-7 border-b">

//         <div className="flex items-start justify-between gap-6">

//           <div>

//             <p className="text-orange-500 text-sm uppercase tracking-[3px] font-semibold">
//               New Booking
//             </p>

//             <h2 className="text-3xl font-bold text-gray-900 mt-2">
//               Book a Service
//             </h2>

//             <p className="text-gray-500 mt-2">
//               Complete the details below to schedule your service.
//             </p>

//           </div>

//           <div className="hidden sm:flex bg-orange-50 text-orange-500 px-4 py-2 rounded-full text-sm font-semibold">
//             {selectedService}
//           </div>

//         </div>

//       </div>


//       {/* ================= FORM CONTENT ================= */}

//       <div className="p-7 md:p-10">


//         {/* CUSTOMER DETAILS */}

//         <div>

//           <div className="flex items-center gap-3 mb-6">

//             <div className="w-9 h-9 rounded-full bg-orange-500 text-white flex items-center justify-center font-bold">
//               01
//             </div>

//             <h3 className="text-xl font-bold">
//               Your Details
//             </h3>

//           </div>


//           <div className="bg-gray-50 rounded-2xl p-5">

//             <div className="grid md:grid-cols-2 gap-5">

//               <div>

//                 <label className="text-sm font-semibold text-gray-700">
//                   Full Name
//                 </label>

//                 <div className="relative mt-2">

//                   <User
//                     size={18}
//                     className="absolute left-4 top-4 text-gray-400"
//                   />

//                   <input
//                     type="text"
//                     value="Customer Name"
//                     readOnly
//                     className="w-full bg-white border border-gray-200 rounded-xl py-3.5 pl-11 pr-4 outline-none"
//                   />

//                 </div>

//               </div>


//               <div>

//                 <label className="text-sm font-semibold text-gray-700">
//                   Phone Number
//                 </label>

//                 <div className="relative mt-2">

//                   <Phone
//                     size={18}
//                     className="absolute left-4 top-4 text-gray-400"
//                   />

//                   <input
//                     type="tel"
//                     value="+91 98765 43210"
//                     readOnly
//                     className="w-full bg-white border border-gray-200 rounded-xl py-3.5 pl-11 pr-4 outline-none"
//                   />

//                 </div>

//               </div>


//               <div className="md:col-span-2">

//                 <label className="text-sm font-semibold text-gray-700">
//                   Email Address
//                 </label>

//                 <div className="relative mt-2">

//                   <Mail
//                     size={18}
//                     className="absolute left-4 top-4 text-gray-400"
//                   />

//                   <input
//                     type="email"
//                     value="customer@email.com"
//                     readOnly
//                     className="w-full bg-white border border-gray-200 rounded-xl py-3.5 pl-11 pr-4 outline-none"
//                   />

//                 </div>

//               </div>

//             </div>


//             <p className="text-xs text-gray-500 mt-4">
//               Your details are taken from your registered account.
//             </p>

//           </div>

//         </div>


//         <div className="border-t my-9"></div>


//         {/* SERVICE + PROBLEM */}

//         <div>

//           <div className="flex items-center gap-3 mb-6">

//             <div className="w-9 h-9 rounded-full bg-orange-500 text-white flex items-center justify-center font-bold">
//               02
//             </div>

//             <div>

//               <h3 className="text-xl font-bold">
//                 Service Details
//               </h3>

//               <p className="text-gray-500 text-sm mt-1">
//                 Select the problem you're experiencing.
//               </p>

//             </div>

//           </div>


//           {/* SELECTED CATEGORY */}

//           <div className="flex items-center justify-between border border-orange-200 bg-orange-50 rounded-2xl p-5 mb-6">

//             <div>

//               <p className="text-xs uppercase tracking-wider text-orange-500 font-semibold">
//                 Selected Service
//               </p>

//               <h4 className="text-lg font-bold mt-1">
//                 {selectedService}
//               </h4>

//             </div>

//             <div className="bg-orange-500 text-white px-4 py-2 rounded-xl text-sm font-semibold">
//               Selected
//             </div>

//           </div>


//           {/* PROBLEMS */}

//           <label className="font-semibold text-gray-800">
//             What is the problem?
//           </label>


//           <div className="grid md:grid-cols-2 gap-3 mt-4">

//             {problems.map((problem) => {

//               const selected =
//                 selectedProblem === problem.name;

//               return (

//                 <button
//                   type="button"
//                   key={problem.name}
//                   onClick={() =>
//                     setSelectedProblem(problem.name)
//                   }
//                   className={`flex items-center justify-between text-left p-4 rounded-xl border transition ${
//                     selected
//                       ? "border-orange-500 bg-orange-50"
//                       : "border-gray-200 hover:border-orange-300"
//                   }`}
//                 >

//                   <div className="flex items-center gap-3">

//                     <div
//                       className={`w-5 h-5 rounded-md border flex items-center justify-center ${
//                         selected
//                           ? "bg-orange-500 border-orange-500 text-white"
//                           : "border-gray-300"
//                       }`}
//                     >

//                       {selected && (
//                         <Check size={14} />
//                       )}

//                     </div>

//                     <span className="font-medium">
//                       {problem.name}
//                     </span>

//                   </div>


//                   <span className="font-semibold text-gray-700">
//                     ${problem.price}
//                   </span>

//                 </button>

//               );

//             })}

//           </div>


//           {/* OTHER */}

//           <div className="mt-6">

//             <label className="text-sm font-semibold text-gray-700">
//               Can't find your problem?
//             </label>

//             <textarea
//               rows={3}
//               placeholder="Describe the problem..."
//               className="w-full border border-gray-200 rounded-xl p-4 mt-2 resize-none outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
//             />

//           </div>


//           {/* PRICE */}

//           <div className="mt-6 flex items-center justify-between bg-gray-900 text-white rounded-2xl px-6 py-5">

//             <div>

//               <p className="text-gray-400 text-sm">
//                 Estimated Service Price
//               </p>

//               <p className="text-xs text-gray-500 mt-1">
//                 Based on selected problem
//               </p>

//             </div>

//             <p className="text-2xl font-bold text-orange-500">

//               {selectedPrice
//                 ? `$${selectedPrice}`
//                 : "Select problem"}

//             </p>

//           </div>


//           <p className="text-xs text-gray-500 mt-3">
//             If you select "Other", the final price may vary after technician
//             inspection.
//           </p>

//         </div>


//         <div className="border-t my-9"></div>


//         {/* EMERGENCY */}

//         <div>

//           <div className="flex items-center justify-between gap-5">

//             <div className="flex items-center gap-4">

//               <div
//                 className={`w-11 h-11 rounded-xl flex items-center justify-center ${
//                   emergency
//                     ? "bg-orange-500 text-white"
//                     : "bg-orange-50 text-orange-500"
//                 }`}
//               >
//                 <AlertTriangle size={21} />
//               </div>

//               <div>

//                 <h3 className="font-bold text-lg">
//                   Emergency Service
//                 </h3>

//                 <p className="text-gray-500 text-sm">
//                   Need priority technician assistance?
//                 </p>

//               </div>

//             </div>


//             <button
//               type="button"
//               onClick={() =>
//                 setEmergency(!emergency)
//               }
//               className={`w-14 h-8 rounded-full transition ${
//                 emergency
//                   ? "bg-orange-500"
//                   : "bg-gray-300"
//               }`}
//             >

//               <span
//                 className={`block w-6 h-6 bg-white rounded-full shadow transition-transform ${
//                   emergency
//                     ? "translate-x-7"
//                     : "translate-x-1"
//                 }`}
//               />

//             </button>

//           </div>


//           {emergency && (

//             <div className="mt-5 bg-orange-50 border border-orange-200 rounded-2xl p-5">

//               <label className="text-sm font-semibold">
//                 Why is this an emergency?
//               </label>

//               <textarea
//                 rows={3}
//                 placeholder="Briefly explain why you need urgent assistance..."
//                 className="w-full bg-white border border-orange-200 rounded-xl p-4 mt-2 resize-none outline-none focus:border-orange-500"
//               />

//               <div className="mt-4 flex justify-between items-center">

//                 <span className="text-gray-600 text-sm">
//                   Advance payment required
//                 </span>

//                 <span className="font-bold text-orange-500">
//                   $20
//                 </span>

//               </div>

//             </div>

//           )}

//         </div>


//         <div className="border-t my-9"></div>


//         {/* ADDRESS */}

//         <div>

//           <div className="flex items-center gap-3 mb-6">

//             <div className="w-9 h-9 rounded-full bg-orange-500 text-white flex items-center justify-center font-bold">
//               03
//             </div>

//             <h3 className="text-xl font-bold">
//               Service Address
//             </h3>

//           </div>


//           <div className="relative">

//             <MapPin
//               size={19}
//               className="absolute left-4 top-4 text-orange-500"
//             />

//             <textarea
//               rows={3}
//               placeholder="House / Apartment / Street / Area"
//               className="w-full border border-gray-200 rounded-xl p-4 pl-11 resize-none outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
//             />

//           </div>


//           <div className="grid md:grid-cols-3 gap-4 mt-4">

//             <input
//               type="text"
//               placeholder="City"
//               className="border border-gray-200 rounded-xl p-3.5 outline-none focus:border-orange-500"
//             />

//             <input
//               type="text"
//               placeholder="State"
//               className="border border-gray-200 rounded-xl p-3.5 outline-none focus:border-orange-500"
//             />

//             <input
//               type="text"
//               placeholder="Pincode"
//               className="border border-gray-200 rounded-xl p-3.5 outline-none focus:border-orange-500"
//             />

//           </div>

//         </div>


//         <div className="border-t my-9"></div>


//         {/* SCHEDULE */}

//         <div>

//           <div className="flex items-center gap-3 mb-6">

//             <div className="w-9 h-9 rounded-full bg-orange-500 text-white flex items-center justify-center font-bold">
//               04
//             </div>

//             <div>

//               <h3 className="text-xl font-bold">
//                 Schedule Service
//               </h3>

//               <p className="text-gray-500 text-sm mt-1">
//                 Tell us when you'd like the technician to visit.
//               </p>

//             </div>

//           </div>


//           <div className="grid md:grid-cols-2 gap-4">

//             <button
//               type="button"
//               onClick={() =>
//                 setScheduleType("anytime")
//               }
//               className={`p-5 rounded-2xl border text-left ${
//                 scheduleType === "anytime"
//                   ? "border-orange-500 bg-orange-50"
//                   : "border-gray-200"
//               }`}
//             >

//               <div className="flex items-center gap-3">

//                 <Clock
//                   className="text-orange-500"
//                   size={22}
//                 />

//                 <div>

//                   <p className="font-semibold">
//                     Anytime
//                   </p>

//                   <p className="text-sm text-gray-500 mt-1">
//                     Send a technician when available
//                   </p>

//                 </div>

//               </div>

//             </button>


//             <button
//               type="button"
//               onClick={() =>
//                 setScheduleType("specific")
//               }
//               className={`p-5 rounded-2xl border text-left ${
//                 scheduleType === "specific"
//                   ? "border-orange-500 bg-orange-50"
//                   : "border-gray-200"
//               }`}
//             >

//               <div className="flex items-center gap-3">

//                 <CalendarDays
//                   className="text-orange-500"
//                   size={22}
//                 />

//                 <div>

//                   <p className="font-semibold">
//                     Choose Date & Time
//                   </p>

//                   <p className="text-sm text-gray-500 mt-1">
//                     Select your preferred slot
//                   </p>

//                 </div>

//               </div>

//             </button>

//           </div>


//           {scheduleType === "specific" && (

//             <div className="grid md:grid-cols-2 gap-4 mt-4">

//               <input
//                 type="date"
//                 className="border border-gray-200 rounded-xl p-4 outline-none focus:border-orange-500"
//               />

//               <input
//                 type="time"
//                 className="border border-gray-200 rounded-xl p-4 outline-none focus:border-orange-500"
//               />

//             </div>

//           )}

//         </div>


//         {/* CONTINUE */}

//         <div className="mt-10 pt-7 border-t">

//           <button
//             type="button"
//             className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-4 rounded-xl transition shadow-lg shadow-orange-500/20"
//           >

//             Continue to Review Booking →

//           </button>

//           <p className="text-center text-xs text-gray-500 mt-4">
//             Your booking will be reviewed before final confirmation.
//           </p>

//         </div>

//       </div>

//     </div>
//   );
// }

// 'use client';

// import { useState, useEffect } from "react";
// import { User, Phone, Mail, Wrench, MapPin, CalendarDays, AlertTriangle, ShieldCheck, ArrowRight, PhoneCall } from "lucide-react";

// export default function SingleBookingForm({ searchParams }) {
//   // 1. Centralized Form State
//   const [formData, setFormData] = useState({
//     customerName: "Swathi",
//     phone: "+91 98765 43210",
//     email: "swathi@example.com",
//     category: "Plumbing",
//     selectedProblems: [],
//     customProblem: "",
//     address: "",
//     scheduleType: "anytime", // 'anytime' | 'scheduled'
//     date: "",
//     time: "",
//     isEmergency: false,
//     emergencyReason: "",
//   });

//   // Pre-select category if passed via URL (e.g., /book?service=Electrical)
//   useEffect(() => {
//     if (searchParams?.service) {
//       setFormData((prev) => ({ ...prev, category: searchParams.service }));
//     }
//   }, [searchParams]);

//   // Preset problem options with fixed rates
//   const categoryProblems = {
//     Plumbing: [
//       { id: "p1", title: "Tap Leakage Fix", price: 199 },
//       { id: "p2", title: "Drainage Clearance", price: 299 },
//       { id: "p3", title: "Water Tank Outlet Fitting", price: 499 },
//     ],
//     Electrical: [
//       { id: "e1", title: "Switch Board Repair", price: 149 },
//       { id: "e2", title: "Fan / Light Installation", price: 199 },
//       { id: "e3", title: "MCB Tripping Fix", price: 349 },
//     ],
//     Cleaning: [
//       { id: "c1", title: "Bathroom Deep Wash", price: 399 },
//       { id: "c2", title: "Kitchen Sanitization", price: 599 },
//     ],
//     Painting: [
//       { id: "pt1", title: "Single Room Touch-up", price: 899 },
//       { id: "pt2", title: "Wall Leakage Coating", price: 1199 },
//     ],
//   };

//   const activeProblems = categoryProblems[formData.category] || categoryProblems.Plumbing;

//   // Toggle problem selection
//   const handleProblemToggle = (problem) => {
//     setFormData((prev) => {
//       const exists = prev.selectedProblems.some((p) => p.id === problem.id);
//       const updated = exists
//         ? prev.selectedProblems.filter((p) => p.id !== problem.id)
//         : [...prev.selectedProblems, problem];
//       return { ...prev, selectedProblems: updated };
//     });
//   };

//   // Price Calculation Logic
//   const basePrice = formData.selectedProblems.reduce((sum, p) => sum + p.price, 0);
//   const platformFee = 29;
//   const emergencyFee = formData.isEmergency ? 150 : 0;
//   const totalAmount = basePrice + platformFee + emergencyFee;

//   return (
//     <div className="max-w-4xl mx-auto bg-white border border-gray-200 rounded-2xl shadow-md p-6 sm:p-8 space-y-6 text-[#0F172A]">
      
//       {/* Top Banner: Standard Title + Assisted Emergency Call */}
//       <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-gray-100 pb-5 gap-4">
//         <div>
//           <h1 className="text-2xl font-black text-[#0F172A]">Book a Service</h1>
//           <p className="text-xs text-gray-500">Complete your service request or call direct dispatch.</p>
//         </div>
//         <a
//           href="tel:+919876543210"
//           className="inline-flex items-center gap-2 bg-[#0F172A] hover:bg-[#FF5500] text-white text-xs font-bold px-4 py-2.5 rounded-xl transition self-start sm:self-auto"
//         >
//           <PhoneCall size={15} className="text-[#FF5500]" />
//           <span>Elderly / Quick Call: +91 98765 43210</span>
//         </a>
//       </div>

//       {/* Row 1: Account Info (Read-Only Badges) */}
//       <div>
//         <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block mb-2">
//           Customer Account
//         </label>
//         <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-gray-50 border border-gray-200 p-3 rounded-xl text-xs font-medium">
//           <div className="flex items-center gap-2">
//             <User size={15} className="text-[#FF5500]" />
//             <span className="truncate">{formData.customerName}</span>
//           </div>
//           <div className="flex items-center gap-2">
//             <Phone size={15} className="text-[#FF5500]" />
//             <span>{formData.phone}</span>
//           </div>
//           <div className="flex items-center gap-2">
//             <Mail size={15} className="text-[#FF5500]" />
//             <span className="truncate">{formData.email}</span>
//           </div>
//         </div>
//       </div>

//       {/* Row 2: Category Selector */}
//       <div>
//         <label className="text-xs font-bold text-gray-700 block mb-1.5">Selected Category</label>
//         <select
//           value={formData.category}
//           onChange={(e) =>
//             setFormData({ ...formData, category: e.target.value, selectedProblems: [] })
//           }
//           className="w-full border border-gray-300 rounded-xl p-3 text-xs font-bold text-[#FF5500] bg-orange-50/30 outline-none focus:border-[#FF5500]"
//         >
//           <option value="Plumbing">Plumbing Services</option>
//           <option value="Electrical">Electrical Work</option>
//           <option value="Cleaning">Home Cleaning</option>
//           <option value="Painting">Wall Painting</option>
//         </select>
//       </div>

//       {/* Row 3: Preset Problem Checklist */}
//       <div>
//         <label className="text-xs font-bold text-gray-700 block mb-2">
//           Common Issues (Check to add to estimate)
//         </label>
//         <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
//           {activeProblems.map((prob) => {
//             const isChecked = formData.selectedProblems.some((p) => p.id === prob.id);
//             return (
//               <label
//                 key={prob.id}
//                 onClick={() => handleProblemToggle(prob)}
//                 className={`flex items-center justify-between p-3 rounded-xl border text-xs cursor-pointer transition ${
//                   isChecked
//                     ? "border-[#FF5500] bg-orange-50/50 font-semibold text-[#0F172A]"
//                     : "border-gray-200 hover:border-gray-300 text-gray-600"
//                 }`}
//               >
//                 <div className="flex items-center gap-2">
//                   <input type="checkbox" checked={isChecked} readOnly className="accent-[#FF5500]" />
//                   <span>{prob.title}</span>
//                 </div>
//                 <span className="font-bold text-[#FF5500]">₹{prob.price}</span>
//               </label>
//             );
//           })}
//         </div>
//       </div>

//       {/* Row 4: Custom Description Box */}
//       <div>
//         <label className="text-xs font-bold text-gray-700 block mb-1">
//           Custom Problem / Specific Details
//         </label>
//         <textarea
//           rows={2}
//           placeholder="Describe your issue if not listed above..."
//           value={formData.customProblem}
//           onChange={(e) => setFormData({ ...formData, customProblem: e.target.value })}
//           className="w-full border border-gray-300 rounded-xl p-3 text-xs outline-none focus:border-[#FF5500]"
//         />
//         {formData.customProblem && (
//           <p className="text-[11px] text-amber-600 font-medium mt-1">
//             * Custom problems may require on-site assessment by technician before final quote.
//           </p>
//         )}
//       </div>

//       {/* Row 5: Emergency Dispatch Switch & Reason */}
//       <div className={`p-4 rounded-xl border transition ${formData.isEmergency ? "bg-orange-50 border-[#FF5500]" : "bg-gray-50 border-gray-200"}`}>
//         <div className="flex items-center justify-between">
//           <div className="flex items-center gap-2">
//             <AlertTriangle size={18} className={formData.isEmergency ? "text-[#FF5500]" : "text-gray-400"} />
//             <div>
//               <span className="text-xs font-bold block">Need Emergency Priority Dispatch?</span>
//               <span className="text-[11px] text-gray-500">Technician arrives within 60–90 minutes.</span>
//             </div>
//           </div>
//           <button
//             type="button"
//             onClick={() => setFormData({ ...formData, isEmergency: !formData.isEmergency })}
//             className={`w-11 h-6 rounded-full transition p-0.5 ${formData.isEmergency ? "bg-[#FF5500]" : "bg-gray-300"}`}
//           >
//             <div className={`w-5 h-5 bg-white rounded-full transition transform ${formData.isEmergency ? "translate-x-5" : "translate-x-0"}`} />
//           </button>
//         </div>

//         {formData.isEmergency && (
//           <div className="mt-3 pt-3 border-t border-orange-200 space-y-2">
//             <label className="text-xs font-bold text-[#0F172A]">Reason for Emergency (Required)</label>
//             <input
//               type="text"
//               placeholder="e.g. Major pipe burst, short circuit risk"
//               value={formData.emergencyReason}
//               onChange={(e) => setFormData({ ...formData, emergencyReason: e.target.value })}
//               className="w-full border border-orange-300 bg-white rounded-lg p-2 text-xs outline-none"
//             />
//             <p className="text-[11px] text-[#FF5500] font-semibold">
//               ⚡ Priority dispatch fee (+₹150) will be added to total summary.
//             </p>
//           </div>
//         )}
//       </div>

//       {/* Row 6: Address & Schedule Settings */}
//       <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//         <div>
//           <label className="text-xs font-bold text-gray-700 block mb-1">Service Address</label>
//           <textarea
//             rows={3}
//             placeholder="Enter house no, street, landmark..."
//             value={formData.address}
//             onChange={(e) => setFormData({ ...formData, address: e.target.value })}
//             className="w-full border border-gray-300 rounded-xl p-3 text-xs outline-none focus:border-[#FF5500]"
//           />
//         </div>

//         <div>
//           <label className="text-xs font-bold text-gray-700 block mb-1">Time Slot Preference</label>
//           <div className="flex gap-2 mb-2">
//             <button
//               type="button"
//               onClick={() => setFormData({ ...formData, scheduleType: "anytime" })}
//               className={`flex-1 py-2 px-3 rounded-xl border text-xs font-bold transition ${
//                 formData.scheduleType === "anytime"
//                   ? "bg-orange-50 border-[#FF5500] text-[#FF5500]"
//                   : "border-gray-200 text-gray-600 hover:bg-gray-50"
//               }`}
//             >
//               🚀 Send Anytime
//             </button>
//             <button
//               type="button"
//               onClick={() => setFormData({ ...formData, scheduleType: "scheduled" })}
//               className={`flex-1 py-2 px-3 rounded-xl border text-xs font-bold transition ${
//                 formData.scheduleType === "scheduled"
//                   ? "bg-orange-50 border-[#FF5500] text-[#FF5500]"
//                   : "border-gray-200 text-gray-600 hover:bg-gray-50"
//               }`}
//             >
//               📅 Specific Slot
//             </button>
//           </div>

//           {formData.scheduleType === "scheduled" && (
//             <div className="grid grid-cols-2 gap-2">
//               <input
//                 type="date"
//                 value={formData.date}
//                 onChange={(e) => setFormData({ ...formData, date: e.target.value })}
//                 className="border border-gray-300 rounded-lg p-2 text-xs outline-none"
//               />
//               <input
//                 type="time"
//                 value={formData.time}
//                 onChange={(e) => setFormData({ ...formData, time: e.target.value })}
//                 className="border border-gray-300 rounded-lg p-2 text-xs outline-none"
//               />
//             </div>
//           )}
//         </div>
//       </div>

//       {/* Row 7: Integrated Live Booking Summary Box */}
//       <div className="bg-[#0F172A] text-white rounded-xl p-5 space-y-3">
//         <div className="flex justify-between items-center border-b border-gray-800 pb-2">
//           <span className="text-xs font-bold uppercase tracking-wider text-gray-400">Live Booking Summary</span>
//           <span className="text-xs bg-[#FF5500] text-white px-2 py-0.5 rounded font-bold">{formData.category}</span>
//         </div>

//         <div className="text-xs space-y-1.5 text-gray-300">
//           <div className="flex justify-between">
//             <span>Selected Items ({formData.selectedProblems.length}):</span>
//             <span className="font-semibold text-white">₹{basePrice}</span>
//           </div>

//           <div className="flex justify-between">
//             <span>Platform Fee:</span>
//             <span className="font-semibold text-white">₹{platformFee}</span>
//           </div>

//           {formData.isEmergency && (
//             <div className="flex justify-between text-[#FF5500] font-bold">
//               <span>Emergency Priority Fee:</span>
//               <span>+ ₹{emergencyFee}</span>
//             </div>
//           )}

//           <div className="flex justify-between pt-2 border-t border-gray-800 text-sm font-black text-white">
//             <span>Total Payable:</span>
//             <span className="text-[#FF5500] text-base">₹{totalAmount}</span>
//           </div>
//         </div>

//         <button
//           onClick={() => alert("Booking Confirmed!")}
//           className="w-full bg-[#FF5500] hover:bg-[#e04b00] text-white font-bold py-3 rounded-xl transition flex items-center justify-center gap-2 text-xs shadow-md mt-2"
//         >
//           <span>Confirm Booking Now</span>
//           <ArrowRight size={15} />
//         </button>

//         <div className="flex items-center justify-center gap-1.5 text-gray-400 text-[10px] pt-1">
//           <ShieldCheck size={13} className="text-[#FF5500]" />
//           <span>Verified Local Technicians • 100% Satisfaction Guarantee</span>
//         </div>
//       </div>

//     </div>
//   );
// }


'use client';

import { useState, useEffect, use } from "react";
import { User, Phone, Mail, Wrench, MapPin, CalendarDays, AlertTriangle, ShieldCheck, ArrowRight, PhoneCall } from "lucide-react";

export default function SingleBookingForm({ searchParams }) {
  // 1. Unwrap searchParams using React.use() since it's a Promise in Next.js 15+
  const resolvedParams = use(searchParams);

  // 1. Centralized Form State
  const [formData, setFormData] = useState({
    customerName: "Swathi",
    phone: "+91 98765 43210",
    email: "swathi@example.com",
    category: "Plumbing",
    selectedProblems: [],
    customProblem: "",
    address: "",
    scheduleType: "anytime", // 'anytime' | 'scheduled'
    date: "",
    time: "",
    isEmergency: false,
    emergencyReason: "",
  });

  // Pre-select category if passed via URL (e.g., /customer/booking?service=Electrical)
  useEffect(() => {
    if (resolvedParams?.service) {
      setFormData((prev) => ({ ...prev, category: resolvedParams.service }));
    }
  }, [resolvedParams]);

  // Preset problem options with fixed rates
  const categoryProblems = {
    Plumbing: [
      { id: "p1", title: "Tap Leakage Fix", price: 199 },
      { id: "p2", title: "Drainage Clearance", price: 299 },
      { id: "p3", title: "Water Tank Outlet Fitting", price: 499 },
    ],
    Electrical: [
      { id: "e1", title: "Switch Board Repair", price: 149 },
      { id: "e2", title: "Fan / Light Installation", price: 199 },
      { id: "e3", title: "MCB Tripping Fix", price: 349 },
    ],
    Cleaning: [
      { id: "c1", title: "Bathroom Deep Wash", price: 399 },
      { id: "c2", title: "Kitchen Sanitization", price: 599 },
    ],
    Painting: [
      { id: "pt1", title: "Single Room Touch-up", price: 899 },
      { id: "pt2", title: "Wall Leakage Coating", price: 1199 },
    ],
  };

  const activeProblems = categoryProblems[formData.category] || categoryProblems.Plumbing;

  // Toggle problem selection
  const handleProblemToggle = (problem) => {
    setFormData((prev) => {
      const exists = prev.selectedProblems.some((p) => p.id === problem.id);
      const updated = exists
        ? prev.selectedProblems.filter((p) => p.id !== problem.id)
        : [...prev.selectedProblems, problem];
      return { ...prev, selectedProblems: updated };
    });
  };

  // Price Calculation Logic
  const basePrice = formData.selectedProblems.reduce((sum, p) => sum + p.price, 0);
  const platformFee = 29;
  const emergencyFee = formData.isEmergency ? 150 : 0;
  const totalAmount = basePrice + platformFee + emergencyFee;

  return (
    <div className="max-w-4xl mx-auto bg-white border border-gray-200 rounded-2xl shadow-md p-6 sm:p-8 space-y-6 text-[#0F172A]">
      
      {/* Top Banner: Standard Title + Assisted Emergency Call */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-gray-100 pb-5 gap-4">
        <div>
          <h1 className="text-2xl font-black text-[#0F172A]">Book a Service</h1>
          <p className="text-xs text-gray-500">Complete your service request or call direct dispatch.</p>
        </div>
        <a
          href="tel:+919876543210"
          className="inline-flex items-center gap-2 bg-[#0F172A] hover:bg-[#FF5500] text-white text-xs font-bold px-4 py-2.5 rounded-xl transition self-start sm:self-auto"
        >
          <PhoneCall size={15} className="text-[#FF5500]" />
          <span>Elderly / Quick Call: +91 98765 43210</span>
        </a>
      </div>

      {/* Row 1: Account Info (Read-Only Badges) */}
      <div>
        <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block mb-2">
          Customer Account
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-gray-50 border border-gray-200 p-3 rounded-xl text-xs font-medium">
          <div className="flex items-center gap-2">
            <User size={15} className="text-[#FF5500]" />
            <span className="truncate">{formData.customerName}</span>
          </div>
          <div className="flex items-center gap-2">
            <Phone size={15} className="text-[#FF5500]" />
            <span>{formData.phone}</span>
          </div>
          <div className="flex items-center gap-2">
            <Mail size={15} className="text-[#FF5500]" />
            <span className="truncate">{formData.email}</span>
          </div>
        </div>
      </div>

      {/* Row 2: Category Selector */}
      <div>
        <label className="text-xs font-bold text-gray-700 block mb-1.5">Selected Category</label>
        <select
          value={formData.category}
          onChange={(e) =>
            setFormData({ ...formData, category: e.target.value, selectedProblems: [] })
          }
          className="w-full border border-gray-300 rounded-xl p-3 text-xs font-bold text-[#FF5500] bg-orange-50/30 outline-none focus:border-[#FF5500]"
        >
          <option value="Plumbing">Plumbing Services</option>
          <option value="Electrical">Electrical Work</option>
          <option value="Cleaning">Home Cleaning</option>
          <option value="Painting">Wall Painting</option>
        </select>
      </div>

      {/* Row 3: Preset Problem Checklist */}
      <div>
        <label className="text-xs font-bold text-gray-700 block mb-2">
          Common Issues (Check to add to estimate)
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
          {activeProblems.map((prob) => {
            const isChecked = formData.selectedProblems.some((p) => p.id === prob.id);
            return (
              <label
                key={prob.id}
                onClick={() => handleProblemToggle(prob)}
                className={`flex items-center justify-between p-3 rounded-xl border text-xs cursor-pointer transition ${
                  isChecked
                    ? "border-[#FF5500] bg-orange-50/50 font-semibold text-[#0F172A]"
                    : "border-gray-200 hover:border-gray-300 text-gray-600"
                }`}
              >
                <div className="flex items-center gap-2">
                  <input type="checkbox" checked={isChecked} readOnly className="accent-[#FF5500]" />
                  <span>{prob.title}</span>
                </div>
                <span className="font-bold text-[#FF5500]">₹{prob.price}</span>
              </label>
            );
          })}
        </div>
      </div>

      {/* Row 4: Custom Description Box */}
      <div>
        <label className="text-xs font-bold text-gray-700 block mb-1">
          Custom Problem / Specific Details
        </label>
        <textarea
          rows={2}
          placeholder="Describe your issue if not listed above..."
          value={formData.customProblem}
          onChange={(e) => setFormData({ ...formData, customProblem: e.target.value })}
          className="w-full border border-gray-300 rounded-xl p-3 text-xs outline-none focus:border-[#FF5500]"
        />
        {formData.customProblem && (
          <p className="text-[11px] text-amber-600 font-medium mt-1">
            * Custom problems may require on-site assessment by technician before final quote.
          </p>
        )}
      </div>

      {/* Row 5: Emergency Dispatch Switch & Reason */}
      <div className={`p-4 rounded-xl border transition ${formData.isEmergency ? "bg-orange-50 border-[#FF5500]" : "bg-gray-50 border-gray-200"}`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertTriangle size={18} className={formData.isEmergency ? "text-[#FF5500]" : "text-gray-400"} />
            <div>
              <span className="text-xs font-bold block">Need Emergency Priority Dispatch?</span>
              <span className="text-[11px] text-gray-500">Technician arrives within 60–90 minutes.</span>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setFormData({ ...formData, isEmergency: !formData.isEmergency })}
            className={`w-11 h-6 rounded-full transition p-0.5 ${formData.isEmergency ? "bg-[#FF5500]" : "bg-gray-300"}`}
          >
            <div className={`w-5 h-5 bg-white rounded-full transition transform ${formData.isEmergency ? "translate-x-5" : "translate-x-0"}`} />
          </button>
        </div>

        {formData.isEmergency && (
          <div className="mt-3 pt-3 border-t border-orange-200 space-y-2">
            <label className="text-xs font-bold text-[#0F172A]">Reason for Emergency (Required)</label>
            <input
              type="text"
              placeholder="e.g. Major pipe burst, short circuit risk"
              value={formData.emergencyReason}
              onChange={(e) => setFormData({ ...formData, emergencyReason: e.target.value })}
              className="w-full border border-orange-300 bg-white rounded-lg p-2 text-xs outline-none"
            />
            <p className="text-[11px] text-[#FF5500] font-semibold">
              ⚡ Priority dispatch fee (+₹150) will be added to total summary.
            </p>
          </div>
        )}
      </div>

      {/* Row 6: Address & Schedule Settings */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="text-xs font-bold text-gray-700 block mb-1">Service Address</label>
          <textarea
            rows={3}
            placeholder="Enter house no, street, landmark..."
            value={formData.address}
            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
            className="w-full border border-gray-300 rounded-xl p-3 text-xs outline-none focus:border-[#FF5500]"
          />
        </div>

        <div>
          <label className="text-xs font-bold text-gray-700 block mb-1">Time Slot Preference</label>
          <div className="flex gap-2 mb-2">
            <button
              type="button"
              onClick={() => setFormData({ ...formData, scheduleType: "anytime" })}
              className={`flex-1 py-2 px-3 rounded-xl border text-xs font-bold transition ${
                formData.scheduleType === "anytime"
                  ? "bg-orange-50 border-[#FF5500] text-[#FF5500]"
                  : "border-gray-200 text-gray-600 hover:bg-gray-50"
              }`}
            >
              🚀 Send Anytime
            </button>
            <button
              type="button"
              onClick={() => setFormData({ ...formData, scheduleType: "scheduled" })}
              className={`flex-1 py-2 px-3 rounded-xl border text-xs font-bold transition ${
                formData.scheduleType === "scheduled"
                  ? "bg-orange-50 border-[#FF5500] text-[#FF5500]"
                  : "border-gray-200 text-gray-600 hover:bg-gray-50"
              }`}
            >
              📅 Specific Slot
            </button>
          </div>

          {formData.scheduleType === "scheduled" && (
            <div className="grid grid-cols-2 gap-2">
              <input
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                className="border border-gray-300 rounded-lg p-2 text-xs outline-none"
              />
              <input
                type="time"
                value={formData.time}
                onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                className="border border-gray-300 rounded-lg p-2 text-xs outline-none"
              />
            </div>
          )}
        </div>
      </div>

      {/* Row 7: Integrated Live Booking Summary Box */}
      <div className="bg-[#0F172A] text-white rounded-xl p-5 space-y-3">
        <div className="flex justify-between items-center border-b border-gray-800 pb-2">
          <span className="text-xs font-bold uppercase tracking-wider text-gray-400">Live Booking Summary</span>
          <span className="text-xs bg-[#FF5500] text-white px-2 py-0.5 rounded font-bold">{formData.category}</span>
        </div>

        <div className="text-xs space-y-1.5 text-gray-300">
          <div className="flex justify-between">
            <span>Selected Items ({formData.selectedProblems.length}):</span>
            <span className="font-semibold text-white">₹{basePrice}</span>
          </div>

          <div className="flex justify-between">
            <span>Platform Fee:</span>
            <span className="font-semibold text-white">₹{platformFee}</span>
          </div>

          {formData.isEmergency && (
            <div className="flex justify-between text-[#FF5500] font-bold">
              <span>Emergency Priority Fee:</span>
              <span>+ ₹{emergencyFee}</span>
            </div>
          )}

          <div className="flex justify-between pt-2 border-t border-gray-800 text-sm font-black text-white">
            <span>Total Payable:</span>
            <span className="text-[#FF5500] text-base">₹{totalAmount}</span>
          </div>
        </div>

        <button
          onClick={() => alert("Booking Confirmed!")}
          className="w-full bg-[#FF5500] hover:bg-[#e04b00] text-white font-bold py-3 rounded-xl transition flex items-center justify-center gap-2 text-xs shadow-md mt-2"
        >
          <span>Confirm Booking Now</span>
          <ArrowRight size={15} />
        </button>

        <div className="flex items-center justify-center gap-1.5 text-gray-400 text-[10px] pt-1">
          <ShieldCheck size={13} className="text-[#FF5500]" />
          <span>Verified Local Technicians • 100% Satisfaction Guarantee</span>
        </div>
      </div>

    </div>
  );
}