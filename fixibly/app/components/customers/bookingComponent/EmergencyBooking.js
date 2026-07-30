// "use client";

// import {
//   AlertTriangle,
//   Clock3,
//   ShieldCheck,
//   CreditCard,
// } from "lucide-react";

// export default function EmergencyBooking({
//   isEmergency,
//   setIsEmergency,
//   emergencyReason,
//   setEmergencyReason,
//   advancePayment,
// }) {

//   return (

//     <section
//       className={`rounded-3xl border-2 shadow-lg overflow-hidden transition ${
//         isEmergency
//           ? "border-orange-500 bg-orange-50"
//           : "border-gray-200 bg-white"
//       }`}
//     >

//       {/* HEADER */}

//       <div className="p-8">

//         <div className="flex items-center justify-between gap-6">

//           <div className="flex items-center gap-4">

//             <div
//               className={`p-4 rounded-2xl ${
//                 isEmergency
//                   ? "bg-orange-500 text-white"
//                   : "bg-orange-100 text-orange-500"
//               }`}
//             >
//               <AlertTriangle size={28} />
//             </div>

//             <div>

//               <h2 className="text-2xl font-bold">
//                 Emergency Service
//               </h2>

//               <p className="text-gray-500 mt-1">
//                 Need urgent assistance?
//               </p>

//             </div>

//           </div>


//           {/* TOGGLE */}

//           <button
//             type="button"
//             onClick={() =>
//               setIsEmergency(!isEmergency)
//             }
//             className={`w-16 h-9 rounded-full transition ${
//               isEmergency
//                 ? "bg-orange-500"
//                 : "bg-gray-300"
//             }`}
//           >

//             <div
//               className={`w-7 h-7 bg-white rounded-full shadow transition ${
//                 isEmergency
//                   ? "translate-x-8"
//                   : "translate-x-1"
//               }`}
//             />

//           </button>

//         </div>

//       </div>


//       {/* EMERGENCY CONTENT */}

//       {isEmergency && (

//         <div className="px-8 pb-8">

//           <div className="grid md:grid-cols-3 gap-5 mb-6">

//             <div className="bg-white rounded-2xl p-5">

//               <Clock3 className="text-orange-500" />

//               <p className="font-bold mt-3">
//                 Priority Response
//               </p>

//               <p className="text-sm text-gray-500 mt-1">
//                 Your booking gets priority allocation.
//               </p>

//             </div>


//             <div className="bg-white rounded-2xl p-5">

//               <ShieldCheck className="text-orange-500" />

//               <p className="font-bold mt-3">
//                 Priority Technician
//               </p>

//               <p className="text-sm text-gray-500 mt-1">
//                 Assigned based on availability.
//               </p>

//             </div>


//             <div className="bg-white rounded-2xl p-5">

//               <CreditCard className="text-orange-500" />

//               <p className="font-bold mt-3">
//                 Advance Payment
//               </p>

//               <p className="text-sm text-gray-500 mt-1">
//                 Required for emergency requests.
//               </p>

//             </div>

//           </div>


//           {/* REASON */}

//           <label className="font-semibold">
//             Why is this an emergency?
//           </label>

//           <textarea
//             value={emergencyReason}
//             onChange={(e) =>
//               setEmergencyReason(e.target.value)
//             }
//             rows={3}
//             placeholder="Briefly explain why you need urgent assistance..."
//             className="w-full border rounded-xl p-4 mt-2 resize-none focus:ring-2 focus:ring-orange-500 outline-none"
//           />


//           {/* ADVANCE */}

//           <div className="mt-6 bg-black text-white rounded-2xl p-6 flex items-center justify-between">

//             <div>

//               <p className="text-gray-400">
//                 Advance payment required
//               </p>

//               <p className="text-sm text-gray-400 mt-1">
//                 Your booking will be confirmed after payment.
//               </p>

//             </div>

//             <p className="text-3xl font-bold text-orange-500">
//               ${advancePayment}
//             </p>

//           </div>

//         </div>

//       )}

//     </section>
//   );
// }