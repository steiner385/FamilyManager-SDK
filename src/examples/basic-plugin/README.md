# Basic Plugin Example

This example demonstrates how to create a plugin using the FamilyManager Plugin SDK. It shows the core functionality that plugins can implement, including:

- Plugin lifecycle management (init, start, stop)
- Configuration management with validation
- Event handling and publishing
- Health checks
- Logging

## Plugin Structure

```typescript
class BasicPlugin extends BasePlugin {
  // Plugin implementation
}
```

### Configuration

The plugin uses Zod for configuration validation:

```typescript
const configSchema = z.object({
  greeting: z.string().min(1),
  logLevel: z.enum(['debug', 'info', 'warn', 'error']).default('info')
});
```

### Events

The plugin subscribes to and publishes events:

- Subscriptions:
  - `user.created`: Sends a greeting when a new user is created
  - `family.updated`: Logs family updates

- Publications:
  - `basic-plugin.greeting`: Sends greeting messages

## Usage

1. Create a plugin instance:

```typescript
const plugin = new BasicPlugin();
```

2. Configure the plugin:

```typescript
plugin.context.config = {
  greeting: 'Hello from Basic Plugin!',
  logLevel: 'info'
};
```

3. Initialize and start:

```typescript
await plugin.init();
await plugin.start();
```

4. Update configuration:

```typescript
await plugin.updateConfig({
  greeting: 'Updated greeting!',
  logLevel: 'debug'
});
```

5. Stop when done:

```typescript
await plugin.stop();
```

## Testing

The example includes comprehensive tests demonstrating how to:

- Mock plugin dependencies (EventBus, Logger)
- Test lifecycle methods
- Test event handling
- Test configuration updates
- Test health checks

Run the tests:

```bash
npm test src/sdk/examples/basic-plugin
```

## Key Features Demonstrated

1. **Lifecycle Management**
   - Proper initialization sequence
   - Resource cleanup on stop
   - State management

2. **Configuration**
   - Schema-based validation
   - Runtime configuration updates
   - Type-safe configuration access

3. **Event System**
   - Event subscription
   - Event publishing
   - Event handling with error management

4. **Health Checks**
   - Custom health check implementation
   - Health metrics
   - Status reporting

5. **Logging**
   - Structured logging
   - Log levels
   - Context-aware logging

## Best Practices Shown

1. **Type Safety**
   - TypeScript interfaces
   - Zod schema validation
   - Proper error handling

2. **Testing**
   - Unit tests
   - Dependency mocking
   - Test organization

3. **Error Handling**
   - Graceful error recovery
   - Error reporting
   - Type-safe errors

4. **Configuration Management**
   - Validation
   - Safe defaults
   - Runtime updates

5. **Documentation**
   - Code comments
   - Type definitions
   - Usage examples

## Extending the Example

To create your own plugin:

1. Create a new class extending `BasePlugin`
2. Define your configuration schema
3. Implement required methods (`onInit`, `onStart`, `onStop`)
4. Add event handlers as needed
5. Implement custom health checks
6. Add tests following the example pattern

## Common Patterns

1. **Event Handling**
```typescript
protected async handleEvent(event: Event): Promise<void> {
  switch (event.type) {
    case 'user.created':
      // Handle user creation
      break;
    case 'family.updated':
      // Handle family update
      break;
  }
}
```

2. **Configuration Updates**
```typescript
async onConfigChange(config: Config): Promise<void> {
  // Validate and apply new configuration
  // Update plugin behavior
  // Notify interested parties
}
```

3. **Health Checks**
```typescript
async getHealth(): Promise<PluginHealthCheck> {
  // Check plugin health
  // Collect metrics
  // Return health status
}
```

## Related Documentation

- [Plugin Development Guide](../../docs/plugin-development.md)
- [Event System](../../docs/event-system.md)
- [Configuration](../../docs/configuration.md)
- [Testing Guide](../../docs/testing.md)
