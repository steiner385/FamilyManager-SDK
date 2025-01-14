import { ComponentStateManager } from '../ComponentStateManager';
describe('ComponentStateManager', () => {
    beforeEach(() => {
        // Clear storage before each test
        localStorage.clear();
        sessionStorage.clear();
        ComponentStateManager['states'].clear();
    });
    describe('setState', () => {
        it('should store state in memory by default', () => {
            const state = { value: 'test' };
            ComponentStateManager.setState('test-component', state);
            expect(ComponentStateManager.getState('test-component')).toEqual(state);
        });
        it('should store state in localStorage when configured', () => {
            const state = { value: 'test' };
            ComponentStateManager.setState('test-component', state, {
                persist: true,
                scope: 'local',
                version: 1
            });
            const stored = localStorage.getItem('component:test-component:v1');
            expect(JSON.parse(stored)).toEqual(state);
        });
        it('should store state in sessionStorage when configured', () => {
            const state = { value: 'test' };
            ComponentStateManager.setState('test-component', state, {
                persist: true,
                scope: 'session',
                version: 1
            });
            const stored = sessionStorage.getItem('component:test-component:v1');
            expect(JSON.parse(stored)).toEqual(state);
        });
    });
    describe('getState', () => {
        it('should retrieve state from memory by default', () => {
            const state = { value: 'test' };
            ComponentStateManager['states'].set('component:test-component:v1', state);
            expect(ComponentStateManager.getState('test-component')).toEqual(state);
        });
        it('should retrieve state from localStorage when configured', () => {
            const state = { value: 'test' };
            localStorage.setItem('component:test-component:v1', JSON.stringify(state));
            const retrieved = ComponentStateManager.getState('test-component', {
                scope: 'local',
                version: 1
            });
            expect(retrieved).toEqual(state);
        });
        it('should retrieve state from sessionStorage when configured', () => {
            const state = { value: 'test' };
            sessionStorage.setItem('component:test-component:v1', JSON.stringify(state));
            const retrieved = ComponentStateManager.getState('test-component', {
                scope: 'session',
                version: 1
            });
            expect(retrieved).toEqual(state);
        });
        it('should return null for non-existent state', () => {
            expect(ComponentStateManager.getState('non-existent')).toBeNull();
        });
    });
    describe('clearState', () => {
        it('should clear state from memory by default', () => {
            const state = { value: 'test' };
            ComponentStateManager['states'].set('component:test-component:v1', state);
            ComponentStateManager.clearState('test-component');
            expect(ComponentStateManager.getState('test-component')).toBeNull();
        });
        it('should clear state from localStorage when configured', () => {
            localStorage.setItem('component:test-component:v1', JSON.stringify({ value: 'test' }));
            ComponentStateManager.clearState('test-component', {
                scope: 'local',
                version: 1
            });
            expect(localStorage.getItem('component:test-component:v1')).toBeNull();
        });
        it('should clear state from sessionStorage when configured', () => {
            sessionStorage.setItem('component:test-component:v1', JSON.stringify({ value: 'test' }));
            ComponentStateManager.clearState('test-component', {
                scope: 'session',
                version: 1
            });
            expect(sessionStorage.getItem('component:test-component:v1')).toBeNull();
        });
    });
});
//# sourceMappingURL=ComponentStateManager.test.js.map