export class EventBus {
  private static instance: EventBus;
  private isRunning = false;
  private handlers = new Map();
  private startPromise: Promise<void> | null = null;
  private logger = console;

  publish = jest.fn().mockResolvedValue({ status: 'DELIVERED', errors: [] });
  getRunningState = jest.fn().mockReturnValue(true);
  registerChannel = jest.fn();
  start = jest.fn().mockResolvedValue(undefined);
  stop = jest.fn().mockResolvedValue(undefined);
  subscribe = jest.fn().mockReturnValue(() => {});
  ensureRunning = jest.fn().mockResolvedValue(undefined);
  unsubscribe = jest.fn();
  getChannels = jest.fn().mockReturnValue([]);
  restart = jest.fn().mockResolvedValue(undefined);

  static getInstance(): EventBus {
    if (!EventBus.instance) {
      EventBus.instance = new EventBus();
    }
    return EventBus.instance;
  }

  static resetInstance(): void {
    EventBus.instance = new EventBus();
  }
}
