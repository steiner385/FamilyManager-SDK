import type { Message } from '../../types/plugin';
export declare class PluginMessageBus {
    private static instance;
    private subscriptions;
    private messageHistory;
    private readonly historyLimit;
    static getInstance(): PluginMessageBus;
    publish(source: string, type: string, payload?: any): void;
    subscribe(pluginId: string, callback: (message: Message) => void, filter?: (message: Message) => boolean): () => void;
    unsubscribe(pluginId: string, callback: (message: Message) => void): void;
    getHistory(filter?: (message: Message) => boolean): Message[];
}
//# sourceMappingURL=PluginMessageBus.d.ts.map