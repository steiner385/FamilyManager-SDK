export interface StateConfig {
    persist?: boolean;
    scope?: 'local' | 'session' | 'memory';
    version?: number;
}
export declare class ComponentStateManager {
    private static states;
    static setState(componentId: string, state: any, config?: StateConfig): void;
    static getState(componentId: string, config?: StateConfig): any;
    static clearState(componentId: string, config?: StateConfig): void;
}
//# sourceMappingURL=ComponentStateManager.d.ts.map