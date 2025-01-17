export class EventBus {
    constructor() {
        this.isRunning = false;
        this.handlers = new Map();
        this.startPromise = null;
        this.logger = console;
        this.publish = jest.fn().mockResolvedValue({ status: 'DELIVERED', errors: [] });
        this.getRunningState = jest.fn().mockReturnValue(true);
        this.registerChannel = jest.fn();
        this.start = jest.fn().mockResolvedValue(undefined);
        this.stop = jest.fn().mockResolvedValue(undefined);
        this.subscribe = jest.fn().mockReturnValue(() => { });
        this.ensureRunning = jest.fn().mockResolvedValue(undefined);
        this.unsubscribe = jest.fn();
        this.getChannels = jest.fn().mockReturnValue([]);
        this.restart = jest.fn().mockResolvedValue(undefined);
    }
    static getInstance() {
        if (!EventBus.instance) {
            EventBus.instance = new EventBus();
        }
        return EventBus.instance;
    }
    static resetInstance() {
        EventBus.instance = new EventBus();
    }
}
//# sourceMappingURL=EventBus.js.map