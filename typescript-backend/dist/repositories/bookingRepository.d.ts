type IdType = string | number;
type BookingData = {
    customerId: IdType;
    categoryId: IdType;
    problemId?: IdType | null;
    issueDescription?: string | null;
    customProblemDescription?: string | null;
    emergencyFlag?: boolean;
    emergencyReason?: string | null;
    preferredDate?: string | null;
    preferredTime?: string | null;
    anytimeService?: boolean;
    houseNumber?: string | null;
    apartmentName?: string | null;
    street?: string;
    area?: string;
    city?: string;
    state?: string;
    pincode?: string;
    estimatedAmount?: number | null;
    advanceAmount?: number;
};
type FeedbackData = {
    technicianId?: IdType | null;
    overallRating: number | string;
    professionalBehaviour: number | string;
    serviceQuality: number | string;
    timeliness: number | string;
    cleanliness: number | string;
    problemResolution: number | string;
    comments?: string;
};
declare class BookingRepository {
    getUserProfile(userId: IdType | undefined): Promise<any>;
    getCategoryById(categoryId: IdType): Promise<any>;
    getProblemById(problemId: IdType | null | undefined): Promise<any>;
    getCategoryProblems(categoryId: IdType): Promise<any>;
    getCustomerDashboard(userId: IdType | undefined): Promise<{
        customer: any;
        stats: {
            total: number;
            pending: number;
            active: number;
            completed: number;
            cancelled: number;
        };
        historyPreview: any[];
        notificationsCount: any;
        categories: any;
    }>;
    createBookingTransaction(bookingData: BookingData): Promise<any>;
    getBookingDetailsById(bookingId: IdType): Promise<any>;
    getBookingTrackingDetails(bookingId: IdType): Promise<{
        booking: any;
        statusHistory: any;
        technicianLocation: any;
    } | null>;
    cancelBookingById(bookingId: IdType, userId: IdType | undefined, cancellationReason?: string): Promise<any>;
    completeBookingById(bookingId: IdType, userId: IdType | undefined): Promise<any>;
    submitFeedback(bookingId: IdType, customerId: IdType | undefined, feedbackData: FeedbackData): Promise<any>;
    submitAppFeedback(customerId: IdType | undefined, rating: number | string, comments?: string): Promise<any>;
    getCustomerHistory(userId: IdType | undefined): Promise<any>;
    getCustomerNotifications(userId: IdType | undefined): Promise<any>;
    markNotificationAsRead(notificationId: IdType, userId?: IdType): Promise<any>;
}
declare const bookingRepository: BookingRepository;
export default bookingRepository;
//# sourceMappingURL=bookingRepository.d.ts.map