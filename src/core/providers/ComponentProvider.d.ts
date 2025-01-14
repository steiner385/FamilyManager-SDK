import React from 'react';
interface ComponentContextValue {
    components: Record<string, React.ComponentType>;
}
interface ComponentProviderProps {
    children: React.ReactNode;
    components?: Record<string, React.ComponentType>;
}
export declare function ComponentProvider({ children, components }: ComponentProviderProps): import("react/jsx-runtime").JSX.Element;
export declare function useComponents(): ComponentContextValue;
export {};
//# sourceMappingURL=ComponentProvider.d.ts.map