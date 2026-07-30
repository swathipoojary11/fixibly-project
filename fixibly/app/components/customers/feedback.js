"use client";

import Link from "next/link";

export default function FeedbackSection() {
  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-6">

        <div className="grid lg:grid-cols-2 gap-14 items-center">

          {/* Left Image */}

          <div>
            <img
              src="https://images.unsplash.com/photo-1517048676732-d65bc937f952?w=1200&q=80"
              alt="Customer Feedback"
              className="rounded-xl shadow-lg w-full h-[500px] object-cover"
            />
          </div>

          {/* Right Content */}

          <div>

            <p className="uppercase tracking-[3px] text-orange-500 font-semibold mb-3">
              CUSTOMER FEEDBACK
            </p>

            <h2 className="text-5xl font-bold leading-tight text-gray-900 mb-8">
              Tell Us About
              <br />
              Your Experience
            </h2>

            {/* Review Card */}

            <div className="bg-gray-50 rounded-xl shadow-md p-8">

              <div className="flex text-orange-500 text-2xl mb-4">
                ★★★★★
              </div>

              <h3 className="text-2xl font-bold">
                We Value Every Review
              </h3>

              <p className="text-gray-500 mt-1">
                Help us improve our services.
              </p>

              <p className="text-gray-600 leading-8 mt-6">
                Your feedback helps us improve the quality of our home
                services and allows future customers to choose trusted
                professionals with confidence.
              </p>

              <div className="mt-8 flex gap-4">

                <Link href="/customer/customerfeedback">
                  <button className="bg-orange-500 hover:bg-orange-600 text-white px-7 py-3 rounded-lg font-semibold transition">
                    Give Feedback →
                  </button>
                </Link>

                {/* <Link href="/customer/history">
                  <button className="border border-orange-500 text-orange-500 hover:bg-orange-500 hover:text-white px-7 py-3 rounded-lg font-semibold transition">
                    View Completed Jobs
                  </button>
                </Link> */}

              </div>

            </div>

          </div>

        </div>

      </div>
    </section>
  );
}