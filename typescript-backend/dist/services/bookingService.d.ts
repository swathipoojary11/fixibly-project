type IdType = string | number;
type BookingSummaryParams = {
    problemId?: IdType | null;
    isCustomProblem?: boolean;
    emergencyFlag?: boolean;
};
type BookingSummaryResult = {
    basePrice: number | null;
    emergencyCharge: number;
    advanceAmount: number;
    grandTotal: number | null;
    priceMessage: string;
};
type BookingPayload = {
    categoryId: IdType;
    problemId?: IdType | null;
    isCustomProblem?: boolean;
    emergencyFlag?: boolean;
    emergencyReason?: string | null;
    issueDescription?: string | null;
    customProblemDescription?: string | null;
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
    [key: string]: any;
};
declare class BookingService {
    calculateBookingSummary(params: BookingSummaryParams): Promise<BookingSummaryResult>;
    createCustomerBooking(customerId: IdType | undefined, payload: BookingPayload): Promise<any>;
    getBookingDetails(bookingId: IdType): Promise<any>;
    getTrackingDetails(bookingId: IdType): Promise<any>;
    cancelCustomerBooking(bookingId: IdType, userId: IdType | undefined, reason?: string): Promise<any>;
    completeCustomerBooking(bookingId: IdType, userId: IdType | undefined): Promise<any>;
    submitTechnicianFeedback(bookingId: IdType, customerId: IdType | undefined, feedbackData: any): Promise<any>;
    submitPlatformFeedback(customerId: IdType | undefined, rating: number | string, comments?: string): Promise<any>;
    getCustomerBookingHistory(userId: IdType | undefined): Promise<any>;
    getNotifications(userId: IdType | undefined): Promise<any>;
    markNotificationRead(notificationId: IdType, userId?: IdType): Promise<any>;
}
declare const bookingService: BookingService;
export default bookingService;
//# sourceMappingURL=bookingService.d.ts.map