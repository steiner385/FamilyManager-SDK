/**
 * Simple logger implementation for plugins
 */
export class Logger {
    constructor(name) {
        this.name = name;
    }
    info(message, ...args) {
        console.log(`[${this.name}] ${message}`, ...args);
    }
    error(message, error) {
        console.error(`[${this.name}] ${message}`, error);
    }
    warn(message, ...args) {
        console.warn(`[${this.name}] ${message}`, ...args);
    }
    debug(message, ...args) {
        console.debug(`[${this.name}] ${message}`, ...args);
    }
}
//# sourceMappingURL=logger.js.map