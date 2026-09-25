import { Request, Response } from "express";
import * as technicianService from "../services/technicianService.js";

// ======================================================
// USER TYPE
// ======================================================

interface AuthenticatedUser {
    user_id: number;
    technician_id: number;
}

interface AuthenticatedRequest extends Request {
    user: AuthenticatedUser;
}

// ======================================================
// PROFILE
// ======================================================

export const profile = async (
    req: AuthenticatedRequest,
    res: Response
): Promise<void> => {
    try {
        const user = req.user;

        const data = await technicianService.getProfile(
            user.user_id
        );

        res.json({
            success: true,
            data
        });
    } catch (err: unknown) {
        const message =
            err instanceof Error ? err.message : "Something went wrong";

        res.status(500).json({
            success: false,
            message
        });
    }
};

// ======================================================
// SERVICE CATEGORIES
// ======================================================

export const serviceCategories = async (
    req: Request,
    res: Response
): Promise<void> => {
    try {
        const data =
            await technicianService.getServiceCategories();

        res.json({
            success: true,
            data
        });
    } catch (err: unknown) {
        const message =
            err instanceof Error ? err.message : "Something went wrong";

        res.status(500).json({
            success: false,
            message
        });
    }
};

// ======================================================
// UPDATE SERVICE CATEGORY
// ======================================================

export const updateCategory = async (
    req: AuthenticatedRequest,
    res: Response
): Promise<void> => {
    try {
        const user = req.user;

        const data =
            await technicianService.updateServiceCategory(
                user.technician_id,
                req.body.category_id
            );

        res.json({
            success: true,
            data
        });
    } catch (err: unknown) {
        const message =
            err instanceof Error ? err.message : "Something went wrong";

        res.status(500).json({
            success: false,
            message
        });
    }
};

// ======================================================
// ASSIGNED JOBS
// ======================================================

const jobs = async (
    req: AuthenticatedRequest,
    res: Response
): Promise<void> => {
    try {
        const user = req.user;

        const data = await technicianService.getJobs(
            user.technician_id
        );

        res.status(200).json({
            success: true,
            data
        });
    } catch (err: unknown) {
        const message =
            err instanceof Error ? err.message : "Something went wrong";

        res.status(500).json({
            success: false,
            message
        });
    }
};

// ======================================================
// EMERGENCY JOBS
// ======================================================

const emergency = async (
    req: Request,
    res: Response
): Promise<void> => {
    try {
        const data =
            await technicianService.getEmergencyJobs();

        res.status(200).json({
            success: true,
            data
        });
    } catch (err: unknown) {
        const message =
            err instanceof Error ? err.message : "Something went wrong";

        res.status(500).json({
            success: false,
            message
        });
    }
};

// ======================================================
// ACCEPT JOB
// ======================================================

const accept = async (
    req: AuthenticatedRequest,
    res: Response
): Promise<void> => {
    try {
        const user = req.user;

        const data = await technicianService.acceptJob(
            user.technician_id,
            req.params.id as string
        );

        res.status(200).json({
            success: true,
            message: "Job accepted successfully.",
            data
        });
    } catch (err: unknown) {
        const message =
            err instanceof Error ? err.message : "Something went wrong";

        res.status(500).json({
            success: false,
            message
        });
    }
};

// ======================================================
// REJECT JOB
// ======================================================

const reject = async (
    req: AuthenticatedRequest,
    res: Response
): Promise<void> => {
    try {
        const user = req.user;

        const data = await technicianService.rejectJob(
            user.technician_id,
            req.params.id as string
        );

        res.status(200).json({
            success: true,
            message: "Job rejected successfully.",
            data
        });
    } catch (err: unknown) {
        const message =
            err instanceof Error ? err.message : "Something went wrong";

        res.status(500).json({
            success: false,
            message
        });
    }
};

// ======================================================
// UPDATE STATUS
// ======================================================

