import { create } from 'zustand'

interface ComponentState<T> {
  state: T
  setState: (value: Partial<T>) => void
  reset: () => void
}

export function createComponentState<T>(initialState: T) {
  return create<ComponentState<T>>((set) => ({
    state: initialState,
    setState: (value) => set((prev) => ({ 
      state: { ...prev.state, ...value } 
    })),
    reset: () => set({ state: initialState }),
  }))
}
