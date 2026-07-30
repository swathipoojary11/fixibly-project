"use client";

import HistoryCard from "./historyCard";

const history = [
  {
    id: 1,
    service: "Electrical Repair",
    technician: "Rahul Sharma",
    completedDate: "28 July 2026",
    rating: 5,
    description:
      "Complete electrical wiring inspection, switch replacement and safety testing for your home.",
    image:
      "https://images.unsplash.com/photo-1621905252507-b35492cc74b4?w=900&q=80",
  },

  {
    id: 2,
    service: "AC Maintenance",
    technician: "Priya Nair",
    completedDate: "22 July 2026",
    rating: 4,
    description:
      "Full AC servicing including filter cleaning, gas pressure check and cooling performance testing.",
    image:
      "https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=900&q=80",
  },

  {
    id: 3,
    service: "House Cleaning",
    technician: "Arjun Patel",
    completedDate: "18 July 2026",
    rating: 5,
    description:
      "Deep cleaning service covering bedrooms, kitchen, bathrooms and complete floor sanitization.",
    image:
      "https://images.unsplash.com/photo-1520607162513-77705c0f0d4a?w=900&q=80",
  },
];

export default function HistorySection() {
  return (
    <section className="py-24 bg-gray-50">

      <div className="max-w-7xl mx-auto px-6">

        <div className="flex justify-between items-center mb-14 flex-wrap gap-6">

          <div>

            <p className="uppercase tracking-widest text-orange-500 font-semibold">
              Recent Services
            </p>

            <h2 className="text-5xl font-bold mt-3">
              Your Completed
              <br />
              Bookings
            </h2>

          </div>

          <button className="bg-orange-500 hover:bg-orange-600 text-white px-7 py-4 rounded-lg font-semibold transition">
            View Full History →
          </button>

        </div>

        <div className="space-y-10">

          {history.map((booking) => (
            <HistoryCard
              key={booking.id}
              {...booking}
            />
          ))}

        </div>

      </div>

    </section>
  );
}