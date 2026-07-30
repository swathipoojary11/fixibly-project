"use client";

import { MessageSquareHeart } from "lucide-react";

export default function FeedbackHero() {
  return (
    <section className="grid lg:grid-cols-2 rounded-3xl overflow-hidden shadow-2xl mb-12">

      {/* Left Side */}

      <div className="bg-[#151515] text-white p-12 flex flex-col justify-center">

        <span className="uppercase tracking-widest text-orange-500 font-semibold text-sm">
          Customer Feedback
        </span>

        <h1 className="text-5xl font-bold leading-tight mt-5">
          Share Your
          <br />
          Service Experience
        </h1>

        <p className="text-gray-300 mt-6 leading-8 text-lg">
          Thank you for choosing <span className="text-orange-500 font-semibold">FieldFlow</span>.
          Your valuable feedback helps us improve our services and rewards
          technicians for delivering excellent work.
        </p>

        <div className="mt-10 bg-orange-500 rounded-2xl p-6 flex items-center gap-5">

          <div className="bg-white p-4 rounded-full">

            <MessageSquareHeart
              className="text-orange-500"
              size={32}
            />

          </div>

          <div>

            <h3 className="font-bold text-xl">
              Your opinion matters.
            </h3>

            <p className="text-orange-100 mt-1">
              It only takes a minute to help us improve.
            </p>

          </div>

        </div>

      </div>

      {/* Right Side */}

      <div className="relative min-h-[600px]">

        <img
          src="https://images.unsplash.com/photo-1517048676732-d65bc937f952?w=1200"
          alt="Customer Feedback"
          className="w-full h-full object-cover"
        />

        <div className="absolute inset-0 bg-black/20"></div>

      </div>

    </section>
  );
}