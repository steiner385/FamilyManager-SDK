import type { LayoutConfig } from './types';
export declare class LayoutManager {
    private static instance;
    private layouts;
    static getInstance(): LayoutManager;
    registerLayout(config: LayoutConfig): void;
    getLayout(id: string): LayoutConfig | undefined;
    removeLayout(id: string): void;
}
//# sourceMappingURL=LayoutManager.d.ts.map