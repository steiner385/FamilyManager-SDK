import { jsx as _jsx } from "react/jsx-runtime";
import { render as rtlRender } from '@testing-library/react';
import '@testing-library/jest-dom';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            retry: false,
        },
    },
});
const AllTheProviders = ({ children }) => {
    return (_jsx(QueryClientProvider, { client: queryClient, children: _jsx(BrowserRouter, { children: children }) }));
};
const customRender = (ui, options) => rtlRender(ui, { wrapper: AllTheProviders, ...options });
// Re-export everything
export * from '@testing-library/react';
// Override render method
export { customRender as render };
//# sourceMappingURL=test-utils.js.map