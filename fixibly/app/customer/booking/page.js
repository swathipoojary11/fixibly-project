'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Navbar from "@/app/components/navbar";
import Footer from "@/app/components/footer";
import BookingForm from "@/app/components/customers/bookingComponent/BookingForm";

function BookingContent() {
  const searchParams = useSearchParams();
  const rawCategoryId = searchParams.get('categoryId');
  const categoryId = rawCategoryId ? Number(rawCategoryId) : 1;

  return <BookingForm categoryId={categoryId} />;
}

export default function BookingPage() {
  return (
    <div className="bg-gray-100 min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-6xl w-full mx-auto px-4 py-10 pt-24">
        <Suspense fallback={<div className="p-8 text-center text-gray-500 font-semibold">Loading booking form...</div>}>
          <BookingContent />
        </Suspense>
      </main>

      <Footer />
    </div>
  );
}