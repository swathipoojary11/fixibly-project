import Navbar from "@/app/components/navbar";
import Footer from "@/app/components/footer";

import FeedbackHero from "@/app/components/feedback/FeedbackHero";
import TechnicianCard from "@/app/components/feedback/TechnicianCard";
import RatingSection from "@/app/components/feedback/RatingSection";
import ChecklistSection from "@/app/components/feedback/ChecklistSection";
import CommentSection from "@/app/components/feedback/CommentSection";
import RecommendationSection from "@/app/components/feedback/RecommendationSection";
import SubmitSection from "@/app/components/feedback/SubmitSection";

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