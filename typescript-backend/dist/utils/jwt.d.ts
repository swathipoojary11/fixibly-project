export type JwtUserPayload = {
    user_id?: string | number;
    role_id?: number;
    [key: string]: any;
};
export declare const generateToken: (user: JwtUserPayload) => string;
declare const _default: {
    generateToken: (user: JwtUserPayload) => string;
};
export default _default;
//# sourceMappingURL=jwt.d.ts.map