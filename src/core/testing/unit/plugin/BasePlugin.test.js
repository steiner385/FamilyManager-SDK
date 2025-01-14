import { MockPlugin, DependentMockPlugin, createMockPluginContext } from '../../plugin-helpers';
import { pluginRegistry } from '../../../plugin/registry';
describe('BasePlugin', () => {
    let mockPlugin;
    let context;
    beforeEach(() => {
        mockPlugin = new MockPlugin();
        context = createMockPluginContext();
        pluginRegistry.clear();
    });
    afterEach(() => {
        pluginRegistry.clear();
    });
    it('should initialize successfully', async () => {
        await mockPlugin.initialize(context);
        expect(mockPlugin.initializeCalled).toBe(true);
    });
    it('should teardown successfully', async () => {
        await mockPlugin.initialize(context);
        await mockPlugin.teardown();
        expect(mockPlugin.teardownCalled).toBe(true);
    });
    it('should validate dependencies', async () => {
        const dependentPlugin = new DependentMockPlugin();
        // Should fail without required dependency
        await expect(dependentPlugin.initialize(context))
            .rejects
            .toThrow('Required dependency not found: mock-plugin');
        // Should succeed with required dependency
        await mockPlugin.initialize(context);
        pluginRegistry.register(mockPlugin);
        await expect(dependentPlugin.initialize(context)).resolves.not.toThrow();
    });
    it('should handle initialization errors', async () => {
        class ErrorPlugin extends MockPlugin {
            async onInitialize() {
                throw new Error('Initialization error');
            }
        }
        const errorPlugin = new ErrorPlugin();
        await expect(errorPlugin.initialize(context))
            .rejects
            .toThrow('Initialization error');
    });
});
//# sourceMappingURL=BasePlugin.test.js.map