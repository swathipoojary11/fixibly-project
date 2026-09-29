import { Request, Response, NextFunction } from "express";
type IdType = string | number;
export type TechAuthRequest = Request & {
    user?: {
        user_id: IdType;
        technician_id: IdType;
        [key: string]: any;
    };
};
export declare const verifyTechnician: (req: TechAuthRequest, res: Response, next: NextFunction) => Promise<Response<any, Record<string, any>> | undefined>;
export default verifyTechnician;
//# sourceMappingURL=verifyTechnician.d.ts.map