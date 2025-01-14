interface ComponentState<T> {
    state: T;
    setState: (value: Partial<T>) => void;
    reset: () => void;
}
export declare function createComponentState<T>(initialState: T): import("zustand").UseBoundStore<import("zustand").StoreApi<ComponentState<T>>>;
export {};
//# sourceMappingURL=createComponentState.d.ts.map