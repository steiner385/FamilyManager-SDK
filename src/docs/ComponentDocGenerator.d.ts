interface ComponentDoc {
    name: string;
    description: string;
    props: Record<string, PropDoc>;
    examples: string[];
}
interface PropDoc {
    description: string;
    type: string;
    required: boolean;
    defaultValue?: any;
}
export declare class ComponentDocGenerator {
    private static outputPath;
    static generateDocs(componentPath: string): ComponentDoc;
    private static formatProps;
    private static extractExamples;
    static generateMarkdown(doc: ComponentDoc): string;
    static generateDocsForDirectory(dir: string): Promise<void>;
}
export {};
//# sourceMappingURL=ComponentDocGenerator.d.ts.map