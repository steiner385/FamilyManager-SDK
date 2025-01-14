export interface ComponentMetadata {
    name: string;
    description?: string;
    props?: Record<string, {
        type: string;
        required?: boolean;
        description?: string;
        defaultValue?: any;
    }>;
}
//# sourceMappingURL=types.d.ts.map