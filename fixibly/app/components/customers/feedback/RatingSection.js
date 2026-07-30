"use client";

import { useState } from "react";
import { Star } from "lucide-react";

export default function RatingSection() {

  const [rating, setRating] = useState(0);

  return (

    <section className="bg-white rounded-3xl shadow-xl p-10 mb-10">

      <span className="uppercase tracking-widest text-orange-500 font-semibold">

        Overall Experience

      </span>

      <h2 className="text-4xl font-bold mt-3">

        How was your service?

      </h2>

      <p className="text-gray-500 mt-3">

        Rate your overall experience with our technician.

      </p>

      <div className="flex gap-5 mt-10">

        {[1,2,3,4,5].map((star)=> (

          <button
            key={star}
            onClick={()=>setRating(star)}
          >

            <Star

              size={55}

              className={`transition

              ${
                rating>=star
                ? "fill-orange-500 text-orange-500 scale-110"
                : "text-gray-300 hover:text-orange-400"
              }

              `}

            />

          </button>

        ))}

      </div>

      <div className="mt-8">

        {rating===0 &&

        <p className="text-gray-500">

          Select your rating.

        </p>

        }

        {rating===1 &&

        <p className="text-red-500 font-semibold">

          We're sorry to hear that.

        </p>

        }

        {rating===2 &&

        <p className="text-orange-500 font-semibold">

          We'll improve our services.

        </p>

        }

        {rating===3 &&

        <p className="text-yellow-500 font-semibold">

          Thanks for your feedback.

        </p>

        }

        {rating===4 &&

        <p className="text-green-500 font-semibold">

          Glad you liked our service.

        </p>

        }

        {rating===5 &&

        <p className="text-green-600 font-bold">

          Awesome! Thank you for trusting FieldFlow ❤️

        </p>

        }

      </div>

    </section>

  );

}