import { PluginContext, PluginMetadata } from '../plugin/types';
import { BasePlugin } from '../plugin/base';
export declare function createMockPluginContext(): PluginContext;
export declare class MockPlugin extends BasePlugin {
    initializeCalled: boolean;
    teardownCalled: boolean;
    readonly metadata: PluginMetadata;
    protected onInitialize(): Promise<void>;
    protected onTeardown(): Promise<void>;
}
export declare class DependentMockPlugin extends BasePlugin {
    initializeCalled: boolean;
    teardownCalled: boolean;
    readonly metadata: PluginMetadata;
    protected onInitialize(): Promise<void>;
    protected onTeardown(): Promise<void>;
}
//# sourceMappingURL=plugin-helpers.d.ts.map