const jobStatus = async (
    req: Request,
    res: Response
): Promise<void> => {
    try {
        const data =
            await technicianService.updateJobStatus(
                req.params.id as string,
                req.body.status
            );

        res.status(200).json({
            success: true,
            message: "Status updated.",
            data
        });
    } catch (err: unknown) {
        const message =
            err instanceof Error ? err.message : "Something went wrong";

        res.status(500).json({
            success: false,
            message
        });
    }
};

// ======================================================
// UPDATE AVAILABILITY
// ======================================================

const availability = async (
    req: AuthenticatedRequest,
    res: Response
): Promise<void> => {
    try {
        const user = req.user;

        const data =
            await technicianService.updateAvailability(
                user.technician_id,
                req.body.status
            );

        res.status(200).json({
            success: true,
            message: "Availability updated successfully.",
            data
        });
    } catch (err: unknown) {
        const message =
            err instanceof Error ? err.message : "Something went wrong";

        res.status(500).json({
            success: false,
            message
        });
    }
};

// ======================================================
// UPDATE LOCATION
// ======================================================

const location = async (
    req: AuthenticatedRequest,
    res: Response
): Promise<void> => {
    try {
        const user = req.user;

        const data =
            await technicianService.updateLocation(
                user.technician_id,
                req.body.latitude,
                req.body.longitude
            );

        res.status(200).json({
            success: true,
            message: "Location updated successfully.",
            data
        });
    } catch (err: unknown) {
        const message =
            err instanceof Error ? err.message : "Something went wrong";

        res.status(500).json({
            success: false,
            message
        });
    }
};

// ======================================================
// ACCEPT EMERGENCY
// ======================================================

const acceptEmergency = async (
    req: AuthenticatedRequest,
    res: Response
): Promise<void> => {
    try {
        const user = req.user;

        const data =
            await technicianService.acceptEmergency(
                user.technician_id,
                req.params.id as string
            );

        res.status(200).json({
            success: true,
            message: "Emergency job accepted successfully.",
            data
        });
    } catch (err: unknown) {
        const message =
            err instanceof Error ? err.message : "Something went wrong";

        res.status(500).json({
            success: false,
            message
        });
    }
};

// ======================================================
// NOTIFICATIONS
// ======================================================

const notifications = async (
    req: AuthenticatedRequest,
    res: Response
): Promise<void> => {
    try {
        const user = req.user;

        const data =
            await technicianService.getNotifications(
                user.user_id
            );

        res.status(200).json({
            success: true,
            data
        });
    } catch (err: unknown) {
        const message =
            err instanceof Error ? err.message : "Something went wrong";

        res.status(500).json({
            success: false,
            message
        });
    }
};

// ======================================================
// MARK NOTIFICATION READ
// ======================================================

const notificationRead = async (
    req: Request,
    res: Response
): Promise<void> => {
    try {
        const data =
            await technicianService.markNotificationRead(
                req.params.id as string
            );

        res.status(200).json({
            success: true,
            message: "Notification marked as read.",
            data
        });
    } catch (err: unknown) {
        const message =
            err instanceof Error ? err.message : "Something went wrong";

        res.status(500).json({
            success: false,
            message
        });
    }
};

// ======================================================
// COMPLETE JOB
// ======================================================

const completeJob = async (
    req: Request,
    res: Response
): Promise<void> => {
    try {
        const data =
            await technicianService.completeJob(
                req.params.id as string
            );

        res.status(200).json({
            success: true,
            message: "Job completed successfully.",
            data
        });
    } catch (err: unknown) {
        const message =
            err instanceof Error ? err.message : "Something went wrong";

        res.status(400).json({
            success: false,
            message
        });
    }
};

// ======================================================
// EXPORTS
// ======================================================

export {
    jobs,
    emergency,
    accept,
    reject,
    jobStatus,
    availability,
    location,
    acceptEmergency,
    notifications,
    notificationRead,
    completeJob
};