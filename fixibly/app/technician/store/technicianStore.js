"use client";
import { create } from "zustand";
import technicianData from "../data/technicianData";

const useTechnicianStore = create((set) => ({
  technician:   technicianData.technician,
  stats:        technicianData.stats,
  assignedJobs: technicianData.assignedJobs,
  emergencyJob: technicianData.emergencyJob,
  timeline:     technicianData.timeline,
  selectedJob:  null,
  availability: "Available",
  setSelectedJob:  (job)    => set({ selectedJob: job }),
  setAvailability: (status) => set({ availability: status }),
}));

export default useTechnicianStore;
