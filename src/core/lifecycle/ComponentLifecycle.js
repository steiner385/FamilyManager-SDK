import { ComponentEventEmitter } from '../events/ComponentEventEmitter';
export class ComponentLifecycle {
    static registerHooks(componentId, hooks) {
        this.hookMap.set(componentId, hooks);
        if (hooks.onMount) {
            this.emitter.on(`${componentId}:mount`, hooks.onMount);
        }
        if (hooks.onUnmount) {
            this.emitter.on(`${componentId}:unmount`, hooks.onUnmount);
        }
        if (hooks.onUpdate) {
            this.emitter.on(`${componentId}:update`, hooks.onUpdate);
        }
        if (hooks.onError) {
            this.emitter.on(`${componentId}:error`, hooks.onError);
        }
    }
    static unregisterHooks(componentId) {
        const hooks = this.hookMap.get(componentId);
        if (!hooks)
            return;
        if (hooks.onMount) {
            this.emitter.off(`${componentId}:mount`, hooks.onMount);
        }
        if (hooks.onUnmount) {
            this.emitter.off(`${componentId}:unmount`, hooks.onUnmount);
        }
        if (hooks.onUpdate) {
            this.emitter.off(`${componentId}:update`, hooks.onUpdate);
        }
        if (hooks.onError) {
            this.emitter.off(`${componentId}:error`, hooks.onError);
        }
        this.hookMap.delete(componentId);
    }
    static async triggerMount(componentId) {
        try {
            await this.emitter.emitAsync(`${componentId}:mount`);
        }
        catch (error) {
            if (error instanceof Error) {
                await this.triggerError(componentId, error);
            }
        }
    }
    static async triggerUnmount(componentId) {
        try {
            await this.emitter.emitAsync(`${componentId}:unmount`);
        }
        catch (error) {
            if (error instanceof Error) {
                await this.triggerError(componentId, error);
            }
        }
    }
    static async triggerUpdate(componentId, prevProps) {
        try {
            await this.emitter.emitAsync(`${componentId}:update`, prevProps);
        }
        catch (error) {
            if (error instanceof Error) {
                await this.triggerError(componentId, error);
            }
        }
    }
    static async triggerError(componentId, error) {
        try {
            await this.emitter.emitAsync(`${componentId}:error`, error);
        }
        catch (hookError) {
            // If error handler throws, call it again with the new error
            if (hookError instanceof Error && hookError !== error) {
                await this.triggerError(componentId, hookError);
            }
        }
    }
}
ComponentLifecycle.emitter = new ComponentEventEmitter();
ComponentLifecycle.hookMap = new Map();
//# sourceMappingURL=ComponentLifecycle.js.map