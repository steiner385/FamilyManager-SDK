import { Component, ErrorInfo, ReactNode } from 'react';
export interface ErrorBoundaryProps {
    children: ReactNode;
    fallback?: ReactNode;
    onError?: (error: Error, errorInfo: ErrorInfo) => void;
    testErrorTrigger?: boolean;
}
interface ErrorBoundaryState {
    hasError: boolean;
    error: Error | null;
}
declare class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
    constructor(props: ErrorBoundaryProps);
    static getDerivedStateFromError(error: Error): ErrorBoundaryState;
    componentDidCatch(error: Error, errorInfo: ErrorInfo): void;
    componentDidUpdate(prevProps: ErrorBoundaryProps): void;
    render(): ReactNode;
}
export default ErrorBoundary;
//# sourceMappingURL=ErrorBoundary.d.ts.map