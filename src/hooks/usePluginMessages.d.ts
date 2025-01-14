import type { Message } from '../types/plugin';
export declare function usePluginMessages(pluginId: string, messageTypes?: string[]): {
    publish: (type: string, payload?: any) => void;
    subscribe: (callback: (message: Message) => void, filter?: (message: Message) => boolean) => () => void;
    getHistory: (filter?: (message: Message) => boolean) => Message[];
};
//# sourceMappingURL=usePluginMessages.d.ts.map