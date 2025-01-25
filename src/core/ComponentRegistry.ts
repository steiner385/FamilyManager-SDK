import { ComponentType } from 'react'

export class ComponentRegistry {
  private static instance: ComponentRegistry | null = null
  private components: Map<string, ComponentType> = new Map()

  public static getInstance(): ComponentRegistry {
    if (!ComponentRegistry.instance) {
      ComponentRegistry.instance = new ComponentRegistry()
    }
    return ComponentRegistry.instance
  }

  register(name: string, component: ComponentType): void {
    if (this.components.has(name)) {
      throw new Error(`Component ${name} is already registered`)
    }
    this.components.set(name, component)
  }

  get(name: string): ComponentType | undefined {
    return this.components.get(name)
  }

  getAll(): Map<string, ComponentType> {
    return this.components
  }
}
