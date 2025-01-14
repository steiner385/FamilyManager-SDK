export class StatePersistenceManager {
    constructor() {
        this.memoryStorage = new Map();
    }
    static getInstance() {
        if (!StatePersistenceManager.instance) {
            StatePersistenceManager.instance = new StatePersistenceManager();
        }
        return StatePersistenceManager.instance;
    }
    persist(key, state, config = {}) {
        const { storage = 'memory', version = 1, serialize = JSON.stringify, } = config;
        const data = serialize({ state, version });
        switch (storage) {
            case 'local':
                localStorage.setItem(key, data);
                break;
            case 'session':
                sessionStorage.setItem(key, data);
                break;
            default:
                this.memoryStorage.set(key, data);
        }
    }
    retrieve(key, config = {}) {
        const { storage = 'memory', deserialize = JSON.parse, migrate } = config;
        let data = null;
        switch (storage) {
            case 'local':
                data = localStorage.getItem(key);
                break;
            case 'session':
                data = sessionStorage.getItem(key);
                break;
            default:
                data = this.memoryStorage.get(key) || null;
        }
        if (!data)
            return null;
        const { state, version } = deserialize(data);
        return migrate ? migrate(state, version) : state;
    }
    remove(key, storage = 'memory') {
        switch (storage) {
            case 'local':
                localStorage.removeItem(key);
                break;
            case 'session':
                sessionStorage.removeItem(key);
                break;
            default:
                this.memoryStorage.delete(key);
        }
    }
}
//# sourceMappingURL=StatePersistenceManager.js.map