import { jsx as _jsx } from "react/jsx-runtime";
import { createContext, useContext } from 'react';
import { defaultTheme } from './defaultTheme';
const ThemeContext = createContext(defaultTheme);
export function SDKThemeProvider({ theme = defaultTheme, children }) {
    const mergedTheme = { ...defaultTheme, ...theme };
    return (_jsx(ThemeContext.Provider, { value: mergedTheme, children: children }));
}
export function useSDKTheme() {
    return useContext(ThemeContext);
}
//# sourceMappingURL=ThemeProvider.js.map