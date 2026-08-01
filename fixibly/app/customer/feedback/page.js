import Navbar from "@/app/components/navbar";
import Footer from "@/app/components/footer";

import FeedbackHero from "@/app/components/customers/feedback/FeedbackHero";
import TechnicianCard from "@/app/components/customers/feedback/TechnicianCard";
import RatingSection from "@/app/components/customers/feedback/RatingSection";
import ChecklistSection from "@/app/components/customers/feedback/ChecklistSection";
import CommentSection from "@/app/components/customers/feedback/CommentSection";
import RecommendationSection from "@/app/components/customers/feedback/RecommendationSection";
import SubmitSection from "@/app/components/customers/feedback/SubmitSection";

export default function FeedbackPage() {
  return (
    <>
      <Navbar />

      <main className="bg-gray-100 min-h-screen py-12">

        <div className="max-w-7xl mx-auto px-6">

          <FeedbackHero />

          <TechnicianCard />

          <RatingSection />

          <ChecklistSection />

          <CommentSection />

          <RecommendationSection />

          <SubmitSection />

        </div>

      </main>

      <Footer />
    </>
  );
}