"use client";

import { useState } from "react";
import { Star, Send } from "lucide-react";

export default function FeedbackForm() {
  const [rating, setRating] = useState(5);
  const [hover, setHover] = useState(0);
  const [feedback, setFeedback] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!rating || !feedback.trim()) return;

    setLoading(true);
    setError("");

    const token = localStorage.getItem("token") || localStorage.getItem("accessToken");

    try {
      const res = await fetch("http://localhost:5000/api/customer/platform-feedback", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          rating,
          comments: feedback
        })
      });

      const result = await res.json();
      if (result.success) {
        setSubmitted(true);
      } else {
        setError(result.message || "Failed to submit platform feedback.");
      }
    } catch (err) {
      setError("Network error. Unable to submit platform feedback.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto bg-white p-8 rounded-xl shadow-md border border-gray-100">
      <h3 className="text-2xl font-bold text-gray-900 text-center">
        We Value Your Platform Feedback
      </h3>
      <p className="text-gray-600 text-center mt-2 text-sm">
        Please let us know about your overall experience with FieldFlow app.
      </p>

      {error && (
        <div className="mt-4 p-3 bg-red-50 border border-red-200 text-red-600 rounded-lg text-sm font-medium">
          {error}
        </div>
      )}

      {submitted ? (
        <div className="mt-8 text-center bg-green-50 text-green-700 p-6 rounded-lg border border-green-200">
          <h4 className="font-semibold text-lg">Thank you!</h4>
          <p className="text-sm mt-1">Your platform feedback has been submitted successfully to Supabase database.</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="mt-6 space-y-6">
          {/* Star Rating Section */}
          <div className="flex flex-col items-center">
            <label className="text-sm font-medium text-gray-700 mb-2">
              Overall Platform Rating
            </label>
            <div className="flex space-x-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  type="button"
                  key={star}
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHover(star)}
                  onMouseLeave={() => setHover(0)}
                  className="focus:outline-none transition-transform duration-150 hover:scale-110"
                >
                  <Star
                    size={32}
                    className={`${
                      star <= (hover || rating)
                        ? "fill-orange-500 text-orange-500"
                        : "text-gray-300"
                    } transition-colors duration-150`}
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Feedback Text Area */}
          <div>
            <label
              htmlFor="feedback"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Your Thoughts & Suggestions
            </label>
            <textarea
              id="feedback"
              rows="4"
              required
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              placeholder="Tell us what you liked or what we can improve..."
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none text-gray-800 transition text-sm"
            ></textarea>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 px-6 rounded-lg transition duration-300 flex items-center justify-center space-x-2 shadow-md hover:shadow-lg disabled:opacity-50"
          >
            <span>{loading ? "Submitting..." : "Submit Feedback"}</span>
            <Send size={18} />
          </button>
        </form>
      )}
    </div>
  );
}