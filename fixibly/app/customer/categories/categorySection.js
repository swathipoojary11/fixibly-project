"use client";
import { Wrench, Zap, Wind,Hammer, Sparkles, Droplets, Trees, Bug, Paintbrush, Home,} from "lucide-react";
import CategoryCard from "./categoryCard";
const categories = [
  {
    id: "plumbing",
    title: "Plumbing Services",
    description:
      "Fix leaks, unclog drains, repair pipes and water heaters with verified professionals.",
    image:
      "https://trusteyman.com/wp-content/uploads/2019/02/how-does-plumbing-work-e1548696261445.jpeg",
    icon: <Droplets size={28} color="white" />,
  },

  {
    id: "electrical",
    title: "Electrical Services",
    description:
      "Repair wiring, install switches, lights and solve electrical issues safely.",
    image:
      "https://www.goconstruct.org/media/roqhffis/electrician-ss2293986793.jpg?width=1600&height=900&format=WebP&quality=75&v=1db885fa6ba75f0",
    icon: <Zap size={28} color="white" />,
  },

  {
    id: "hvac",
    title: "HVAC Services",
    description:
      "Installation, repair and maintenance of AC, heating and ventilation systems.",
    image:
      "https://cdn.britannica.com/16/249616-050-1A50A12E/HVAC-mechanical-system-technician.jpg",
    icon: <Wind size={28} color="white" />,
  },

  {
    id: "handyman",
    title: "Handyman Services",
    description:
      "General repairs, furniture assembly and small household maintenance jobs.",
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSnbkNX2ae-NV0eN_dOCp6qD-oRKrA32f3zEiPe01KiXc7_68Hith2Z_c8&s=10",
    icon: <Hammer size={28} color="white" />,
  },

  {
    id: "house-cleaning",
    title: "House Cleaning",
    description:
      "Deep cleaning, regular housekeeping and post-construction cleaning services.",
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRTZbBjLonZsVsyObXfJhO14Al9lAShWlCSqLH3L-HFeQ&s=10",
    icon: <Sparkles size={28} color="white" />,
  },

  {
    id: "exterior-cleaning",
    title: "Exterior Cleaning",
    description:
      "Window cleaning, power washing and gutter cleaning for your home.",
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSNQUqvqrHZlqtH9egzrnZVCtPcfwelcRXWlxnHGUnqZyd-oZcDJHMqZVk&s=10",
    icon: <Home size={28} color="white" />,
  },

  {
    id: "landscaping",
    title: "Landscaping",
    description:
      "Garden care, lawn mowing, trimming and outdoor maintenance services.",
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSb8SH43XK1-2CwO8c6oyG31uQ-H4oMCtyBzHJ-3qt1Fg&s=10",
    icon: <Trees size={28} color="white" />,
  },

  {
    id: "pest-control",
    title: "Pest Control",
    description:
      "Protect your home from insects, rodents and termites using safe methods.",
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSSGwE4TC9d9kBgRPlyK__zotYvs9aHnkUJBdIn0uy_gyD9y6vcOgO6088&s=10",
    icon: <Bug size={28} color="white" />,
  },

  {
    id: "remodeling",
    title: "General Remodeling",
    description:
      "Room renovation, home improvement and structural modification services.",
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQAKIFTdEIy8x1xMTaoTujnE8il3nfmvvd0D7E6z1HTBg&s=10",
    icon: <Wrench size={28} color="white" />,
  },

  {
    id: "painting",
    title: "Painting & Decorating",
    description:
      "Interior and exterior painting, wallpaper installation and decorative finishes.",
    image:
      "https://content3.jdmagicbox.com/comp/mangalore/a6/0824px824.x824.181126185507.a4a6/catalogue/colours-house-painting-mangalore-painting-contractors-0a9kvcsnnh.jpeg",
    icon: <Paintbrush size={28} color="white" />,
  },
];

