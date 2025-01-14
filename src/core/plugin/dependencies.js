import { logger } from '../../utils/logger';
export class PluginDependencyGraph {
    constructor() {
        this.dependencies = new Map();
        this.reverseDependencies = new Map();
    }
    addDependency(plugin, dependency) {
        if (!this.dependencies.has(plugin)) {
            this.dependencies.set(plugin, new Set());
        }
        this.dependencies.get(plugin).add(dependency);
        if (!this.reverseDependencies.has(dependency)) {
            this.reverseDependencies.set(dependency, new Set());
        }
        this.reverseDependencies.get(dependency).add(plugin);
        logger.debug(`Added dependency: ${plugin} -> ${dependency}`);
    }
    getDependencies(plugin) {
        return this.dependencies.get(plugin) || new Set();
    }
    getDependents(plugin) {
        return this.reverseDependencies.get(plugin) || new Set();
    }
    validateDependencies() {
        const visited = new Set();
        const temp = new Set();
        const cycle = [];
        const visit = (plugin) => {
            if (temp.has(plugin)) {
                cycle.push(plugin);
                return true;
            }
            if (visited.has(plugin))
                return false;
            temp.add(plugin);
            const deps = this.dependencies.get(plugin) || new Set();
            for (const dep of deps) {
                if (visit(dep)) {
                    cycle.push(plugin);
                    return true;
                }
            }
            temp.delete(plugin);
            visited.add(plugin);
            return false;
        };
        for (const plugin of this.dependencies.keys()) {
            if (visit(plugin))
                break;
        }
        return cycle.reverse();
    }
    clear() {
        this.dependencies.clear();
        this.reverseDependencies.clear();
    }
}
//# sourceMappingURL=dependencies.js.map