export type BookingStatus = "Pending" | "Assigned" | "In Progress" | "On The Way" | "Completed" | "Cancelled" | string;
export type RoleName = "Customer" | "Dispatcher" | "Technician" | "Admin" | "Unknown" | string;
export type AvailabilityStatus = "Available" | "Busy" | "Offline" | string;
export declare const normalizeBookingStatus: (status?: string | null) => BookingStatus;
export declare const normalizeRoleName: (role?: string | null) => RoleName;
export declare const normalizeAvailability: (value?: string | null) => AvailabilityStatus;
declare const _default: {
    normalizeBookingStatus: (status?: string | null) => BookingStatus;
    normalizeRoleName: (role?: string | null) => RoleName;
    normalizeAvailability: (value?: string | null) => AvailabilityStatus;
};
export default _default;
//# sourceMappingURL=normalizers.d.ts.map