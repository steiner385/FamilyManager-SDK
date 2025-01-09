# FamilyManager Logging System

## Overview

The Logging System provides structured logging capabilities with multiple output formats and log levels.

## Log Levels

- `debug`: Detailed debugging information
- `info`: General information about system operation
- `warn`: Warning messages for potentially harmful situations
- `error`: Error messages for serious problems

## Configuration

```typescript
import { Logger } from '@familymanager/sdk';

const logger = new Logger({
    level: 'info',
    format: 'json',
    destination: 'console'
});
```

## Usage Examples

```typescript
// Basic logging
logger.info('User logged in', { userId: '123' });

// Error logging with stack traces
try {
    throw new Error('Database connection failed');
} catch (error) {
    logger.error('Failed to connect', { error });
}
```

## Best Practices

1. Use appropriate log levels
2. Include relevant context in metadata
3. Handle sensitive information appropriately
4. Use structured logging in production
