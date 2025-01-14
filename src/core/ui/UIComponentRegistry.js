export class UIComponentRegistry {
    constructor() {
        this.components = new Map();
        this.metadata = new Map();
        this.categories = new Set();
    }
    static getInstance() {
        if (!UIComponentRegistry.instance) {
            UIComponentRegistry.instance = new UIComponentRegistry();
        }
        return UIComponentRegistry.instance;
    }
    register(id, component, metadata) {
        if (this.components.has(id)) {
            throw new Error(`Component "${id}" is already registered`);
        }
        this.components.set(id, component);
        this.metadata.set(id, metadata);
        if (metadata.category) {
            this.categories.add(metadata.category);
        }
    }
    get(id) {
        return this.components.get(id);
    }
    getMetadata(id) {
        return this.metadata.get(id);
    }
    getCategories() {
        return Array.from(this.categories);
    }
    getByCategory(category) {
        return Array.from(this.components.entries())
            .filter(([id]) => this.metadata.get(id)?.category === category);
    }
    unregister(id) {
        this.components.delete(id);
        this.metadata.delete(id);
    }
}
//# sourceMappingURL=UIComponentRegistry.js.map