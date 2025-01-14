import { ComponentType } from 'react';
import type { ComponentMetadata } from '../core/registry/types';
interface UseRegistryResult {
    getComponent: <T = {}>(name: string) => ComponentType<T> | undefined;
    getMetadata: (name: string) => ComponentMetadata | undefined;
    getAllComponents: () => [string, ComponentType<any>][];
}
export declare function useRegistry(): UseRegistryResult;
export {};
//# sourceMappingURL=useRegistry.d.ts.map