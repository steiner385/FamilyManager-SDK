import { parentPort } from 'worker_threads';
if (!parentPort) {
    throw new Error('This module must be run as a worker thread');
}
function validateEvent(event) {
    try {
        const errors = [];
        // Required fields
        if (!event.type || typeof event.type !== 'string') {
            errors.push({
                path: ['type'],
                code: 'INVALID_TYPE',
                message: 'Event must have a string type'
            });
        }
        if (typeof event.timestamp !== 'number') {
            errors.push({
                path: ['timestamp'],
                code: 'INVALID_TIMESTAMP',
                message: 'Event must have a numeric timestamp'
            });
        }
        // Optional fields
        if (event.source !== undefined && typeof event.source !== 'string') {
            errors.push({
                path: ['source'],
                code: 'INVALID_SOURCE',
                message: 'Event source must be a string if provided'
            });
        }
        if (event.data === undefined || event.data === null) {
            errors.push({
                path: ['data'],
                code: 'MISSING_DATA',
                message: 'Event data is required'
            });
        }
        // Validate timestamp is not in the future
        if (event.timestamp > Date.now() + 1000) { // Allow 1 second buffer for clock skew
            errors.push({
                path: ['timestamp'],
                code: 'FUTURE_TIMESTAMP',
                message: 'Event timestamp cannot be in the future'
            });
        }
        // Validate type format (e.g. USER.CREATED, AUTH.LOGIN)
        if (!/^[A-Z][A-Z0-9_]*(?:\.[A-Z][A-Z0-9_]*)*$/.test(event.type)) {
            errors.push({
                path: ['type'],
                code: 'INVALID_TYPE_FORMAT',
                message: 'Event type must be uppercase with dots as separators'
            });
        }
        return {
            isValid: errors.length === 0,
            errors
        };
    }
    catch (error) {
        return {
            isValid: false,
            errors: [{
                    path: ['validator'],
                    code: 'VALIDATION_ERROR',
                    message: error instanceof Error ? error.message : 'Unknown validation error'
                }]
        };
    }
}
// Handle messages from the main thread
parentPort.on('message', (event) => {
    try {
        const result = validateEvent(event);
        parentPort.postMessage(result);
    }
    catch (error) {
        parentPort.postMessage({
            isValid: false,
            errors: [{
                    path: ['worker'],
                    code: 'WORKER_ERROR',
                    message: error instanceof Error ? error.message : 'Unknown worker error'
                }]
        });
    }
});
// Handle worker cleanup
process.on('exit', () => {
    if (parentPort) {
        parentPort.removeAllListeners('message');
    }
});
process.on('uncaughtException', (error) => {
    console.error('Uncaught exception in validator worker:', error);
    process.exit(1);
});
process.on('unhandledRejection', (error) => {
    console.error('Unhandled rejection in validator worker:', error);
    process.exit(1);
});
//# sourceMappingURL=validator.worker.js.map