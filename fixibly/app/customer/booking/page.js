// import Navbar from "@/app/components/navbar";
// import Footer from "@/app/components/footer";

// import BookingForm from "@/app/components/bookingComponent/BookingForm";
// import BookingSummary from "@/app/components/bookingComponent/BookingSummary";
// import ElderlySupport from "@/app/components/bookingComponent/ElderlySupport";

// export default function BookingPage() {
//   return (
//     <>
//       <Navbar />

//       <main className="min-h-screen bg-gray-50">

//         {/* Page Header */}

//         <section className="bg-black text-white">
//           <div className="max-w-7xl mx-auto px-6 py-16">

//             <p className="text-orange-500 uppercase tracking-[4px] font-semibold text-sm">
//               FieldFlow Services
//             </p>

//             <h1 className="text-4xl md:text-5xl font-bold mt-4">
//               Book Your Service
//             </h1>

//             <p className="text-gray-300 mt-4 max-w-2xl text-lg">
//               Tell us what you need and we'll connect you with the right
//               professional for the job.
//             </p>

//           </div>
//         </section>


//         {/* Booking */}

//         <section className="max-w-7xl mx-auto px-6 py-12">

//           <div className="grid lg:grid-cols-3 gap-8 items-start">

//             {/* ONE BOOKING FORM */}

//             <div className="lg:col-span-2">
//               <BookingForm />
//             </div>


//             {/* SUMMARY */}

//             <div>
//               <BookingSummary />
//             </div>

//           </div>

//         </section>


//         {/* Elderly / Call Support */}

//         <ElderlySupport />

//       </main>

//       <Footer />
//     </>
//   );
// }

'use client';

import Navbar from "@/app/components/navbar";
import Footer from "@/app/components/footer";
import SingleBookingForm from "@/app/components/customers/bookingComponent/BookingForm";

export default function BookingPage({ searchParams }) {
  return (
    <div className="bg-gray-100 min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-6xl w-full mx-auto px-4 py-10 pt-24">
        <SingleBookingForm searchParams={searchParams} />
      </main>

      <Footer />
    </div>
  );
}