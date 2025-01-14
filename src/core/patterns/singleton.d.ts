/**
 * Base class for implementing the Singleton pattern.
 * Ensures only one instance of a class exists and provides global access to it.
 */
export declare abstract class Singleton {
    private static readonly instances;
    private static _isCreatingInstance;
    /**
     * Constructor to prevent direct construction calls with the `new` operator.
     */
    constructor();
    /**
     * Gets the singleton instance of the class.
     * This method should be called by derived classes to get their singleton instance.
     */
    protected static _getInstance<T extends Singleton>(this: any): T;
    /**
     * Resets the singleton instance (primarily for testing purposes).
     */
    static resetInstance(): void;
}
//# sourceMappingURL=singleton.d.ts.map