import React from 'react';
export type ToastType = 'success' | 'error' | 'warning' | 'info';
export interface ToastProps {
    message: string;
    type: ToastType;
    onClose: () => void;
    duration?: number;
}
declare const Toast: React.ForwardRefExoticComponent<ToastProps & React.RefAttributes<HTMLDivElement>>;
export default Toast;
//# sourceMappingURL=Toast.d.ts.map