import { ComponentType } from 'react';
import type { ComponentMetadata } from './types';
export declare class ComponentRegistry {
    private static instance;
    private components;
    private metadata;
    static getInstance(): ComponentRegistry;
    register<T = {}>(name: string, component: ComponentType<T>, metadata?: ComponentMetadata): void;
    get<T = {}>(name: string): ComponentType<T> | undefined;
    getMetadata(name: string): ComponentMetadata | undefined;
    getAllComponents(): [string, ComponentType<any>][];
}
//# sourceMappingURL=ComponentRegistry.d.ts.map