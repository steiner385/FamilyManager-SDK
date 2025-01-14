import { describe, expect, it, jest, beforeEach } from '@jest/globals';
import { ComponentLifecycle } from '../ComponentLifecycle';
describe('ComponentLifecycle', () => {
    beforeEach(() => {
        // Reset all hooks
        ComponentLifecycle.unregisterHooks('test-component');
    });
    describe('Hook Registration', () => {
        it('should register lifecycle hooks', () => {
            const hooks = {
                onMount: jest.fn(() => Promise.resolve()),
                onUnmount: jest.fn(() => Promise.resolve()),
                onUpdate: jest.fn(() => Promise.resolve()),
                onError: jest.fn(() => Promise.resolve()),
            };
            ComponentLifecycle.registerHooks('test-component', hooks);
            ComponentLifecycle.triggerMount('test-component');
            ComponentLifecycle.triggerUnmount('test-component');
            ComponentLifecycle.triggerUpdate('test-component', { oldProp: true });
            ComponentLifecycle.triggerError('test-component', new Error('test error'));
            expect(hooks.onMount).toHaveBeenCalled();
            expect(hooks.onUnmount).toHaveBeenCalled();
            expect(hooks.onUpdate).toHaveBeenCalledWith({ oldProp: true });
            expect(hooks.onError).toHaveBeenCalledWith(new Error('test error'));
        });
        it('should handle partial hook registration', () => {
            const hooks = {
                onMount: jest.fn(() => Promise.resolve()),
                onError: jest.fn(() => Promise.resolve()),
            };
            ComponentLifecycle.registerHooks('test-component', hooks);
            ComponentLifecycle.triggerMount('test-component');
            ComponentLifecycle.triggerUnmount('test-component');
            ComponentLifecycle.triggerError('test-component', new Error('test error'));
            expect(hooks.onMount).toHaveBeenCalled();
            expect(hooks.onError).toHaveBeenCalled();
        });
    });
    describe('Hook Triggering', () => {
        it('should trigger mount hook', () => {
            const onMount = jest.fn(() => Promise.resolve());
            ComponentLifecycle.registerHooks('test-component', { onMount });
            ComponentLifecycle.triggerMount('test-component');
            expect(onMount).toHaveBeenCalled();
        });
        it('should trigger unmount hook', () => {
            const onUnmount = jest.fn(() => Promise.resolve());
            ComponentLifecycle.registerHooks('test-component', { onUnmount });
            ComponentLifecycle.triggerUnmount('test-component');
            expect(onUnmount).toHaveBeenCalled();
        });
        it('should trigger update hook with previous props', () => {
            const onUpdate = jest.fn(() => Promise.resolve());
            const prevProps = { value: 'old' };
            ComponentLifecycle.registerHooks('test-component', { onUpdate });
            ComponentLifecycle.triggerUpdate('test-component', prevProps);
            expect(onUpdate).toHaveBeenCalledWith(prevProps);
        });
        it('should trigger error hook with error object', () => {
            const onError = jest.fn(() => Promise.resolve());
            const error = new Error('test error');
            ComponentLifecycle.registerHooks('test-component', { onError });
            ComponentLifecycle.triggerError('test-component', error);
            expect(onError).toHaveBeenCalledWith(error);
        });
    });
    describe('Hook Unregistration', () => {
        it('should unregister all hooks', () => {
            const hooks = {
                onMount: jest.fn(() => Promise.resolve()),
                onUnmount: jest.fn(() => Promise.resolve()),
                onUpdate: jest.fn(() => Promise.resolve()),
                onError: jest.fn(() => Promise.resolve()),
            };
            ComponentLifecycle.registerHooks('test-component', hooks);
            ComponentLifecycle.unregisterHooks('test-component');
            ComponentLifecycle.triggerMount('test-component');
            ComponentLifecycle.triggerUnmount('test-component');
            ComponentLifecycle.triggerUpdate('test-component', {});
            ComponentLifecycle.triggerError('test-component', new Error('test error'));
            expect(hooks.onMount).not.toHaveBeenCalled();
            expect(hooks.onUnmount).not.toHaveBeenCalled();
            expect(hooks.onUpdate).not.toHaveBeenCalled();
            expect(hooks.onError).not.toHaveBeenCalled();
        });
    });
    describe('Async Hook Handling', () => {
        it('should handle async mount hook', async () => {
            const onMount = jest.fn(() => Promise.resolve());
            ComponentLifecycle.registerHooks('test-component', { onMount });
            await ComponentLifecycle.triggerMount('test-component');
            expect(onMount).toHaveBeenCalled();
        });
        it('should handle async unmount hook', async () => {
            const onUnmount = jest.fn(() => Promise.resolve());
            ComponentLifecycle.registerHooks('test-component', { onUnmount });
            await ComponentLifecycle.triggerUnmount('test-component');
            expect(onUnmount).toHaveBeenCalled();
        });
        it('should handle async update hook', async () => {
            const onUpdate = jest.fn(() => Promise.resolve());
            ComponentLifecycle.registerHooks('test-component', { onUpdate });
            await ComponentLifecycle.triggerUpdate('test-component', {});
            expect(onUpdate).toHaveBeenCalled();
        });
        it('should handle async error hook', async () => {
            const onError = jest.fn(() => Promise.resolve());
            ComponentLifecycle.registerHooks('test-component', { onError });
            await ComponentLifecycle.triggerError('test-component', new Error('test error'));
            expect(onError).toHaveBeenCalled();
        });
    });
    describe('Multiple Component Handling', () => {
        it('should handle hooks for multiple components independently', () => {
            const component1Hooks = {
                onMount: jest.fn(() => Promise.resolve()),
                onUnmount: jest.fn(() => Promise.resolve()),
            };
            const component2Hooks = {
                onMount: jest.fn(() => Promise.resolve()),
                onUnmount: jest.fn(() => Promise.resolve()),
            };
            ComponentLifecycle.registerHooks('component-1', component1Hooks);
            ComponentLifecycle.registerHooks('component-2', component2Hooks);
            ComponentLifecycle.triggerMount('component-1');
            expect(component1Hooks.onMount).toHaveBeenCalled();
            expect(component2Hooks.onMount).not.toHaveBeenCalled();
            ComponentLifecycle.triggerUnmount('component-2');
            expect(component1Hooks.onUnmount).not.toHaveBeenCalled();
            expect(component2Hooks.onUnmount).toHaveBeenCalled();
        });
        it('should handle unregistering specific components', () => {
            const component1Hooks = {
                onMount: jest.fn(() => Promise.resolve()),
                onUnmount: jest.fn(() => Promise.resolve()),
            };
            const component2Hooks = {
                onMount: jest.fn(() => Promise.resolve()),
                onUnmount: jest.fn(() => Promise.resolve()),
            };
            ComponentLifecycle.registerHooks('component-1', component1Hooks);
            ComponentLifecycle.registerHooks('component-2', component2Hooks);
            ComponentLifecycle.unregisterHooks('component-1');
            ComponentLifecycle.triggerMount('component-1');
            ComponentLifecycle.triggerMount('component-2');
            expect(component1Hooks.onMount).not.toHaveBeenCalled();
            expect(component2Hooks.onMount).toHaveBeenCalled();
        });
    });
    describe('Error Handling', () => {
        it('should handle errors in mount hook', async () => {
            const error = new Error('Mount error');
            const onMount = jest.fn(() => Promise.reject(error));
            const onError = jest.fn(() => Promise.resolve());
            ComponentLifecycle.registerHooks('test-component', { onMount, onError });
            await ComponentLifecycle.triggerMount('test-component');
            expect(onMount).toHaveBeenCalled();
            expect(onError).toHaveBeenCalledWith(error);
        });
        it('should handle errors in unmount hook', async () => {
            const error = new Error('Unmount error');
            const onUnmount = jest.fn(() => Promise.reject(error));
            const onError = jest.fn(() => Promise.resolve());
            ComponentLifecycle.registerHooks('test-component', { onUnmount, onError });
            await ComponentLifecycle.triggerUnmount('test-component');
            expect(onUnmount).toHaveBeenCalled();
            expect(onError).toHaveBeenCalledWith(error);
        });
        it('should handle errors in update hook', async () => {
            const error = new Error('Update error');
            const onUpdate = jest.fn(() => Promise.reject(error));
            const onError = jest.fn(() => Promise.resolve());
            ComponentLifecycle.registerHooks('test-component', { onUpdate, onError });
            await ComponentLifecycle.triggerUpdate('test-component', {});
            expect(onUpdate).toHaveBeenCalled();
            expect(onError).toHaveBeenCalledWith(error);
        });
        it('should handle errors in error hook', async () => {
            const originalError = new Error('Original error');
            const hookError = new Error('Error hook error');
            const onError = jest.fn()
                .mockImplementationOnce(() => Promise.reject(hookError))
                .mockImplementationOnce(() => Promise.resolve());
            ComponentLifecycle.registerHooks('test-component', { onError });
            await ComponentLifecycle.triggerError('test-component', originalError);
            expect(onError).toHaveBeenNthCalledWith(1, originalError);
            expect(onError).toHaveBeenNthCalledWith(2, hookError);
        });
    });
    describe('Complex Scenarios', () => {
        it('should handle component lifecycle sequence', async () => {
            const sequence = [];
            const hooks = {
                onMount: async () => {
                    sequence.push('mount');
                },
                onUpdate: async () => {
                    sequence.push('update');
                },
                onUnmount: async () => {
                    sequence.push('unmount');
                },
            };
            ComponentLifecycle.registerHooks('test-component', hooks);
            await ComponentLifecycle.triggerMount('test-component');
            await ComponentLifecycle.triggerUpdate('test-component', {});
            await ComponentLifecycle.triggerUnmount('test-component');
            expect(sequence).toEqual(['mount', 'update', 'unmount']);
        });
        it('should handle rapid hook triggers', async () => {
            const onMount = jest.fn(() => Promise.resolve());
            ComponentLifecycle.registerHooks('test-component', { onMount });
            // Trigger mount multiple times rapidly
            await Promise.all([
                ComponentLifecycle.triggerMount('test-component'),
                ComponentLifecycle.triggerMount('test-component'),
                ComponentLifecycle.triggerMount('test-component'),
            ]);
            expect(onMount).toHaveBeenCalledTimes(3);
        });
    });
});
//# sourceMappingURL=ComponentLifecycle.test.js.map