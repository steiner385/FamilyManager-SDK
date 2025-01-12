import { ComponentType } from 'react';
import type { ComponentMetadata } from './types';

export class ComponentRegistry {
  private static instance: ComponentRegistry;
  private components: Map<string, ComponentType<any>> = new Map();
  private metadata: Map<string, ComponentMetadata> = new Map();

  static getInstance(): ComponentRegistry {
    if (!ComponentRegistry.instance) {
      ComponentRegistry.instance = new ComponentRegistry();
    }
    return ComponentRegistry.instance;
  }

  register<T = {}>(
    name: string, 
    component: ComponentType<T>, 
    metadata?: ComponentMetadata
  ): void {
    if (this.components.has(name)) {
      throw new Error(`Component "${name}" is already registered`);
    }
    this.components.set(name, component);
    if (metadata) {
      this.metadata.set(name, metadata);
    }
  }

  get<T = {}>(name: string): ComponentType<T> | undefined {
    return this.components.get(name) as ComponentType<T> | undefined;
  }

  getMetadata(name: string): ComponentMetadata | undefined {
    return this.metadata.get(name);
  }

  getAllComponents(): [string, ComponentType<any>][] {
    return Array.from(this.components.entries());
  }
}
