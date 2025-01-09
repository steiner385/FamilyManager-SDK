interface ExtensionPoint {
  id: string
  components: {
    id: string
    priority: number
    props?: Record<string, any>
  }[]
}

export class ExtensionRegistry {
  private static instance: ExtensionRegistry
  private extensionPoints = new Map<string, ExtensionPoint>()

  static getInstance(): ExtensionRegistry {
    if (!ExtensionRegistry.instance) {
      ExtensionRegistry.instance = new ExtensionRegistry()
    }
    return ExtensionRegistry.instance
  }

  registerExtension(
    pointId: string,
    componentId: string,
    priority: number = 0,
    props?: Record<string, any>
  ): void {
    const point = this.extensionPoints.get(pointId) || {
      id: pointId,
      components: []
    }

    point.components.push({ id: componentId, priority, props })
    point.components.sort((a, b) => b.priority - a.priority)

    this.extensionPoints.set(pointId, point)
  }

  getExtensions(pointId: string): ExtensionPoint['components'] {
    return this.extensionPoints.get(pointId)?.components || []
  }
}
