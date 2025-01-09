type EventCallback = (...args: any[]) => void

export class ComponentEventEmitter {
  private events: Map<string, Set<EventCallback>> = new Map()

  on(event: string, callback: EventCallback) {
    if (!this.events.has(event)) {
      this.events.set(event, new Set())
    }
    this.events.get(event)!.add(callback)
    
    return () => this.off(event, callback)
  }

  off(event: string, callback: EventCallback) {
    this.events.get(event)?.delete(callback)
  }

  emit(event: string, ...args: any[]) {
    this.events.get(event)?.forEach(callback => callback(...args))
  }

  clear() {
    this.events.clear()
  }
}
