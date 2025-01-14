export interface LifecycleHooks {
    onMount?: () => void | Promise<void>;
    onUnmount?: () => void | Promise<void>;
    onUpdate?: (prevProps: any) => void | Promise<void>;
    onError?: (error: Error) => void | Promise<void>;
}
export declare class ComponentLifecycle {
    private static emitter;
    private static hookMap;
    static registerHooks(componentId: string, hooks: LifecycleHooks): void;
    static unregisterHooks(componentId: string): void;
    static triggerMount(componentId: string): Promise<void>;
    static triggerUnmount(componentId: string): Promise<void>;
    static triggerUpdate(componentId: string, prevProps: any): Promise<void>;
    static triggerError(componentId: string, error: Error): Promise<void>;
}
//# sourceMappingURL=ComponentLifecycle.d.ts.map