export class ComponentRegistry {
    constructor() {
        this.components = new Map();
    }
    static getInstance() {
        if (!ComponentRegistry.instance) {
            ComponentRegistry.instance = new ComponentRegistry();
        }
        return ComponentRegistry.instance;
    }
    register(name, component) {
        if (this.components.has(name)) {
            throw new Error(`Component ${name} is already registered`);
        }
        this.components.set(name, component);
    }
    get(name) {
        return this.components.get(name);
    }
    getAll() {
        return this.components;
    }
}
ComponentRegistry.instance = null;
//# sourceMappingURL=ComponentRegistry.js.map