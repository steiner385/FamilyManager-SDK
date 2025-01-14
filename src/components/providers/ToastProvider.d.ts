import React from 'react';
interface Toast {
    id: string;
    message: string;
    type: 'info' | 'success' | 'warning' | 'error';
    duration?: number;
}
interface ToastContextValue {
    toasts: Toast[];
    addToast: (toast: Omit<Toast, 'id'>) => void;
    removeToast: (id: string) => void;
}
interface ToastProviderProps {
    children: React.ReactNode;
}
export declare function ToastProvider({ children }: ToastProviderProps): import("react/jsx-runtime").JSX.Element;
export declare function useToast(): ToastContextValue;
export {};
//# sourceMappingURL=ToastProvider.d.ts.map