"use client";

import { useState } from "react";
import { Star, Send } from "lucide-react";

export default function FeedbackForm() {
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [feedback, setFeedback] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Logic for database or API submission goes here
    if (rating > 0 && feedback.trim() !== "") {
      setSubmitted(true);
    }
  };

  return (
    <div className="max-w-xl mx-auto bg-white p-8 rounded-xl shadow-md border border-gray-100">
      <h3 className="text-2xl font-bold text-gray-900 text-center">
        We Value Your Feedback
      </h3>
      <p className="text-gray-600 text-center mt-2 text-sm">
        Please let us know about your overall experience.
      </p>

      {submitted ? (
        <div className="mt-8 text-center bg-green-50 text-green-700 p-6 rounded-lg border border-green-200">
          <h4 className="font-semibold text-lg">Thank you!</h4>
          <p className="text-sm mt-1">Your feedback has been submitted successfully.</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="mt-6 space-y-6">
          {/* Star Rating Section */}
          <div className="flex flex-col items-center">
            <label className="text-sm font-medium text-gray-700 mb-2">
              Overall Rating
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
              Your Thoughts
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
            className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 px-6 rounded-lg transition duration-300 flex items-center justify-center space-x-2 shadow-md hover:shadow-lg"
          >
            <span>Submit Feedback</span>
            <Send size={18} />
          </button>
        </form>
      )}
    </div>
  );
}