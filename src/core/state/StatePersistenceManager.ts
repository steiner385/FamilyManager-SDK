interface PersistenceConfig {
  storage?: 'local' | 'session' | 'memory'
  version?: number
  serialize?: (state: any) => string
  deserialize?: (data: string) => any
  migrate?: (state: any, version: number) => any
}

export class StatePersistenceManager {
  private static instance: StatePersistenceManager
  private memoryStorage = new Map<string, any>()

  static getInstance(): StatePersistenceManager {
    if (!StatePersistenceManager.instance) {
      StatePersistenceManager.instance = new StatePersistenceManager()
    }
    return StatePersistenceManager.instance
  }

  persist(key: string, state: any, config: PersistenceConfig = {}) {
    const {
      storage = 'memory',
      version = 1,
      serialize = JSON.stringify,
    } = config

    const data = serialize({ state, version })

    switch (storage) {
      case 'local':
        localStorage.setItem(key, data)
        break
      case 'session':
        sessionStorage.setItem(key, data)
        break
      default:
        this.memoryStorage.set(key, data)
    }
  }

  retrieve(key: string, config: PersistenceConfig = {}) {
    const {
      storage = 'memory',
      deserialize = JSON.parse,
      migrate
    } = config

    let data: string | null = null

    switch (storage) {
      case 'local':
        data = localStorage.getItem(key)
        break
      case 'session':
        data = sessionStorage.getItem(key)
        break
      default:
        data = this.memoryStorage.get(key) || null
    }

    if (!data) return null

    const { state, version } = deserialize(data)
    return migrate ? migrate(state, version) : state
  }

  remove(key: string, storage: 'local' | 'session' | 'memory' = 'memory') {
    switch (storage) {
      case 'local':
        localStorage.removeItem(key)
        break
      case 'session':
        sessionStorage.removeItem(key)
        break
      default:
        this.memoryStorage.delete(key)
    }
  }
}
