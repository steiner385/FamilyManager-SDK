import React from 'react';
type NotificationType = 'info' | 'success' | 'warning' | 'error';
interface Notification {
    id: string;
    message: string;
    type: NotificationType;
    duration?: number;
}
interface NotificationContextType {
    notifications: Notification[];
    addNotification: (message: string, type: NotificationType, duration?: number) => void;
    removeNotification: (id: string) => void;
}
export declare function NotificationProvider({ children }: {
    children: React.ReactNode;
}): import("react/jsx-runtime").JSX.Element;
export declare function useNotification(): NotificationContextType;
export {};
//# sourceMappingURL=NotificationContext.d.ts.map