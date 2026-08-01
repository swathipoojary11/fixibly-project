"use client";

import { useRouter } from 'next/navigation';

export default function CategoryCard({
  id,
  title,
  description,
  image,
  icon,
}) {
  const router = useRouter(); 

  const handleBookNow = () => {
    router.push(`/customer/booking?categoryId=${id}&categoryName=${encodeURIComponent(title)}`);
  };

  return (
    <div className="group bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-xl transition-all duration-300 flex flex-col justify-between">
      <div>
        <div className="relative h-48 overflow-hidden">
          <img
            src={image}
            alt={title}
            className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
          />
          <div className="absolute -bottom-6 right-4 bg-orange-500 h-12 w-12 rounded-xl flex items-center justify-center shadow-lg border-2 border-white">
            {icon}
          </div>
        </div>

        <div className="p-6 pt-7">
          <h3 className="text-xl font-bold text-slate-900 tracking-tight">
            {title}
          </h3>

          <p className="text-slate-600 mt-2 text-xs leading-relaxed line-clamp-3">
            {description}
          </p>
        </div>
      </div>

      <div className="p-6 pt-0">
        <button 
          onClick={handleBookNow} 
          className="w-full mt-4 bg-orange-500 hover:bg-orange-600 text-white font-bold py-2.5 px-4 rounded-lg shadow-sm text-xs transition-all flex items-center justify-center gap-2"
        >
          Book {title}
        </button>
      </div>
    </div>
  );
}