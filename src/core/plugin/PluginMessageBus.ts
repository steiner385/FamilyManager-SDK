interface Message {
  type: string
  payload?: any
  source: string
  timestamp: number
}

interface Subscription {
  pluginId: string
  callback: (message: Message) => void
  filter?: (message: Message) => boolean
}

export class PluginMessageBus {
  private static instance: PluginMessageBus
  private subscriptions: Map<string, Subscription[]> = new Map()
  private messageHistory: Message[] = []
  private readonly historyLimit = 1000

  static getInstance(): PluginMessageBus {
    if (!PluginMessageBus.instance) {
      PluginMessageBus.instance = new PluginMessageBus()
    }
    return PluginMessageBus.instance
  }

  publish(source: string, type: string, payload?: any) {
    const message: Message = {
      type,
      payload,
      source,
      timestamp: Date.now()
    }

    // Store in history
    this.messageHistory.push(message)
    if (this.messageHistory.length > this.historyLimit) {
      this.messageHistory.shift()
    }

    // Notify subscribers
    this.subscriptions.forEach(subs => {
      subs.forEach(sub => {
        if (!sub.filter || sub.filter(message)) {
          sub.callback(message)
        }
      })
    })
  }

  subscribe(
    pluginId: string,
    callback: (message: Message) => void,
    filter?: (message: Message) => boolean
  ) {
    const subs = this.subscriptions.get(pluginId) || []
    subs.push({ pluginId, callback, filter })
    this.subscriptions.set(pluginId, subs)

    return () => this.unsubscribe(pluginId, callback)
  }

  unsubscribe(pluginId: string, callback: (message: Message) => void) {
    const subs = this.subscriptions.get(pluginId) || []
    const filtered = subs.filter(sub => sub.callback !== callback)
    this.subscriptions.set(pluginId, filtered)
  }

  getHistory(filter?: (message: Message) => boolean): Message[] {
    return filter 
      ? this.messageHistory.filter(filter)
      : [...this.messageHistory]
  }
}
