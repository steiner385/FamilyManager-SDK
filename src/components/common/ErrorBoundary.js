import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Component } from 'react';
class ErrorBoundary extends Component {
    constructor(props) {
        super(props);
        this.state = {
            hasError: false,
            error: null
        };
    }
    static getDerivedStateFromError(error) {
        return {
            hasError: true,
            error
        };
    }
    componentDidCatch(error, errorInfo) {
        if (this.props.onError) {
            this.props.onError(error, errorInfo);
        }
    }
    componentDidUpdate(prevProps) {
        if (this.props.testErrorTrigger &&
            this.props.testErrorTrigger !== prevProps.testErrorTrigger) {
            throw new Error('Test error triggered');
        }
    }
    render() {
        if (this.state.hasError) {
            return this.props.fallback || (_jsxs("div", { role: "alert", className: "error-boundary", children: [_jsx("h2", { children: "Something went wrong" }), _jsxs("details", { children: [_jsx("summary", { children: "Error Details" }), _jsx("pre", { children: this.state.error?.toString() })] })] }));
        }
        return this.props.children;
    }
}
export default ErrorBoundary;
//# sourceMappingURL=ErrorBoundary.js.map