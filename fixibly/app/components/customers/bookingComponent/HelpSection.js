// "use client";

// import Link from "next/link";
// import {
//   Phone,
//   MessageCircle,
//   Mail,
//   CircleHelp,
//   ArrowRight,
// } from "lucide-react";

// export default function HelpSection() {
//   return (
//     <section className="py-20 bg-white">

//       <div className="max-w-7xl mx-auto px-6">

//         {/* Heading */}

//         <div className="text-center mb-14">

//           <span className="uppercase tracking-[3px] text-orange-500 font-semibold">
//             Need Assistance?
//           </span>

//           <h2 className="text-5xl font-bold mt-4 text-gray-900">
//             We're Here To Help
//           </h2>

//           <p className="text-gray-600 max-w-2xl mx-auto mt-5 text-lg leading-8">
//             Have questions before booking? Our support team is ready to help you
//             with service selection, booking assistance, and emergency requests.
//           </p>

//         </div>

//         {/* Cards */}

//         <div className="grid md:grid-cols-3 gap-8">

//           {/* Phone */}

//           <div className="bg-gray-50 rounded-3xl shadow-lg p-8 hover:shadow-xl transition">

//             <div className="bg-orange-500 w-16 h-16 rounded-full flex items-center justify-center text-white mb-6">
//               <Phone size={30} />
//             </div>

//             <h3 className="text-2xl font-bold mb-4">
//               Call Support
//             </h3>

//             <p className="text-gray-600 leading-7 mb-6">
//               Speak directly with our customer support team for booking
//               assistance and urgent requests.
//             </p>

//             <p className="font-semibold text-lg">
//               +91 98765 43210
//             </p>

//           </div>

//           {/* Chat */}

//           <div className="bg-orange-500 text-white rounded-3xl shadow-xl p-8 hover:scale-[1.02] transition">

//             <div className="bg-white text-orange-500 w-16 h-16 rounded-full flex items-center justify-center mb-6">
//               <MessageCircle size={30} />
//             </div>

//             <h3 className="text-2xl font-bold mb-4">
//               Live Chat
//             </h3>

//             <p className="leading-7 text-orange-100 mb-8">
//               Chat instantly with our support executives and get answers within
//               minutes.
//             </p>

//             <button className="bg-white text-orange-500 font-semibold px-6 py-3 rounded-xl hover:bg-gray-100 transition">
//               Start Chat
//             </button>

//           </div>

//           {/* Email */}

//           <div className="bg-gray-50 rounded-3xl shadow-lg p-8 hover:shadow-xl transition">

//             <div className="bg-orange-500 w-16 h-16 rounded-full flex items-center justify-center text-white mb-6">
//               <Mail size={30} />
//             </div>

//             <h3 className="text-2xl font-bold mb-4">
//               Email Support
//             </h3>

//             <p className="text-gray-600 leading-7 mb-6">
//               Prefer email? Reach out anytime and we'll respond as quickly as
//               possible.
//             </p>

//             <p className="font-semibold text-lg">
//               support@fieldflow.com
//             </p>

//           </div>

//         </div>

//         {/* FAQ Banner */}

//         <div className="mt-20 bg-gradient-to-r from-black to-gray-900 rounded-3xl p-10 text-white">

//           <div className="flex flex-col lg:flex-row justify-between items-center gap-8">

//             <div className="flex items-center gap-5">

//               <div className="bg-orange-500 p-5 rounded-full">
//                 <CircleHelp size={34} />
//               </div>

//               <div>

//                 <h3 className="text-3xl font-bold">
//                   Frequently Asked Questions
//                 </h3>

//                 <p className="text-gray-300 mt-3 max-w-xl">
//                   Find answers about bookings, technician assignments,
//                   cancellations, emergency services, and payments.
//                 </p>

//               </div>

//             </div>

//             <Link href="/faq">

//               <button className="bg-orange-500 hover:bg-orange-600 px-8 py-4 rounded-xl font-semibold flex items-center gap-3 transition">

//                 Visit FAQ

//                 <ArrowRight size={20} />

//               </button>

//             </Link>

//           </div>

//         </div>

//       </div>

//     </section>
//   );
// }