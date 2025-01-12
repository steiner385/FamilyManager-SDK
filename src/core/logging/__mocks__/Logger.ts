export class Logger {
  private static instance: Logger;
  private logger = console;

  static getInstance(): Logger {
    if (!Logger.instance) {
      Logger.instance = new Logger();
    }
    return Logger.instance;
  }

  error = jest.fn();
  warn = jest.fn();
  info = jest.fn();
  debug = jest.fn();
  setLogger = jest.fn();
  log = jest.fn();
}
