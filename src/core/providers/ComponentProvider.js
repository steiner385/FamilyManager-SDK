import { jsx as _jsx } from "react/jsx-runtime";
import { createContext, useContext } from 'react';
const ComponentContext = createContext({
    components: {},
});
export function ComponentProvider({ children, components = {} }) {
    return (_jsx(ComponentContext.Provider, { value: { components }, children: children }));
}
export function useComponents() {
    return useContext(ComponentContext);
}
//# sourceMappingURL=ComponentProvider.js.map