"use client";

import { CheckCircle2 } from "lucide-react";

export default function SubmitSection() {

  return (

    <section className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-3xl shadow-2xl text-white p-12">

      <div className="flex flex-col lg:flex-row justify-between items-center gap-8">

        <div>

          <div className="flex items-center gap-4">

            <CheckCircle2 size={40} />

            <h2 className="text-4xl font-bold">

              Thank You!

            </h2>

          </div>

          <p className="mt-6 text-orange-100 leading-8 max-w-2xl">

            Your feedback helps improve FieldFlow's service quality and
            contributes to technician performance evaluation. We appreciate
            your valuable time.

          </p>

          <ul className="mt-8 space-y-3">

            <li>✔ Improve service quality</li>

            <li>✔ Reward high-performing technicians</li>

            <li>✔ Help future customers make informed decisions</li>

          </ul>

        </div>

        <div>

          <button className="bg-white text-orange-500 px-10 py-5 rounded-2xl text-xl font-bold hover:scale-105 transition">

            Submit Feedback

          </button>

        </div>

      </div>

    </section>

  );

}