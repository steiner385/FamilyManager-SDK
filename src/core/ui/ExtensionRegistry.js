export class ExtensionRegistry {
    constructor() {
        this.extensionPoints = new Map();
    }
    static getInstance() {
        if (!ExtensionRegistry.instance) {
            ExtensionRegistry.instance = new ExtensionRegistry();
        }
        return ExtensionRegistry.instance;
    }
    registerExtension(pointId, componentId, priority = 0, props) {
        const point = this.extensionPoints.get(pointId) || {
            id: pointId,
            components: []
        };
        point.components.push({ id: componentId, priority, props });
        point.components.sort((a, b) => b.priority - a.priority);
        this.extensionPoints.set(pointId, point);
    }
    getExtensions(pointId) {
        return this.extensionPoints.get(pointId)?.components || [];
    }
}
//# sourceMappingURL=ExtensionRegistry.js.map