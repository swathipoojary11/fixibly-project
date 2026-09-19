import { Request, Response } from "express";
type IdType = string | number;
type AuthRequest = Request & {
    user?: {
        user_id?: IdType;
        id?: IdType;
    };
};
export declare const getProfile: (req: AuthRequest, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const updateProfile: (req: AuthRequest, res: Response) => Promise<Response<any, Record<string, any>>>;
export {};
//# sourceMappingURL=profileController.d.ts.map