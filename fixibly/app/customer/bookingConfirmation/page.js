import Navbar from "@/app/components/navbar";
import Footer from "@/app/components/footer";

import BookingSuccessCard from "@/app/components/customers/bookingConfirmation/BookingSuccessCard";
import BookingDetails from "@/app/components/customers/bookingConfirmation/BookingDetails";
import TechnicianCard from "@/app/components/customers/bookingConfirmation/TechnicianCard";
import TrackingTimeline from "@/app/components/customers/bookingConfirmation/TrackingTimeline";
import ActionButtons from "@/app/components/customers/bookingConfirmation/ActionButton";

export default function BookingConfirmationPage() {
  return (
    <>
      <Navbar />

      <main className="bg-gray-100 min-h-screen">

        <div className="max-w-7xl mx-auto px-6 py-12">

          <BookingSuccessCard />

          <BookingDetails />

          <TechnicianCard />

          <TrackingTimeline />

          <ActionButtons />

        </div>

      </main>

      <Footer />
    </>
  );
}