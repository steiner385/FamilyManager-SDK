import { ComponentType } from 'react'

interface ComponentMetadata {
  name: string
  description?: string
  category?: string
  version?: string
  author?: string
  props?: {
    [key: string]: {
      type: string
      required?: boolean
      description?: string
      defaultValue?: any
    }
  }
}

export class UIComponentRegistry {
  private static instance: UIComponentRegistry
  private components = new Map<string, ComponentType>()
  private metadata = new Map<string, ComponentMetadata>()
  private categories = new Set<string>()

  static getInstance(): UIComponentRegistry {
    if (!UIComponentRegistry.instance) {
      UIComponentRegistry.instance = new UIComponentRegistry()
    }
    return UIComponentRegistry.instance
  }

  register(
    id: string, 
    component: ComponentType, 
    metadata: ComponentMetadata
  ): void {
    if (this.components.has(id)) {
      throw new Error(`Component "${id}" is already registered`)
    }

    this.components.set(id, component)
    this.metadata.set(id, metadata)
    
    if (metadata.category) {
      this.categories.add(metadata.category)
    }
  }

  get(id: string): ComponentType | undefined {
    return this.components.get(id)
  }

  getMetadata(id: string): ComponentMetadata | undefined {
    return this.metadata.get(id)
  }

  getCategories(): string[] {
    return Array.from(this.categories)
  }

  getByCategory(category: string): [string, ComponentType][] {
    return Array.from(this.components.entries())
      .filter(([id]) => this.metadata.get(id)?.category === category)
  }

  unregister(id: string): void {
    this.components.delete(id)
    this.metadata.delete(id)
  }
}
