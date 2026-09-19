import { Request, Response } from 'express';
type DbRecord = Record<string, any>;
export declare const getRoleCounts: (users?: DbRecord[]) => {
    customers: number;
    dispatchers: number;
};
export declare const getAdminDashboardOverview: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const getAdminDashboardStats: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const getAdminReports: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const getAdminDashboardAnalytics: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const getAdminUsers: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export {};
//# sourceMappingURL=adminController.d.ts.map