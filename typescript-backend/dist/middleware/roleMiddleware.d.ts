import { Request, Response, NextFunction } from "express";
type AuthUser = {
    role_id?: number;
    [key: string]: any;
};
type AuthRequest = Request & {
    user?: AuthUser;
};
export declare const authorizeRoles: (...allowedRoles: string[]) => (req: AuthRequest, res: Response, next: NextFunction) => Response<any, Record<string, any>> | undefined;
export default authorizeRoles;
//# sourceMappingURL=roleMiddleware.d.ts.map