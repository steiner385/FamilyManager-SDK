import { ComponentType } from 'react';
import type { UIComponentMetadata } from '../core/ui/types';
interface UseUIComponentResult {
    Component: ComponentType | undefined;
    metadata: UIComponentMetadata | undefined;
    isRegistered: boolean;
}
export declare function useUIComponent(id: string): UseUIComponentResult;
export {};
//# sourceMappingURL=useUIComponent.d.ts.map