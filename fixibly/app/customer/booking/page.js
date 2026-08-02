//app/customer/booking/page.js
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