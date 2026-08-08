"use client";

// fixibly/app/customer/categories/categorySection.js
// Dynamic Service Categories section with safe response parsing

import { Wrench, Zap, Wind, Hammer, Sparkles, Droplets, Trees, Bug, Paintbrush } from "lucide-react";
import { useEffect, useState } from "react";
import CategoryCard from "./categoryCard";

// Helper map to dynamically attach Lucide icons based on Category Name
const getCategoryIcon = (categoryName = "") => {
  const name = categoryName.toLowerCase();
  if (name.includes("plumb")) return <Droplets size={28} color="white" />;
  if (name.includes("electric")) return <Zap size={28} color="white" />;
  if (name.includes("hvac") || name.includes("ac")) return <Wind size={28} color="white" />;
  if (name.includes("handyman")) return <Hammer size={28} color="white" />;
  if (name.includes("clean")) return <Sparkles size={28} color="white" />;
  if (name.includes("landscape") || name.includes("garden")) return <Trees size={28} color="white" />;
  if (name.includes("pest")) return <Bug size={28} color="white" />;
  if (name.includes("paint")) return <Paintbrush size={28} color="white" />;
  return <Wrench size={28} color="white" />;
};

export default function CategorySection() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch active service categories from GET /api/customer/services
  useEffect(() => {
    async function fetchCategoriesFromDB() {
      try {
        const token = localStorage.getItem("token") || localStorage.getItem("accessToken");
        
        const response = await fetch("http://localhost:5000/api/customer/services", {
          headers: {
            "Content-Type": "application/json",
            ...(token && { Authorization: `Bearer ${token}` }),
          },
        });

        const result = await response.json();

        if (result.success) {
          // Safely extract categories array from result.categories or result.data
          const rawCategories = result.categories || result.data || [];
          
          const formattedCategories = rawCategories.map((cat) => ({
            id: cat.category_id,
            title: cat.category_name,
            description: cat.description || `Professional ${cat.category_name} repair & installation services`,
            image: cat.category_image_url || "https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=800&q=80",
            icon: getCategoryIcon(cat.category_name),
          }));

          setCategories(formattedCategories);
        } else {
          setError(result.message || "Failed to load service categories.");
        }
      } catch (err) {
        console.error("Error fetching categories:", err);
        setError("Unable to connect to server.");
      } finally {
        setLoading(false);
      }
    }

    fetchCategoriesFromDB();
  }, []);

  if (loading) {
    return (
      <section className="py-24 bg-gray-50 text-center">
        <p className="text-xl font-semibold text-gray-600">Loading service categories...</p>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-24 bg-gray-50 text-center">
        <p className="text-xl font-semibold text-red-500">{error}</p>
      </section>
    );
  }

  return (
    <section className="py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <span className="text-orange-500 font-semibold uppercase tracking-widest">
            Our Services
          </span>
          <h2 className="text-5xl font-bold mt-4 text-gray-900">
            Choose a Service Category
          </h2>
          <p className="mt-6 text-gray-600 max-w-2xl mx-auto">
            Select the service you need and continue to the booking process with trusted professionals.
          </p>
        </div>

        {categories.length === 0 ? (
          <p className="text-center text-gray-500">No service categories available right now.</p>
        ) : (
          <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-3">
            {categories.map((category) => (
              <CategoryCard
                key={category.id}
                {...category}
                // ... this is javascript spread operator so it will directly pass all the properties of the category object to the CategoryCard component
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
