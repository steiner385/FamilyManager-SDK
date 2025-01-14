/**
 * Event error types
 */
export var EventErrorType;
(function (EventErrorType) {
    EventErrorType["VALIDATION"] = "validation_error";
    EventErrorType["HANDLER"] = "handler_error";
    EventErrorType["TIMEOUT"] = "timeout_error";
    EventErrorType["PUBLICATION"] = "publication_error";
    EventErrorType["SUBSCRIPTION"] = "subscription_error";
})(EventErrorType || (EventErrorType = {}));
/**
 * Event error class
 */
export class EventError extends Error {
    constructor(type, message, event, details) {
        super(message);
        this.type = type;
        this.event = event;
        this.details = details;
        this.name = 'EventError';
    }
}
//# sourceMappingURL=types.js.map