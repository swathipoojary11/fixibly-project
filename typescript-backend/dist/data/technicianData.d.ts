type AvailabilityStatus = "Available" | "Busy" | "Offline";
type JobStatus = "Pending" | "Assigned" | "In Progress" | "Completed" | "Cancelled";
type JobPriority = "Normal" | "Emergency";
type Technician = {
    id: number;
    name: string;
    email: string;
    phone: string;
    category: string;
    availability: AvailabilityStatus;
    rating: number;
    latitude: number;
    longitude: number;
};
type Job = {
    bookingId: number;
    customer: string;
    address: string;
    problem: string;
    status: JobStatus;
    priority: JobPriority;
};
type EmergencyJob = {
    bookingId: number;
    customer: string;
    address: string;
    problem: string;
    status: JobStatus;
};
type Notification = {
    id: number;
    title: string;
    message: string;
    read: boolean;
};
declare const technician: Technician;
declare const jobs: Job[];
declare const emergencyJobs: EmergencyJob[];
declare const notifications: Notification[];
export type { Technician, Job, EmergencyJob, Notification };
export { technician, jobs, emergencyJobs, notifications };
//# sourceMappingURL=technicianData.d.ts.map