"use client";

import { useState, useEffect } from "react";
import { Wrench, Zap, Wind, Hammer, Sparkles, Droplets, Trees, Bug, Paintbrush, Home } from "lucide-react";
import CategoryCard from "./categoryCard";

const getCategoryIcon = (name = "") => {
  const lower = name.toLowerCase();
  if (lower.includes("plumb")) return <Droplets size={28} color="white" />;
  if (lower.includes("electr")) return <Zap size={28} color="white" />;
  if (lower.includes("hvac") || lower.includes("ac")) return <Wind size={28} color="white" />;
  if (lower.includes("handy")) return <Hammer size={28} color="white" />;
  if (lower.includes("clean")) return <Sparkles size={28} color="white" />;
  if (lower.includes("exter")) return <Home size={28} color="white" />;
  if (lower.includes("land") || lower.includes("garden")) return <Trees size={28} color="white" />;
  if (lower.includes("pest")) return <Bug size={28} color="white" />;
  if (lower.includes("paint")) return <Paintbrush size={28} color="white" />;
  return <Wrench size={28} color="white" />;
};

export default function CategorySection() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [apiError, setApiError] = useState(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/customer/services");
        
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();

        if (data.success && Array.isArray(data.categories)) {
          const formattedCategories = data.categories.map((cat) => ({
            id: cat.category_id,
            title: cat.category_name,
            description: cat.description || "Professional home repair & maintenance service.",
            image: cat.category_image_url || "https://trusteyman.com/wp-content/uploads/2019/02/how-does-plumbing-work-e1548696261445.jpeg",
            icon: getCategoryIcon(cat.category_name),
          }));
          setCategories(formattedCategories);
        } else {
          setApiError("Unable to load service categories.");
        }
      } catch (error) {
        setApiError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  return (
    <section className="py-20 bg-slate-50" id="services">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <span className="text-orange-500 font-bold uppercase tracking-widest text-xs">
            Our Services
          </span>
          <h2 className="text-4xl font-extrabold mt-2 text-slate-900 tracking-tight">
            Choose a Service Category
          </h2>
          <p className="mt-4 text-slate-600 max-w-2xl mx-auto text-sm">
            Select the service category you need to explore problems and request instant booking.
          </p>
        </div>

        {loading ? (
          <div className="text-center py-16 text-slate-500 font-semibold text-sm flex items-center justify-center gap-2">
            <span className="w-5 h-5 border-2 border-orange-500 border-t-transparent rounded-full animate-spin"></span>
            Loading service categories...
          </div>
        ) : apiError ? (
          <div className="text-center py-12 text-red-600 font-semibold text-sm bg-red-50 rounded-xl border border-red-200 max-w-xl mx-auto p-6">
            <p>Error loading categories: {apiError}</p>
            <button 
              onClick={() => window.location.reload()} 
              className="mt-3 px-4 py-1.5 bg-red-600 text-white rounded-lg text-xs font-bold hover:bg-red-700 transition-all"
            >
              Retry
            </button>
          </div>
        ) : categories.length === 0 ? (
          <div className="text-center py-12 text-slate-500 font-semibold text-sm">
            No active categories available.
          </div>
        ) : (
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {categories.map((category) => (
              <CategoryCard
                key={category.id}
                {...category}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}