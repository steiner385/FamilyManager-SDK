interface AnalyticsEvent {
  type: string
  componentId: string
  timestamp: number
  metadata?: Record<string, any>
}

interface AnalyticsProvider {
  trackEvent: (event: AnalyticsEvent) => void
  initialize?: () => Promise<void>
}

export class AnalyticsManager {
  private static instance: AnalyticsManager
  private providers: Map<string, AnalyticsProvider> = new Map()
  private events: AnalyticsEvent[] = []
  private initialized = false

  static getInstance(): AnalyticsManager {
    if (!AnalyticsManager.instance) {
      AnalyticsManager.instance = new AnalyticsManager()
    }
    return AnalyticsManager.instance
  }

  async initialize() {
    if (this.initialized) return

    // Initialize all providers
    await Promise.all(
      Array.from(this.providers.values())
        .map(provider => provider.initialize?.())
        .filter(Boolean)
    )

    this.initialized = true
  }

  registerProvider(name: string, provider: AnalyticsProvider) {
    this.providers.set(name, provider)
  }

  trackEvent(type: string, componentId: string, metadata?: Record<string, any>) {
    const event: AnalyticsEvent = {
      type,
      componentId,
      timestamp: Date.now(),
      metadata
    }

    this.events.push(event)
    this.providers.forEach(provider => provider.trackEvent(event))
  }

  getEvents(componentId?: string): AnalyticsEvent[] {
    if (componentId) {
      return this.events.filter(e => e.componentId === componentId)
    }
    return this.events
  }
}
