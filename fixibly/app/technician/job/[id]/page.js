"use client";
import Footer from "../../../components/footer";
import JobDetails from "../../../components/technician/JobDetails";

export default function JobDetailsPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <div className="flex-1">
        <JobDetails />
      </div>
      <Footer />
    </div>
  );
}
