# FamilyManager SDK Documentation

## Overview

The FamilyManager SDK provides core functionality and utilities for building FamilyManager applications and modules. This documentation covers the main components, setup, and usage of the SDK.

## Components

- **EventBus**: Pub/sub event system for communication between components
- **Logger**: Structured logging with multiple output formats and levels
- **Authentication**: User authentication and session management
- **Calendar Integration**: Google Calendar and iCal integration utilities

## Getting Started

```typescript
import { Logger, EventBus } from '@familymanager/sdk';

// Initialize logger
const logger = new Logger({
    level: 'info',
    format: 'json'
});

// Initialize event bus
const eventBus = new EventBus();

// Subscribe to events
eventBus.on('calendar:update', (event) => {
    logger.info('Calendar updated', { event });
});
```

## Documentation Sections

- [API Documentation](api.md)
- [Events System](events.md)
- [Logging System](logging.md)

## Contributing

See the main project README for contribution guidelines.
