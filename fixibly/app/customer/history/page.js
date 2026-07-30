// app/categories/page.js
import Navbar from "@/app/components/navbar";
import HistorySection from "./historySection";
import Footer from "@/app/components/footer";

export default function HistoryPage() {
  return (
    <main>
      <Navbar />
      <div className="pt-8">
        < HistorySection/>
      </div>
      <Footer />
    </main>
  );
}