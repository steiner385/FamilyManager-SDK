export class AsyncValidator {
    constructor(config = {}) {
        this.rules = [];
        this.isRunning = false;
        this.config = {
            validateTimestamp: config.validateTimestamp ?? true,
            validateSchema: config.validateSchema ?? true,
            validatePayload: config.validatePayload ?? true,
            rules: config.rules ?? []
        };
        this.rules = this.config.rules;
        this.start();
    }
    async start() {
        if (this.isRunning)
            return;
        this.isRunning = true;
    }
    async stop() {
        if (!this.isRunning)
            return;
        this.isRunning = false;
    }
    async validate(event) {
        if (!this.isRunning) {
            return {
                isValid: false,
                errors: [{
                        path: ['validator'],
                        code: 'VALIDATOR_NOT_RUNNING',
                        message: 'Validator is not running'
                    }]
            };
        }
        const errors = [];
        // Schema validation
        if (this.config.validateSchema) {
            if (!event.id) {
                errors.push({
                    path: ['id'],
                    code: 'MISSING_FIELD',
                    message: 'Missing required field: id'
                });
            }
            if (!event.type || event.type.trim() === '') {
                errors.push({
                    path: ['type'],
                    code: 'INVALID_TYPE',
                    message: 'Invalid event type'
                });
            }
            if (!event.channel) {
                errors.push({
                    path: ['channel'],
                    code: 'MISSING_FIELD',
                    message: 'Missing required field: channel'
                });
            }
            if (event.data === undefined || event.data === null) {
                errors.push({
                    path: ['data'],
                    code: 'MISSING_FIELD',
                    message: 'Missing required field: data'
                });
            }
        }
        // Timestamp validation
        if (this.config.validateTimestamp && (typeof event.timestamp !== 'number' || event.timestamp < 0)) {
            errors.push({
                path: ['timestamp'],
                code: 'INVALID_TIMESTAMP',
                message: 'Invalid timestamp'
            });
        }
        // Run custom validation rules
        for (const rule of this.rules) {
            try {
                const isValid = await Promise.resolve(rule.validate(event));
                if (!isValid) {
                    errors.push({
                        path: rule.errorPath,
                        code: rule.errorCode,
                        message: rule.errorMessage
                    });
                }
            }
            catch (error) {
                errors.push({
                    path: rule.errorPath,
                    code: 'VALIDATION_ERROR',
                    message: error instanceof Error ? error.message : 'Unknown validation error'
                });
            }
        }
        return {
            isValid: errors.length === 0,
            errors
        };
    }
    async validateBatch(events) {
        return Promise.all(events.map(event => this.validate(event)));
    }
    addRule(rule) {
        this.rules.push(rule);
    }
    clearRules() {
        this.rules = [];
    }
    updateConfig(config) {
        this.config = {
            ...this.config,
            ...config,
            rules: config.rules ?? this.config.rules
        };
        if (config.rules) {
            this.rules = config.rules;
        }
    }
    getRunningState() {
        return this.isRunning;
    }
}
//# sourceMappingURL=validator.js.map