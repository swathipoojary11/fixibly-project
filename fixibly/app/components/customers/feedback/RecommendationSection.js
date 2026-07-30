"use client";

import { useState } from "react";

export default function RecommendationSection() {

  const [selected, setSelected] = useState("");

  const options = [
    "Definitely Yes",
    "Maybe",
    "No"
  ];

  return (

    <section className="bg-white rounded-3xl shadow-xl p-10 mb-10">

      <span className="uppercase tracking-widest text-orange-500 font-semibold">

        Recommendation

      </span>

      <h2 className="text-3xl font-bold mt-3">

        Would you hire this technician again?

      </h2>

      <p className="text-gray-500 mt-2">

        Your answer helps us evaluate technician performance.

      </p>

      <div className="grid md:grid-cols-3 gap-6 mt-10">

        {options.map((option) => (

          <button

            key={option}

            onClick={() => setSelected(option)}

            className={`rounded-2xl border-2 p-8 transition font-semibold text-lg

            ${
              selected === option
                ? "bg-orange-500 text-white border-orange-500"
                : "bg-white hover:border-orange-500"
            }

            `}

          >

            {option}

          </button>

        ))}

      </div>

    </section>

  );

}