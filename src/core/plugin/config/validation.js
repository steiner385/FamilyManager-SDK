export class DefaultConfigValidator {
    validate(config, schema, context) {
        const errors = [];
        const configPath = context.configPath || [];
        for (const [key, def] of Object.entries(schema)) {
            const currentPath = [...configPath, key];
            this.validateField(config[key], def, currentPath, context, errors);
        }
        return {
            isValid: errors.length === 0,
            errors
        };
    }
    validateField(value, def, path, context, errors) {
        if (def.required && value === undefined) {
            errors.push({
                path,
                code: 'REQUIRED',
                message: `Required field ${path.join('.')} is missing`
            });
            return;
        }
        if (value !== undefined) {
            if (typeof value !== def.type) {
                errors.push({
                    path,
                    code: 'INVALID_TYPE',
                    message: `Expected ${def.type} for ${path.join('.')}, got ${typeof value}`
                });
            }
            if (def.validate && !def.validate(value)) {
                errors.push({
                    path,
                    code: 'VALIDATION_FAILED',
                    message: `Validation failed for ${path.join('.')}`
                });
            }
        }
    }
}
//# sourceMappingURL=validation.js.map