interface LayoutConfig {
  id: string
  areas: string[][]
  components: {
    [key: string]: {
      componentId: string
      props?: Record<string, any>
    }
  }
}

export class LayoutManager {
  private static instance: LayoutManager
  private layouts = new Map<string, LayoutConfig>()

  static getInstance(): LayoutManager {
    if (!LayoutManager.instance) {
      LayoutManager.instance = new LayoutManager()
    }
    return LayoutManager.instance
  }

  registerLayout(config: LayoutConfig): void {
    this.layouts.set(config.id, config)
  }

  getLayout(id: string): LayoutConfig | undefined {
    return this.layouts.get(id)
  }

  removeLayout(id: string): void {
    this.layouts.delete(id)
  }
}
