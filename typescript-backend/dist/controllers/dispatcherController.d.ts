import { Request, Response } from 'express';
type IdType = string | number;
type AuthRequest = Request & {
    user?: {
        user_id?: IdType;
        id?: IdType;
    };
};
export declare const assignTechnician: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const reassignTechnician: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const getDispatcherProfile: (req: AuthRequest, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const updateBookingStatus: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const getDispatcherDashboardStats: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const searchCustomers: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const searchCustomerByPhone: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const triggerEmergencyBroadcast: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const createManualBooking: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const downgradeEmergency: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const getTechnicianSummaryStats: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const getActiveBookingsWithLocation: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const acceptEmergencyBroadcast: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export {};
//# sourceMappingURL=dispatcherController.d.ts.map