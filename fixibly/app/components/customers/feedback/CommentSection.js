"use client";

import { MessageSquare } from "lucide-react";

export default function CommentSection() {
  return (
    <section className="bg-white rounded-3xl shadow-xl p-10 mb-10">

      <div className="flex items-center gap-4 mb-6">

        <div className="bg-orange-500 p-3 rounded-full text-white">
          <MessageSquare size={24} />
        </div>

        <div>

          <h2 className="text-3xl font-bold">
            Tell Us More
          </h2>

          <p className="text-gray-500">
            Share your experience in your own words.
          </p>

        </div>

      </div>

      <textarea
        rows={7}
        placeholder="Write your feedback here..."
        className="w-full rounded-2xl border border-gray-300 p-5 focus:outline-none focus:ring-2 focus:ring-orange-500 resize-none"
      />

      <div className="flex justify-between mt-4 text-sm text-gray-500">

        <p>Optional</p>

        <p>Maximum 500 characters</p>

      </div>

    </section>
  );
}