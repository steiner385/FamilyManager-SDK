export interface StateConfig {
  persist?: boolean
  scope?: 'local' | 'session' | 'memory'
  version?: number
}

export class ComponentStateManager {
  private static states = new Map<string, any>()

  static setState(componentId: string, state: any, config: StateConfig = {}) {
    const { persist = false, scope = 'memory', version = 1 } = config
    const key = `component:${componentId}:v${version}`

    if (persist) {
      switch (scope) {
        case 'local':
          localStorage.setItem(key, JSON.stringify(state))
          break
        case 'session':
          sessionStorage.setItem(key, JSON.stringify(state))
          break
        default:
          this.states.set(key, state)
      }
    } else {
      this.states.set(key, state)
    }
  }

  static getState(componentId: string, config: StateConfig = {}) {
    const { scope = 'memory', version = 1 } = config
    const key = `component:${componentId}:v${version}`

    switch (scope) {
      case 'local':
        const localState = localStorage.getItem(key)
        return localState ? JSON.parse(localState) : null
      case 'session':
        const sessionState = sessionStorage.getItem(key)
        return sessionState ? JSON.parse(sessionState) : null
      default:
        return this.states.get(key) || null
    }
  }

  static clearState(componentId: string, config: StateConfig = {}) {
    const { scope = 'memory', version = 1 } = config
    const key = `component:${componentId}:v${version}`

    switch (scope) {
      case 'local':
        localStorage.removeItem(key)
        break
      case 'session':
        sessionStorage.removeItem(key)
        break
      default:
        this.states.delete(key)
    }
  }
}
