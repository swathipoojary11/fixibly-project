import { Request, Response } from 'express';
type AuthenticatedUser = {
    user_id?: string | number;
    id?: string | number;
};
type AuthRequest = Request & {
    user?: AuthenticatedUser;
};
export declare const getCustomerDashboard: (req: AuthRequest, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const getProfile: (req: AuthRequest, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const getServiceCategories: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const getServiceProblems: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const getBookingInitData: (req: AuthRequest, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const getBookingSummary: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const createBooking: (req: AuthRequest, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const getBookingById: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const getBookingTracking: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const cancelBooking: (req: AuthRequest, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const completeBooking: (req: AuthRequest, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const submitFeedback: (req: AuthRequest, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const submitPlatformFeedback: (req: AuthRequest, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const getCustomerHistory: (req: AuthRequest, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const getNotifications: (req: AuthRequest, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const markNotificationRead: (req: AuthRequest, res: Response) => Promise<Response<any, Record<string, any>>>;
export {};
//# sourceMappingURL=customerController.d.ts.map