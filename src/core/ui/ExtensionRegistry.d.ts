interface ExtensionPoint {
    id: string;
    components: {
        id: string;
        priority: number;
        props?: Record<string, any>;
    }[];
}
export declare class ExtensionRegistry {
    private static instance;
    private extensionPoints;
    static getInstance(): ExtensionRegistry;
    registerExtension(pointId: string, componentId: string, priority?: number, props?: Record<string, any>): void;
    getExtensions(pointId: string): ExtensionPoint['components'];
}
export {};
//# sourceMappingURL=ExtensionRegistry.d.ts.map