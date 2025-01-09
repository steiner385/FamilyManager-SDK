import { ComponentEventEmitter } from '../events/ComponentEventEmitter'

export interface LifecycleHooks {
  onMount?: () => void | Promise<void>
  onUnmount?: () => void | Promise<void>
  onUpdate?: (prevProps: any) => void | Promise<void>
  onError?: (error: Error) => void | Promise<void>
}

export class ComponentLifecycle {
  private static emitter = new ComponentEventEmitter()

  static registerHooks(componentId: string, hooks: LifecycleHooks) {
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
    this.emitter.clear()
  }

  static triggerMount(componentId: string) {
    this.emitter.emit(`${componentId}:mount`)
  }

  static triggerUnmount(componentId: string) {
    this.emitter.emit(`${componentId}:unmount`)
  }

  static triggerUpdate(componentId: string, prevProps: any) {
    this.emitter.emit(`${componentId}:update`, prevProps)
  }

  static triggerError(componentId: string, error: Error) {
    this.emitter.emit(`${componentId}:error`, error)
  }
}
