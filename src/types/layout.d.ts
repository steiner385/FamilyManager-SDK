export interface LayoutConfig {
    id: string;
    areas: string[][];
    components: {
        [key: string]: {
            componentId: string;
            props?: Record<string, any>;
        };
    };
}
//# sourceMappingURL=layout.d.ts.map