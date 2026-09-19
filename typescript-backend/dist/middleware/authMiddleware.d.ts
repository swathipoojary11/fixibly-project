import { Request, Response, NextFunction } from "express";
type IdType = string | number;
export type AuthenticatedUser = {
    id?: IdType;
    user_id?: IdType;
    technician_id?: IdType;
    role?: string;
    name?: string;
    email?: string;
    [key: string]: any;
};
export type AuthRequest = Request & {
    user?: AuthenticatedUser;
};
export declare const authenticateUser: (req: AuthRequest, res: Response, next: NextFunction) => Response<any, Record<string, any>> | undefined;
export declare const verifyTechnician: (req: AuthRequest, res: Response, next: NextFunction) => void;
export default authenticateUser;
//# sourceMappingURL=authMiddleware.d.ts.map