"use client";
//import { useState } from 'react';
import { useRouter } from 'next/navigation';
export default function CategoryCard({
  id,
  title,
  description,
  image,
  icon,
})
{
   const router = useRouter(); 

  const handleBookNow = () => {
    // Pass categoryId in the URL query so the Booking Page knows which category was selected!
    router.push(`/customer/booking?categoryId=${id}`);
  };
  return (
    <div className="group bg-white rounded-xl shadow-md overflow-hidden hover:shadow-2xl transition duration-300">

      <div className="relative h-60 overflow-hidden">
        <img
          src={image}
          alt={title}
          className="w-full h-full object-cover group-hover:scale-110 transition duration-500"
        />
       {icon && (
          <div className="absolute -bottom-8 right-6 bg-orange-500 h-16 w-16 rounded-full flex items-center justify-center shadow-lg border-4 border-white">
            {icon}
          </div>
        )}
      
      </div>
      <div className="p-7">

        <h2 className="text-2xl font-bold text-gray-900">
          {title}
        </h2>

        <p className="text-gray-600 mt-4 leading-7">
          {description}
        </p>
 <button onClick={handleBookNow} className="mt-8 border border-black px-6 py-3 rounded-lg font-semibold hover:bg-orange-500 hover:text-white hover:border-orange-500 transition">
            Book Now 
          </button>
      </div>
    </div>
  );
}
