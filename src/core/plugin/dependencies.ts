import { logger } from '../../utils/logger';

export class PluginDependencyGraph {
  private dependencies: Map<string, Set<string>> = new Map();
  private reverseDependencies: Map<string, Set<string>> = new Map();

  addDependency(plugin: string, dependency: string): void {
    if (!this.dependencies.has(plugin)) {
      this.dependencies.set(plugin, new Set());
    }
    this.dependencies.get(plugin)!.add(dependency);

    if (!this.reverseDependencies.has(dependency)) {
      this.reverseDependencies.set(dependency, new Set());
    }
    this.reverseDependencies.get(dependency)!.add(plugin);

    logger.debug(`Added dependency: ${plugin} -> ${dependency}`);
  }

  getDependencies(plugin: string): Set<string> {
    return this.dependencies.get(plugin) || new Set();
  }

  getDependents(plugin: string): Set<string> {
    return this.reverseDependencies.get(plugin) || new Set();
  }

  validateDependencies(): string[] {
    const visited = new Set<string>();
    const temp = new Set<string>();
    const cycle: string[] = [];

    const visit = (plugin: string): boolean => {
      if (temp.has(plugin)) {
        cycle.push(plugin);
        return true;
      }
      if (visited.has(plugin)) return false;

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
      if (visit(plugin)) break;
    }

    return cycle.reverse();
  }

  clear(): void {
    this.dependencies.clear();
    this.reverseDependencies.clear();
  }
}
