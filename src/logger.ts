/**
 * Simple logger implementation for plugins
 */
export class Logger {
  private name: string;

  constructor(name: string) {
    this.name = name;
  }

  info(message: string, ...args: any[]): void {
    console.log(`[${this.name}] ${message}`, ...args);
  }

  error(message: string, error?: Error): void {
    console.error(`[${this.name}] ${message}`, error);
  }

  warn(message: string, ...args: any[]): void {
    console.warn(`[${this.name}] ${message}`, ...args);
  }

  debug(message: string, ...args: any[]): void {
    console.debug(`[${this.name}] ${message}`, ...args);
  }
}
