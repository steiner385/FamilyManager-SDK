import { ComponentEventEmitter } from '../events/ComponentEventEmitter'

export interface LifecycleHooks {
  onMount?: () => void | Promise<void>
  onUnmount?: () => void | Promise<void>
  onUpdate?: (prevProps: any) => void | Promise<void>
  onError?: (error: Error) => void | Promise<void>
}

export class ComponentLifecycle {
  private static emitter = new ComponentEventEmitter()
  private static hookMap = new Map<string, LifecycleHooks>()

  static registerHooks(componentId: string, hooks: LifecycleHooks) {
    this.hookMap.set(componentId, hooks)

    if (hooks.onMount) {
      this.emitter.on(`${componentId}:mount`, hooks.onMount)
    }
    if (hooks.onUnmount) {
      this.emitter.on(`${componentId}:unmount`, hooks.onUnmount)
    }
    if (hooks.onUpdate) {
      this.emitter.on(`${componentId}:update`, hooks.onUpdate)
    }
    if (hooks.onError) {
      this.emitter.on(`${componentId}:error`, hooks.onError)
    }
  }

  static unregisterHooks(componentId: string) {
    const hooks = this.hookMap.get(componentId)
    if (!hooks) return

    if (hooks.onMount) {
      this.emitter.off(`${componentId}:mount`, hooks.onMount)
    }
    if (hooks.onUnmount) {
      this.emitter.off(`${componentId}:unmount`, hooks.onUnmount)
    }
    if (hooks.onUpdate) {
      this.emitter.off(`${componentId}:update`, hooks.onUpdate)
    }
    if (hooks.onError) {
      this.emitter.off(`${componentId}:error`, hooks.onError)
    }

    this.hookMap.delete(componentId)
  }

  static async triggerMount(componentId: string) {
    try {
      await this.emitter.emitAsync(`${componentId}:mount`)
    } catch (error) {
      if (error instanceof Error) {
        await this.triggerError(componentId, error)
      }
    }
  }

  static async triggerUnmount(componentId: string) {
    try {
      await this.emitter.emitAsync(`${componentId}:unmount`)
    } catch (error) {
      if (error instanceof Error) {
        await this.triggerError(componentId, error)
      }
    }
  }

  static async triggerUpdate(componentId: string, prevProps: any) {
    try {
      await this.emitter.emitAsync(`${componentId}:update`, prevProps)
    } catch (error) {
      if (error instanceof Error) {
        await this.triggerError(componentId, error)
      }
    }
  }

  static async triggerError(componentId: string, error: Error) {
    try {
      await this.emitter.emitAsync(`${componentId}:error`, error)
    } catch (hookError) {
      // If error handler throws, call it again with the new error
      if (hookError instanceof Error && hookError !== error) {
        await this.triggerError(componentId, hookError)
      }
    }
  }
}
