import { ComponentType } from 'react';
export declare class ComponentRegistry {
    private static instance;
    private components;
    static getInstance(): ComponentRegistry;
    register(name: string, component: ComponentType): void;
    get(name: string): ComponentType | undefined;
    getAll(): Map<string, ComponentType>;
}
//# sourceMappingURL=ComponentRegistry.d.ts.map