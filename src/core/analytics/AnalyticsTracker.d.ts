interface AnalyticsEvent {
    category: string;
    action: string;
    label?: string;
    value?: number;
    metadata?: Record<string, any>;
}
export declare class AnalyticsTracker {
    private static handlers;
    static registerHandler(handler: (event: AnalyticsEvent) => void): void;
    static trackEvent(event: AnalyticsEvent): void;
    static trackComponentEvent(componentId: string, action: string, metadata?: Record<string, any>): void;
}
export {};
//# sourceMappingURL=AnalyticsTracker.d.ts.map