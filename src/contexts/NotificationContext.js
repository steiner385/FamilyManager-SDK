import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { createContext, useContext, useState, useCallback } from 'react';
import Toast from '../components/common/Toast';
const NotificationContext = createContext(undefined);
export function NotificationProvider({ children }) {
    const [notifications, setNotifications] = useState([]);
    const addNotification = useCallback((message, type, duration = 5000) => {
        const id = Math.random().toString(36).substr(2, 9);
        const notification = { id, message, type, duration };
        setNotifications(prev => [...prev, notification]);
        if (duration > 0) {
            setTimeout(() => {
                removeNotification(id);
            }, duration);
        }
    }, []);
    const removeNotification = useCallback((id) => {
        setNotifications(prev => prev.filter(notification => notification.id !== id));
    }, []);
    return (_jsxs(NotificationContext.Provider, { value: { notifications, addNotification, removeNotification }, children: [children, _jsx("div", { className: "fixed bottom-4 right-4 space-y-2", children: notifications.map(notification => (_jsx(Toast, { message: notification.message, type: notification.type, onClose: () => removeNotification(notification.id) }, notification.id))) })] }));
}
export function useNotification() {
    const context = useContext(NotificationContext);
    if (!context) {
        throw new Error('useNotification must be used within a NotificationProvider');
    }
    return context;
}
//# sourceMappingURL=NotificationContext.js.map