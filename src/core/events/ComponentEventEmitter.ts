type EventCallback = (...args: any[]) => void | Promise<void>

export class ComponentEventEmitter {
  private events: Map<string, Set<EventCallback>> = new Map()

  on(event: string, callback: EventCallback) {
    if (!this.events.has(event)) {
      this.events.set(event, new Set())
    }
    this.events.get(event)!.add(callback)
    
    return () => this.off(event, callback)
  }

  off(event: string, callback?: EventCallback) {
    if (callback) {
      this.events.get(event)?.delete(callback)
      if (this.events.get(event)?.size === 0) {
        this.events.delete(event)
      }
    } else {
      this.events.delete(event)
    }
  }

  emit(event: string, ...args: any[]) {
    const callbacks = this.events.get(event)
    if (callbacks) {
      callbacks.forEach(callback => callback(...args))
    }
  }

  async emitAsync(event: string, ...args: any[]) {
    const callbacks = Array.from(this.events.get(event) || [])
    const results = await Promise.allSettled(
      callbacks.map(callback => callback(...args))
    )
    
    // Throw the first error if any
    const firstError = results.find(
      (result): result is PromiseRejectedResult => 
      result.status === 'rejected'
    )
    if (firstError) {
      throw firstError.reason
    }
  }

  clear() {
    this.events.clear()
  }
}
