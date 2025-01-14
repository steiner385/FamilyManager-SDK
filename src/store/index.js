import { create } from 'zustand';
export const useAppStore = create((set) => ({
    isInitialized: false,
    setInitialized: (value) => set({ isInitialized: value }),
}));
export * from './auth';
//# sourceMappingURL=index.js.map