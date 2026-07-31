// app/customer/feedback/page.js
"use client";

import Navbar from "@/app/components/navbar";
import Footer from "@/app/components/footer";
import CustomerFeedback from "@/app/components/customers/customerfeedbackform";

export default function FeedbackPage() {
  return (
    <main className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-4xl mx-auto px-6 py-20">
       <CustomerFeedback />
      </div>
      <Footer />
    </main>
  );
}