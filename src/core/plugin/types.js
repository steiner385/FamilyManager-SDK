export class PluginDependencyConfig {
    constructor(required, optional) {
        this.deps = new Map(Object.entries(required));
        if (optional) {
            Object.entries(optional).forEach(([key, value]) => this.deps.set(key, value));
        }
    }
    get required() {
        return Object.fromEntries([...this.deps.entries()]);
    }
    get optional() {
        return undefined;
    }
    includes(key) {
        return this.deps.has(key);
    }
    [Symbol.iterator]() {
        return this.deps.entries();
    }
}
//# sourceMappingURL=types.js.map