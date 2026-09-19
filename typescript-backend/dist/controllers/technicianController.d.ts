import { Request, Response } from "express";
type IdType = string | number;
type TechnicianUser = {
    user_id?: IdType;
    technician_id?: IdType;
    id?: IdType;
};
type TechRequest = Request & {
    user?: TechnicianUser;
};
export declare const profile: (req: TechRequest, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const serviceCategories: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const updateCategory: (req: TechRequest, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const jobs: (req: TechRequest, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const emergency: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const accept: (req: TechRequest, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const reject: (req: TechRequest, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const jobStatus: (req: TechRequest, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const availability: (req: TechRequest, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const location: (req: TechRequest, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const acceptEmergency: (req: TechRequest, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const notifications: (req: TechRequest, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const notificationRead: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const completeJob: (req: TechRequest, res: Response) => Promise<Response<any, Record<string, any>>>;
export {};
//# sourceMappingURL=technicianController.d.ts.map