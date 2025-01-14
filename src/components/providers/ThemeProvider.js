import { jsx as _jsx } from "react/jsx-runtime";
import { createContext, useContext, useState } from 'react';
const defaultTheme = {
    colors: {
        primary: '#007bff',
        secondary: '#6c757d',
        background: '#ffffff',
        text: '#212529'
    },
    typography: {
        fontFamily: 'system-ui, -apple-system, sans-serif',
        fontSize: {
            small: '0.875rem',
            medium: '1rem',
            large: '1.25rem'
        }
    },
    spacing: {
        small: '0.5rem',
        medium: '1rem',
        large: '1.5rem'
    }
};
const ThemeContext = createContext({
    theme: defaultTheme,
    setTheme: () => { }
});
export function ThemeProvider({ children, initialTheme = defaultTheme }) {
    const [theme, setTheme] = useState(initialTheme);
    return (_jsx(ThemeContext.Provider, { value: { theme, setTheme }, children: children }));
}
export function useTheme() {
    return useContext(ThemeContext);
}
//# sourceMappingURL=ThemeProvider.js.map