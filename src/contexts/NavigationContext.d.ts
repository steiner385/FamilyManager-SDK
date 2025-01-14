interface NavigationContextType {
    isMobileMenuOpen: boolean;
    toggleMobileMenu: () => void;
    closeMobileMenu: () => void;
}
export declare function NavigationProvider({ children }: {
    children: React.ReactNode;
}): import("react/jsx-runtime").JSX.Element;
export declare function useNavigation(): NavigationContextType;
export {};
//# sourceMappingURL=NavigationContext.d.ts.map