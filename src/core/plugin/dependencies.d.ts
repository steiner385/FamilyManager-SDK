export declare class PluginDependencyGraph {
    private dependencies;
    private reverseDependencies;
    addDependency(plugin: string, dependency: string): void;
    getDependencies(plugin: string): Set<string>;
    getDependents(plugin: string): Set<string>;
    validateDependencies(): string[];
    clear(): void;
}
//# sourceMappingURL=dependencies.d.ts.map