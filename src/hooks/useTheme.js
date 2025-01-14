import { useState } from 'react';
import { ThemeManager } from '../core/theme/ThemeManager';
export function useTheme() {
    const [theme, setTheme] = useState(() => ThemeManager.getInstance().getCurrentTheme());
    const updateTheme = (newTheme) => {
        ThemeManager.getInstance().setTheme(newTheme);
        setTheme(ThemeManager.getInstance().getCurrentTheme());
    };
    return { theme, setTheme: updateTheme };
}
//# sourceMappingURL=useTheme.js.map