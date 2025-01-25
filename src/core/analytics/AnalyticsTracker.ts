interface AnalyticsEvent {
  category: string
  action: string
  label?: string
  value?: number
  metadata?: Record<string, any>
}

export class AnalyticsTracker {
  private static handlers = new Set<(event: AnalyticsEvent) => void>()

  static registerHandler(handler: (event: AnalyticsEvent) => void) {
    this.handlers.add(handler)
  }

  static trackEvent(event: AnalyticsEvent) {
    this.handlers.forEach(handler => handler(event))
  }

  static trackComponentEvent(
    componentId: string,
    action: string,
    metadata?: Record<string, any>
  ) {
    this.trackEvent({
      category: 'Component',
      action,
      label: componentId,
      metadata,
    })
  }
}
