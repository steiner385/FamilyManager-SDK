import type { ToastType } from '../components/common/Toast';
interface ToastContextType {
    showToast: (message: string, type?: ToastType) => void;
}
export declare function ToastProvider({ children }: {
    children: React.ReactNode;
}): import("react/jsx-runtime").JSX.Element;
export declare function useToast(): ToastContextType;
export {};
//# sourceMappingURL=ToastContext.d.ts.map