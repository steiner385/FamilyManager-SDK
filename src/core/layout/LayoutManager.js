export class LayoutManager {
    constructor() {
        this.layouts = new Map();
    }
    static getInstance() {
        if (!LayoutManager.instance) {
            LayoutManager.instance = new LayoutManager();
        }
        return LayoutManager.instance;
    }
    registerLayout(config) {
        this.layouts.set(config.id, config);
    }
    getLayout(id) {
        return this.layouts.get(id);
    }
    removeLayout(id) {
        this.layouts.delete(id);
    }
}
//# sourceMappingURL=LayoutManager.js.map