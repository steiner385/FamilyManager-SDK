import { ComponentType } from 'react';
import type { UIComponentMetadata } from './types';
export declare class UIComponentRegistry {
    private static instance;
    private components;
    private metadata;
    private categories;
    static getInstance(): UIComponentRegistry;
    register(id: string, component: ComponentType, metadata: UIComponentMetadata): void;
    get(id: string): ComponentType | undefined;
    getMetadata(id: string): UIComponentMetadata | undefined;
    getCategories(): string[];
    getByCategory(category: string): [string, ComponentType][];
    unregister(id: string): void;
}
//# sourceMappingURL=UIComponentRegistry.d.ts.map