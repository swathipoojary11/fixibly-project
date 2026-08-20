// app/customercategories/page.js
import Navbar from "@/app/components/navbar";
import CategorySection from "./categorySection";
import Footer from "@/app/components/footer";

export default function CategoriesPage() {
  return (
    <main>
      <Navbar />
      <div className="pt-8">
        <CategorySection />
      </div>
      <Footer />
    </main>
  );
}