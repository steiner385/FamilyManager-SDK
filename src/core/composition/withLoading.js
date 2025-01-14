import { jsx as _jsx } from "react/jsx-runtime";
import { LoadingSpinner } from '../../components';
export function withLoading(WrappedComponent) {
    return function LoadingComponent(props) {
        const { isLoading, ...rest } = props;
        if (isLoading) {
            return _jsx(LoadingSpinner, {});
        }
        return _jsx(WrappedComponent, { ...rest });
    };
}
//# sourceMappingURL=withLoading.js.map