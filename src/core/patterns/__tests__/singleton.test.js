import { Singleton } from '../singleton';
class TestSingleton extends Singleton {
    constructor() {
        super();
        this.value = 0;
    }
    static getInstance() {
        return this._getInstance();
    }
    setValue(value) {
        this.value = value;
    }
    getValue() {
        return this.value;
    }
}
// Anonymous class for testing constructor name validation
const createAnonymousClass = () => {
    return class extends Singleton {
        static getInstance() {
            return this._getInstance();
        }
    };
};
describe('Singleton', () => {
    beforeEach(() => {
        TestSingleton.resetInstance();
    });
    describe('instance management', () => {
        it('should create a single instance', () => {
            const instance1 = TestSingleton.getInstance();
            const instance2 = TestSingleton.getInstance();
            expect(instance1).toBe(instance2);
        });
        it('should maintain state between getInstance calls', () => {
            const instance1 = TestSingleton.getInstance();
            instance1.setValue(42);
            const instance2 = TestSingleton.getInstance();
            expect(instance2.getValue()).toBe(42);
        });
        it('should create new instance after reset', () => {
            const instance1 = TestSingleton.getInstance();
            instance1.setValue(42);
            TestSingleton.resetInstance();
            const instance2 = TestSingleton.getInstance();
            expect(instance1).not.toBe(instance2);
            expect(instance2.getValue()).toBe(0);
        });
    });
    describe('constructor validation', () => {
        it('should throw error for anonymous class', () => {
            const AnonymousClass = createAnonymousClass();
            expect(() => AnonymousClass.getInstance()).toThrow('Singleton class must have a name');
        });
        it('should not allow direct instantiation', () => {
            expect(() => new TestSingleton()).toThrow('Singleton must be instantiated through getInstance()');
        });
    });
    describe('type safety', () => {
        it('should maintain proper typing', () => {
            const instance = TestSingleton.getInstance();
            instance.setValue(42);
            // TypeScript compilation check: these should compile without errors
            const value = instance.getValue();
            expect(value).toBe(42);
            // Verify TypeScript prevents calling non-existent methods
            // @ts-expect-error Testing type safety
            const result = instance.nonExistentMethod?.();
            expect(result).toBeUndefined();
        });
    });
});
//# sourceMappingURL=singleton.test.js.map