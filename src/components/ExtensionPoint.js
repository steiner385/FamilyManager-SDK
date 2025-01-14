import { jsx as _jsx } from "react/jsx-runtime";
import { ExtensionRegistry } from '../core/ui/ExtensionRegistry';
import { DynamicComponent } from './DynamicComponent';
export function ExtensionPoint({ id, className = '' }) {
    const registry = ExtensionRegistry.getInstance();
    const extensions = registry.getExtensions(id);
    return (_jsx("div", { className: className, children: extensions.map(({ id: componentId, props }, index) => (_jsx(DynamicComponent, { id: componentId, props: props }, `${componentId}-${index}`))) }));
}
//# sourceMappingURL=ExtensionPoint.js.map