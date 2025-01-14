import { jsx as _jsx } from "react/jsx-runtime";
import { createContext, useContext, useState } from 'react';
const NavigationContext = createContext(undefined);
export function NavigationProvider({ children }) {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const toggleMobileMenu = () => setIsMobileMenuOpen(prev => !prev);
    const closeMobileMenu = () => setIsMobileMenuOpen(false);
    return (_jsx(NavigationContext.Provider, { value: {
            isMobileMenuOpen,
            toggleMobileMenu,
            closeMobileMenu
        }, children: children }));
}
export function useNavigation() {
    const context = useContext(NavigationContext);
    if (!context) {
        throw new Error('useNavigation must be used within NavigationProvider');
    }
    return context;
}
//# sourceMappingURL=NavigationContext.js.map