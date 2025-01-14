/**
 * Base class for implementing the Singleton pattern.
 * Ensures only one instance of a class exists and provides global access to it.
 */
export class Singleton {
    /**
     * Constructor to prevent direct construction calls with the `new` operator.
     */
    constructor() {
        const className = this.constructor.name;
        if (!className || className === 'Singleton') {
            throw new Error('Singleton class must have a name and be extended');
        }
        if (!Singleton._isCreatingInstance) {
            throw new Error('Singleton must be instantiated through getInstance()');
        }
    }
    /**
     * Gets the singleton instance of the class.
     * This method should be called by derived classes to get their singleton instance.
     */
    static _getInstance() {
        const className = this.name;
        if (!Singleton.instances.has(className)) {
            try {
                Singleton._isCreatingInstance = true;
                const instance = new this();
                Singleton.instances.set(className, instance);
            }
            catch (error) {
                if (error instanceof Error && error.message === 'Singleton class must have a name and be extended') {
                    throw error;
                }
                // Re-throw other errors
                throw error;
            }
            finally {
                Singleton._isCreatingInstance = false;
            }
        }
        return Singleton.instances.get(className);
    }
    /**
     * Resets the singleton instance (primarily for testing purposes).
     */
    static resetInstance() {
        const className = this.name;
        Singleton.instances.delete(className);
    }
}
Singleton.instances = new Map();
Singleton._isCreatingInstance = false;
//# sourceMappingURL=singleton.js.map