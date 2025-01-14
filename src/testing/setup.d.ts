declare class MockResizeObserver implements ResizeObserver {
    constructor(callback: ResizeObserverCallback);
    observe(target: Element): void;
    unobserve(target: Element): void;
    disconnect(): void;
}
//# sourceMappingURL=setup.d.ts.map