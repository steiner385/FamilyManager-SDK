import { jsx as _jsx } from "react/jsx-runtime";
import { createContext, useContext, useState, useCallback } from 'react';
const ToastContext = createContext({
    toasts: [],
    addToast: () => { },
    removeToast: () => { }
});
export function ToastProvider({ children }) {
    const [toasts, setToasts] = useState([]);
    const addToast = useCallback((toast) => {
        const id = Math.random().toString(36).substr(2, 9);
        const newToast = { ...toast, id };
        setToasts(prev => [...prev, newToast]);
        // Auto remove toast after duration
        if (toast.duration !== 0) {
            setTimeout(() => {
                removeToast(id);
            }, toast.duration || 3000);
        }
    }, []);
    const removeToast = useCallback((id) => {
        setToasts(prev => prev.filter(toast => toast.id !== id));
    }, []);
    return (_jsx(ToastContext.Provider, { value: { toasts, addToast, removeToast }, children: children }));
}
export function useToast() {
    return useContext(ToastContext);
}
//# sourceMappingURL=ToastProvider.js.map