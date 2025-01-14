export class ComponentRegistry {
    constructor() {
        this.components = new Map();
        this.metadata = new Map();
    }
    static getInstance() {
        if (!ComponentRegistry.instance) {
            ComponentRegistry.instance = new ComponentRegistry();
        }
        return ComponentRegistry.instance;
    }
    register(name, component, metadata) {
        if (this.components.has(name)) {
            throw new Error(`Component "${name}" is already registered`);
        }
        this.components.set(name, component);
        if (metadata) {
            this.metadata.set(name, metadata);
        }
    }
    get(name) {
        return this.components.get(name);
    }
    getMetadata(name) {
        return this.metadata.get(name);
    }
    getAllComponents() {
        return Array.from(this.components.entries());
    }
}
//# sourceMappingURL=ComponentRegistry.js.map