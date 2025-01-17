export class Logger {
    constructor() {
        this.logger = console;
        this.error = jest.fn();
        this.warn = jest.fn();
        this.info = jest.fn();
        this.debug = jest.fn();
        this.setLogger = jest.fn();
        this.log = jest.fn();
    }
    static getInstance() {
        if (!Logger.instance) {
            Logger.instance = new Logger();
        }
        return Logger.instance;
    }
}
//# sourceMappingURL=Logger.js.map