// backend/src/controllers/technicianController.ts

import { Request, Response } from "express";

// Safe import: works whether technicianService is already .ts or still .js
const technicianService = require("../services/technicianService");

// ======================================================
// 1. DATA TYPES
// ======================================================

type IdType = string | number;

// User object attached by authMiddleware
type TechnicianUser = {
  user_id?: IdType;
  technician_id?: IdType;
  id?: IdType;
};

// Extended Express Request
type TechRequest = Request & {
  user?: TechnicianUser;
};

// Body payload types
type UpdateCategoryBody = {
  category_id?: IdType;
};

type JobStatusBody = {
  status?: string;
};

type AvailabilityBody = {
  status?: "Available" | "Busy" | "Offline";
};

type LocationBody = {
  latitude?: number;
  longitude?: number;
};

// Error type for catch blocks
type CustomError = {
  message?: string;
};

// ======================================================
// 2. PROFILE & CATEGORIES
// ======================================================

export const profile = async (req: TechRequest, res: Response) => {
  try {
    const userId = req.user?.user_id || req.user?.id;

    const data = await technicianService.getProfile(userId);

    return res.json({
      success: true,
      data
    });
  } catch (err) {
    const error = err as CustomError;

    return res.status(500).json({
      success: false,
      message: error.message || "Internal server error"
    });
  }
};

export const serviceCategories = async (req: Request, res: Response) => {
  try {
    const data = await technicianService.getServiceCategories();

    return res.json({
      success: true,
      data
    });
  } catch (err) {
    const error = err as CustomError;

    return res.status(500).json({
      success: false,
      message: error.message || "Internal server error"
    });
  }
};

export const updateCategory = async (req: TechRequest, res: Response) => {
  try {
    const techId = req.user?.technician_id;
    const body = req.body as UpdateCategoryBody;

    const data = await technicianService.updateServiceCategory(
      techId,
      body.category_id
    );

    return res.json({
      success: true,
      data
    });
  } catch (err) {
    const error = err as CustomError;

    return res.status(500).json({
      success: false,
      message: error.message || "Internal server error"
    });
  }
};

// ======================================================
// 3. JOB ASSIGNMENT & LIFECYCLE
// ======================================================

export const jobs = async (req: TechRequest, res: Response) => {
  try {
    const techId = req.user?.technician_id;

    const data = await technicianService.getJobs(techId);

    return res.status(200).json({
      success: true,
      data
    });
  } catch (err) {
    const error = err as CustomError;

    return res.status(500).json({
      success: false,
      message: error.message || "Internal server error"
    });
  }
};

export const emergency = async (req: Request, res: Response) => {
  try {
    const data = await technicianService.getEmergencyJobs();

    return res.status(200).json({
      success: true,
      data
    });
  } catch (err) {
    const error = err as CustomError;

    return res.status(500).json({
      success: false,
      message: error.message || "Internal server error"
    });
  }
};

// 1. Fixed req.params.id type assertion
export const accept = async (req: TechRequest, res: Response) => {
  try {
    const techId = req.user?.technician_id;
    const jobId = req.params.id as string;

    const data = await technicianService.acceptJob(techId, jobId);

    return res.status(200).json({
      success: true,
      message: "Job accepted successfully.",
      data
    });
  } catch (err) {
    const error = err as CustomError;

    return res.status(500).json({
      success: false,
      message: error.message || "Internal server error"
    });
  }
};

// 2. Fixed req.params.id type assertion
export const reject = async (req: TechRequest, res: Response) => {
  try {
    const techId = req.user?.technician_id;
    const jobId = req.params.id as string;

    const data = await technicianService.rejectJob(techId, jobId);

    return res.status(200).json({
      success: true,
      message: "Job rejected successfully.",
      data
    });
  } catch (err) {
    const error = err as CustomError;

    return res.status(500).json({
      success: false,
      message: error.message || "Internal server error"
    });
  }
};

// 3. Fixed req.params.id type assertion
export const jobStatus = async (req: TechRequest, res: Response) => {
  try {
    const jobId = req.params.id as string;
    const body = req.body as JobStatusBody;

    const data = await technicianService.updateJobStatus(jobId, body.status);

    return res.status(200).json({
      success: true,
      message: "Status updated.",
      data
    });
  } catch (err) {
    const error = err as CustomError;

    return res.status(500).json({
      success: false,
      message: error.message || "Internal server error"
    });
  }
};

// ======================================================
// 4. AVAILABILITY & TRACKING
// ======================================================

export const availability = async (req: TechRequest, res: Response) => {
  try {
    const techId = req.user?.technician_id;
    const body = req.body as AvailabilityBody;

    const data = await technicianService.updateAvailability(
      techId,
      body.status
    );

    return res.status(200).json({
      success: true,
      message: "Availability updated successfully.",
      data
    });
  } catch (err) {
    const error = err as CustomError;

    return res.status(500).json({
      success: false,
      message: error.message || "Internal server error"
    });
  }
};

export const location = async (req: TechRequest, res: Response) => {
  try {
    const techId = req.user?.technician_id;
    const body = req.body as LocationBody;

    const data = await technicianService.updateLocation(
      techId,
      body.latitude,
      body.longitude
    );

    return res.status(200).json({
      success: true,
      message: "Location updated successfully.",
      data
    });
  } catch (err) {
    const error = err as CustomError;

    return res.status(500).json({
      success: false,
      message: error.message || "Internal server error"
    });
  }
};

// 4. Fixed req.params.id type assertion
export const acceptEmergency = async (req: TechRequest, res: Response) => {
  try {
    const techId = req.user?.technician_id;
    const jobId = req.params.id as string;

    const data = await technicianService.acceptEmergency(techId, jobId);

    return res.status(200).json({
      success: true,
      message: "Emergency job accepted successfully.",
      data
    });
  } catch (err) {
    const error = err as CustomError;

    return res.status(500).json({
      success: false,
      message: error.message || "Internal server error"
    });
  }
};

// ======================================================
// 5. NOTIFICATIONS & COMPLETION
// ======================================================

export const notifications = async (req: TechRequest, res: Response) => {
  try {
    const userId = req.user?.user_id || req.user?.id;

    const data = await technicianService.getNotifications(userId);

    return res.status(200).json({
      success: true,
      data
    });
  } catch (err) {
    const error = err as CustomError;

    return res.status(500).json({
      success: false,
      message: error.message || "Internal server error"
    });
  }
};

// 5. Fixed req.params.id type assertion
export const notificationRead = async (req: Request, res: Response) => {
  try {
    const notificationId = req.params.id as string;

    const data = await technicianService.markNotificationRead(notificationId);

    return res.status(200).json({
      success: true,
      message: "Notification marked as read.",
      data
    });
  } catch (err) {
    const error = err as CustomError;

    return res.status(500).json({
      success: false,
      message: error.message || "Internal server error"
    });
  }
};

// 6. Fixed req.params.id type assertion
export const completeJob = async (req: TechRequest, res: Response) => {
  try {
    const jobId = req.params.id as string;

    const data = await technicianService.completeJob(jobId);

    return res.status(200).json({
      success: true,
      message: "Job completed successfully.",
      data
    });
  } catch (err) {
    const error = err as CustomError;

    return res.status(400).json({
      success: false,
      message: error.message || "Bad Request"
    });
  }
};