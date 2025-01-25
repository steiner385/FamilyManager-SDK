# FamilyManager Events System

## Overview

The Events System provides a pub/sub mechanism for communication between different parts of the FamilyManager ecosystem.

## Event Types

### Calendar Events
- `calendar:update`
- `calendar:delete`
- `calendar:sync`

### Task Events
- `task:create`
- `task:update`
- `task:complete`

### Shopping List Events
- `shopping:add`
- `shopping:remove`
- `shopping:update`

## Usage

```typescript
import { EventBus } from '@familymanager/sdk';

const eventBus = new EventBus();

// Subscribe to events
eventBus.on('calendar:update', (event) => {
    console.log('Calendar updated:', event);
});

// Emit events
eventBus.emit('calendar:update', {
    id: '123',
    title: 'Family Dinner',
    date: '2024-01-01'
});
```

## Best Practices

1. Use typed event payloads
2. Handle errors in event handlers
3. Clean up subscriptions when components unmount
