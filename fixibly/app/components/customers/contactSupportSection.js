"use client";

import { PhoneCall, Mail, MessageCircle } from "lucide-react";

export default function ContactSupportSection() {
  const faqs = [
    {
      question: "How do I cancel my booking?",
      answer:
        "Open Booking History, select your booking and click 'Cancel Booking'. Cancellation is available before the technician starts travelling.",
    },
    {
      question: "My technician hasn't arrived yet.",
      answer:
        "You can track your technician from the Booking Tracking page or contact our support team for assistance.",
    },
    {
      question: "How do I reschedule my appointment?",
      answer:
        "Go to Booking History, choose the booking and click 'Reschedule'. Select a new available date and time.",
    },
    {
      question: "How do emergency bookings work?",
      answer:
        "Emergency bookings receive higher priority and may require an advance payment before confirmation.",
    },
  ];

  return (
    <section className="relative bg-[#161616] py-28 text-white overflow-hidden">

      {/* Background */}

      <div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage:
            "url('https://www.transparenttextures.com/patterns/cubes.png')",
        }}
      />

      <div className="relative max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-16 items-center">

        {/* Left */}

        <div>

          <p className="uppercase tracking-widest text-orange-500 font-semibold mb-3">
            NEED HELP?
          </p>

          <h2 className="text-5xl font-bold leading-tight">
            We're Here To
            <br />
            Help You
          </h2>

          <p className="text-gray-300 mt-8 leading-8">
            Facing issues with your booking, payment, technician or
            scheduling? Our support team is available to assist you quickly.
          </p>

          <div className="mt-10 flex flex-wrap gap-4">

            <button className="bg-orange-500 hover:bg-orange-600 px-7 py-4 rounded-lg font-semibold flex items-center gap-2 transition">
              <PhoneCall size={20} />
              Contact Support
            </button>

            <button className="border border-white px-7 py-4 rounded-lg hover:bg-white hover:text-black transition flex items-center gap-2">
              <MessageCircle size={20} />
              Live Chat
            </button>

          </div>

          {/* Contact Info */}

          <div className="mt-12 space-y-4">

            <div className="flex items-center gap-4">
              <PhoneCall className="text-orange-500" />
              +91 98765 43210
            </div>

            <div className="flex items-center gap-4">
              <Mail className="text-orange-500" />
              support@fieldflow.com
            </div>

          </div>

        </div>

        {/* FAQ */}

        <div className="bg-white rounded-xl shadow-xl p-8 text-black">

          <h3 className="text-3xl font-bold mb-8">
            Frequently Asked Questions
          </h3>

          <div className="space-y-5">

            {faqs.map((faq, index) => (
              <details
                key={index}
                className="border rounded-lg p-5 group"
              >
                <summary className="cursor-pointer font-semibold text-lg list-none flex justify-between items-center">
                  {faq.question}

                  <span className="text-orange-500 text-2xl">
                    +
                  </span>
                </summary>

                <p className="text-gray-600 mt-4 leading-7">
                  {faq.answer}
                </p>

              </details>
            ))}

          </div>

        </div>

      </div>
    </section>
  );
}