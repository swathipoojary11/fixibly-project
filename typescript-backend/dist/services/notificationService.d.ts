type IdType = string | number;
type RoleType = 'CUSTOMER' | 'TECHNICIAN' | 'DISPATCHER' | 'ADMIN' | 'ALL' | string;
type PriorityType = 'Low' | 'Medium' | 'High' | string;
export type NotificationParams = {
    recipientRole: RoleType;
    userId?: IdType | null;
    bookingId?: IdType | null;
    title: string;
    description: string;
    notificationType: string;
    priority?: PriorityType;
};
export declare const createNotification: ({ recipientRole, userId, bookingId, title, description, notificationType, priority }: NotificationParams) => Promise<void>;
declare const _default: {
    createNotification: ({ recipientRole, userId, bookingId, title, description, notificationType, priority }: NotificationParams) => Promise<void>;
};
export default _default;
//# sourceMappingURL=notificationService.d.ts.map