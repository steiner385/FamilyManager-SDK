import { useState, useEffect } from 'react'
import { StatePersistenceManager } from '../core/state/StatePersistenceManager'

export function usePersistentState<T>(
  key: string,
  initialState: T,
  config?: PersistenceConfig
) {
  const manager = StatePersistenceManager.getInstance()
  
  const [state, setState] = useState<T>(() => {
    const persisted = manager.retrieve(key, config)
    return persisted ?? initialState
  })

  useEffect(() => {
    manager.persist(key, state, config)
  }, [key, state, config])

  return [state, setState] as const
}
