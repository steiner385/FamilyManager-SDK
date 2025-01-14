import { PluginContext, PluginMetadata } from './types';
import type { Env } from 'hono/types';
export declare abstract class BasePlugin {
    private initialized;
    abstract readonly metadata: PluginMetadata;
    private eventBus;
    constructor();
    initialize(context: PluginContext<Env>): Promise<void>;
    teardown(): Promise<void>;
    onError(error: Error): Promise<void>;
    onDependencyChange(dependency: string): Promise<void>;
    protected checkInitialized(): void;
    protected abstract onInitialize(context: PluginContext<Env>): Promise<void>;
    protected abstract onTeardown(): Promise<void>;
}
//# sourceMappingURL=base.d.ts.map