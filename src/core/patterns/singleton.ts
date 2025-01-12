/**
 * Base class for implementing the Singleton pattern.
 * Ensures only one instance of a class exists and provides global access to it.
 */
export abstract class Singleton {
  private static readonly instances = new Map<string, any>();
  private static _isCreatingInstance = false;

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
  protected static _getInstance<T extends Singleton>(this: any): T {
    const className = this.name;
    if (!Singleton.instances.has(className)) {
      try {
        Singleton._isCreatingInstance = true;
        const instance = new this();
        Singleton.instances.set(className, instance);
      } catch (error) {
        if (error instanceof Error && error.message === 'Singleton class must have a name and be extended') {
          throw error;
        }
        // Re-throw other errors
        throw error;
      } finally {
        Singleton._isCreatingInstance = false;
      }
    }
    return Singleton.instances.get(className);
  }

  /**
   * Resets the singleton instance (primarily for testing purposes).
   */
  public static resetInstance(): void {
    const className = this.name;
    Singleton.instances.delete(className);
  }
}
