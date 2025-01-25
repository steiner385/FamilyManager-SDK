import { useEffect } from 'react'
import { ComponentEventEmitter } from '../core/events/ComponentEventEmitter'

export function useComponentEvent(
  emitter: ComponentEventEmitter,
  event: string,
  callback: (...args: any[]) => void
) {
  useEffect(() => {
    return emitter.on(event, callback)
  }, [emitter, event, callback])
}
