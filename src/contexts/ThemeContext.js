import { jsx as _jsx } from "react/jsx-runtime";
import { createContext, useContext, useState, useEffect } from 'react';
const defaultTypography = {
    fonts: {
        body: 'system-ui, sans-serif',
        heading: 'system-ui, sans-serif',
    },
    sizes: {
        base: '16px',
        h1: '2.5rem',
        h2: '2rem',
        h3: '1.75rem',
        h4: '1.5rem',
    },
    scaleRatio: '1.2',
};
const defaultPreset = {
    name: 'Default',
    colors: {
        primary: '#007bff',
        secondary: '#6c757d',
        success: '#28a745',
        error: '#dc3545',
        warning: '#ffc107',
        info: '#17a2b8',
        background: '#ffffff',
        text: '#212529',
    },
    typography: defaultTypography,
};
const ThemeContext = createContext(undefined);
export function ThemeProvider({ children }) {
    const [theme, setTheme] = useState(() => {
        try {
            const savedTheme = localStorage.getItem('theme');
            return (savedTheme === 'dark' || savedTheme === 'light') ? savedTheme : 'light';
        }
        catch {
            return 'light';
        }
    });
    const [colors, setColors] = useState(defaultPreset.colors);
    const [typography, setTypography] = useState(defaultPreset.typography);
    const [spacing, setSpacing] = useState({});
    const [presets, setPresets] = useState([defaultPreset]);
    const [fonts] = useState(['system-ui', 'Arial', 'Helvetica', 'sans-serif']);
    const isDark = theme === 'dark';
    // Initialize theme class on mount
    useEffect(() => {
        document.documentElement.classList.toggle('dark', isDark);
    }, []);
    const toggleTheme = () => {
        const newTheme = isDark ? 'light' : 'dark';
        updateTheme(newTheme);
    };
    const updateTheme = async (newTheme) => {
        setTheme(newTheme);
        document.documentElement.classList.toggle('dark', newTheme === 'dark');
        // Here you would typically persist the theme preference
        try {
            await localStorage.setItem('theme', newTheme);
        }
        catch (error) {
            console.error('Failed to persist theme preference:', error);
        }
    };
    const updateThemeColors = (newColors) => {
        setColors(prevColors => ({ ...prevColors, ...newColors }));
        // Apply colors to CSS variables
        Object.entries(newColors).forEach(([key, value]) => {
            document.documentElement.style.setProperty(`--color-${key}`, value);
        });
    };
    const updateTypography = (newTypography) => {
        setTypography(prevTypography => ({ ...prevTypography, ...newTypography }));
        // Apply typography to CSS variables
        if (newTypography.fonts) {
            Object.entries(newTypography.fonts).forEach(([key, value]) => {
                document.documentElement.style.setProperty(`--font-${key}`, value);
            });
        }
        if (newTypography.sizes) {
            Object.entries(newTypography.sizes).forEach(([key, value]) => {
                document.documentElement.style.setProperty(`--font-size-${key}`, value);
            });
        }
    };
    const updateSpacing = (newSpacing) => {
        setSpacing(prevSpacing => ({ ...prevSpacing, ...newSpacing }));
        // Apply spacing to CSS variables
        Object.entries(newSpacing).forEach(([key, value]) => {
            document.documentElement.style.setProperty(`--spacing-${key}`, value);
        });
    };
    const saveThemePreset = (preset) => {
        setPresets(prevPresets => {
            const index = prevPresets.findIndex(p => p.name === preset.name);
            if (index >= 0) {
                const newPresets = [...prevPresets];
                newPresets[index] = preset;
                return newPresets;
            }
            return [...prevPresets, preset];
        });
    };
    const loadThemePreset = (preset) => {
        updateThemeColors(preset.colors);
        updateTypography(preset.typography);
    };
    return (_jsx(ThemeContext.Provider, { value: {
            theme,
            isDark,
            colors,
            typography,
            spacing,
            toggleTheme,
            updateTheme,
            updateThemeColors,
            updateTypography,
            updateSpacing,
            saveThemePreset,
            loadThemePreset,
            fonts,
            presets,
        }, children: children }));
}
export function useTheme() {
    const context = useContext(ThemeContext);
    if (context === undefined) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }
    return context;
}
//# sourceMappingURL=ThemeContext.js.map