import { PluginConfig } from '../../types';

export interface ValidationResult {
  isValid: boolean;
  errors: ValidationError[];
}

export interface ValidationError {
  message: string;
  field?: string;
}

export class ValidationMiddleware {
  async validate(config: PluginConfig): Promise<ValidationResult> {
    const errors: ValidationError[] = [];

    // Validate required fields
    if (!config.name) {
      errors.push({
        field: 'name',
        message: 'Plugin name is required'
      });
    }

    if (!config.version) {
      errors.push({
        field: 'version',
        message: 'Plugin version is required'
      });
    }

    // Validate version format (semver)
    if (config.version && !this.isValidVersion(config.version)) {
      errors.push({
        field: 'version',
        message: 'Invalid version format. Must be semver (e.g., 1.0.0)'
      });
    }

    // Validate dependencies if present
    if (config.dependencies) {
      for (const [dep, version] of Object.entries(config.dependencies)) {
        if (!this.isValidVersion(version)) {
          errors.push({
            field: `dependencies.${dep}`,
            message: `Invalid version format for dependency ${dep}`
          });
        }
      }
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  private isValidVersion(version: string): boolean {
    const semverRegex = /^(\d+)\.(\d+)\.(\d+)(?:-([0-9A-Za-z-]+(?:\.[0-9A-Za-z-]+)*))?(?:\+[0-9A-Za-z-]+)?$/;
    return semverRegex.test(version);
  }
}

export const createValidationMiddleware = (): ValidationMiddleware => {
  return new ValidationMiddleware();
};
