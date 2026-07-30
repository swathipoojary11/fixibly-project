"use client";

import {
  Phone,
  Headphones,
  ArrowRight,
} from "lucide-react";

export default function ElderlySupport() {

  return (

    <section className="bg-black py-14">

      <div className="max-w-7xl mx-auto px-6">

        <div className="bg-white rounded-3xl p-7 md:p-9 flex flex-col md:flex-row items-center justify-between gap-7">

          <div className="flex items-center gap-5">

            <div className="w-14 h-14 rounded-2xl bg-orange-500 text-white flex items-center justify-center shrink-0">
              <Headphones size={28} />
            </div>

            <div>

              <p className="text-orange-500 text-xs uppercase tracking-[2px] font-bold">
                Need assistance?
              </p>

              <h2 className="text-2xl font-bold mt-1">
                Don't want to fill the form?
              </h2>

              <p className="text-gray-500 mt-1">
                Elderly customers or anyone needing assistance can directly
                call our dispatcher.
              </p>

            </div>

          </div>


          <a
            href="tel:+919876543210"
            className="flex items-center gap-3 bg-orange-500 hover:bg-orange-600 text-white px-7 py-4 rounded-xl font-bold transition whitespace-nowrap"
          >

            <Phone size={20} />

            Call Dispatcher

            <ArrowRight size={19} />

          </a>

        </div>

      </div>

    </section>

  );
}