type IdType = string | number;
export declare const logAuditEvent: (userId?: IdType | null, userRole?: string | null, actionType?: string, description?: string) => Promise<void>;
declare const _default: {
    logAuditEvent: (userId?: IdType | null, userRole?: string | null, actionType?: string, description?: string) => Promise<void>;
};
export default _default;
//# sourceMappingURL=auditService.d.ts.map