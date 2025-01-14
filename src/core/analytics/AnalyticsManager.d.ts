interface AnalyticsEvent {
    type: string;
    componentId: string;
    timestamp: number;
    metadata?: Record<string, any>;
}
interface AnalyticsProvider {
    trackEvent: (event: AnalyticsEvent) => void;
    initialize?: () => Promise<void>;
}
export declare class AnalyticsManager {
    private static instance;
    private providers;
    private events;
    private initialized;
    static getInstance(): AnalyticsManager;
    initialize(): Promise<void>;
    registerProvider(name: string, provider: AnalyticsProvider): void;
    trackEvent(type: string, componentId: string, metadata?: Record<string, any>): void;
    getEvents(componentId?: string): AnalyticsEvent[];
}
export {};
//# sourceMappingURL=AnalyticsManager.d.ts.map