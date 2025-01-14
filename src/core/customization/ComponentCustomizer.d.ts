import React, { ComponentType } from 'react';
interface CustomizationOptions {
    styles?: Record<string, any>;
    props?: Record<string, any>;
    behaviors?: Record<string, (...args: any[]) => void>;
}
export declare class ComponentCustomizer {
    private static customizations;
    static customize(pluginName: string, componentName: string, options: CustomizationOptions): void;
    static getCustomizations(pluginName: string, componentName: string): CustomizationOptions;
    static withCustomizations<P extends object>(WrappedComponent: ComponentType<P>, pluginName: string, componentName: string): React.FC<P>;
}
export {};
//# sourceMappingURL=ComponentCustomizer.d.ts.map