export default function CategorySection() {
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
                        Select the service you need and continue to the booking
                        process with trusted professionals.
                    </p>
                </div>
                <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-3">
                    {categories.map((category) => (
                        <CategoryCard
                            key={category.id}
                            {...category}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
}

// "use client";

// import { useState, useEffect } from "react";
// import { Wrench, Zap, Wind, Hammer, Sparkles, Droplets, Trees, Bug, Paintbrush, Home } from "lucide-react";
// import CategoryCard from "./categoryCard";

// const getCategoryIcon = (name = "") => {
//   const lower = name.toLowerCase();
//   if (lower.includes("plumb")) return <Droplets size={28} color="white" />;
//   if (lower.includes("electr")) return <Zap size={28} color="white" />;
//   if (lower.includes("hvac") || lower.includes("ac")) return <Wind size={28} color="white" />;
//   if (lower.includes("handy")) return <Hammer size={28} color="white" />;
//   if (lower.includes("clean")) return <Sparkles size={28} color="white" />;
//   if (lower.includes("exter")) return <Home size={28} color="white" />;
//   if (lower.includes("land") || lower.includes("garden")) return <Trees size={28} color="white" />;
//   if (lower.includes("pest")) return <Bug size={28} color="white" />;
//   if (lower.includes("paint")) return <Paintbrush size={28} color="white" />;
//   return <Wrench size={28} color="white" />;
// };

// export default function CategorySection() {
//   const [categories, setCategories] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [apiError, setApiError] = useState(null);

//   useEffect(() => {
//     const fetchCategories = async () => {
//       try {
//         console.log("Fetching categories from http://localhost:5000/api/customer/services...");
//         const response = await fetch("http://localhost:5000/api/customer/services");
        
//         if (!response.ok) {
//           throw new Error(`HTTP error! Status: ${response.status}`);
//         }

//         const data = await response.json();
//         console.log("Fetched Data:", data);

//         if (data.success && Array.isArray(data.categories)) {
//           const formattedCategories = data.categories.map((cat) => ({
//             id: cat.category_id,
//             title: cat.category_name,
//             description: cat.description || "Professional service provided by verified local technicians.",
//             image: cat.category_image_url || "https://trusteyman.com/wp-content/uploads/2019/02/how-does-plumbing-work-e1548696261445.jpeg",
//             icon: getCategoryIcon(cat.category_name),
//           }));
//           setCategories(formattedCategories);
//         } else {
//           setApiError("API returned failure response or empty categories array.");
//         }
//       } catch (error) {
//         console.error("FAILED TO FETCH CATEGORIES:", error);
//         setApiError(error.message);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchCategories();
//   }, []);

//   return (
//     <section className="py-24 bg-gray-50">
//       <div className="max-w-7xl mx-auto px-6">
//         <div className="text-center mb-16">
//           <span className="text-orange-500 font-semibold uppercase tracking-widest">
//             Our Services
//           </span>
//           <h2 className="text-5xl font-bold mt-4 text-gray-900">
//             Choose a Service Category
//           </h2>
//           <p className="mt-6 text-gray-600 max-w-2xl mx-auto">
//             Select the service you need and continue to the booking
//             process with trusted professionals.
//           </p>
//         </div>

//         {loading ? (
//           <div className="text-center py-12 text-gray-500 font-semibold text-lg">
//             Loading categories from database...
//           </div>
//         ) : apiError ? (
//           <div className="text-center py-12 text-red-500 font-semibold text-lg bg-red-50 rounded-xl border border-red-200">
//             Error: {apiError}
//             <p className="text-xs text-gray-600 mt-2">Make sure Express server is running on port 5000 and CORS is enabled.</p>
//           </div>
//         ) : categories.length === 0 ? (
//           <div className="text-center py-12 text-gray-500 font-semibold text-lg">
//             No active categories available right now.
//           </div>
//         ) : (
//           <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-3">
//             {categories.map((category) => (
//               <CategoryCard
//                 key={category.id}
//                 {...category}
//               />
//             ))}
//           </div>
//         )}
//       </div>
//     </section>
//   );
// }