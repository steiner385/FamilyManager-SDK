# FamilyManager SDK API Documentation

## Core APIs

### Logger

```typescript
interface LoggerConfig {
    level: 'debug' | 'info' | 'warn' | 'error';
    format: 'json' | 'text';
    destination?: 'console' | 'file';
}

class Logger {
    constructor(config: LoggerConfig);
    debug(message: string, meta?: object): void;
    info(message: string, meta?: object): void;
    warn(message: string, meta?: object): void;
    error(message: string, meta?: object): void;
}
```

### EventBus

```typescript
class EventBus {
    on(event: string, callback: Function): void;
    off(event: string, callback: Function): void;
    emit(event: string, data?: any): void;
}
```

## Usage Examples

See individual component documentation for detailed usage examples.
