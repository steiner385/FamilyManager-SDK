import * as winston from 'winston';
export declare const logger: winston.Logger;
export type Logger = typeof logger;
export declare const createChildLogger: (context: string) => Logger;
export default logger;
//# sourceMappingURL=logger.d.ts.map