import { create } from 'zustand';
export function createComponentState(initialState) {
    return create((set) => ({
        state: initialState,
        setState: (value) => set((prev) => ({
            state: { ...prev.state, ...value }
        })),
        reset: () => set({ state: initialState }),
    }));
}
//# sourceMappingURL=createComponentState.js.map