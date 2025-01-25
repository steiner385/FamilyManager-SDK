# FamilyManager Plugin SDK Examples

This directory contains example plugins demonstrating various features and capabilities of the FamilyManager Plugin SDK. Each example is designed to showcase different aspects of plugin development and best practices.

## Available Examples

### 1. Basic Plugin
A simple plugin demonstrating core plugin concepts:
- Plugin lifecycle management
- Configuration handling
- Event system basics
- Health checks
- Logging

[View Basic Plugin Documentation](./basic-plugin/README.md)

### 2. Tasks Plugin
A full-featured plugin implementing a task management system:
- Database integration with Prisma
- REST API endpoints
- Event-driven architecture
- Family-based organization
- Advanced configuration
- Comprehensive testing

[View Tasks Plugin Documentation](./tasks-plugin/README.md)

## Running the Examples

1. Install dependencies:
```bash
npm install
```

2. Run tests:
```bash
# Run all example tests
npm test src/sdk/examples

# Run specific example tests
npm test src/sdk/examples/basic-plugin
npm test src/sdk/examples/tasks-plugin
```

## Example Structure

Each example follows this structure:
```
example-plugin/
├── README.md           # Documentation
├── index.ts           # Plugin implementation
├── prisma/            # Database schema (if applicable)
└── __tests__/         # Test files
```

## Learning Path

1. Start with the Basic Plugin to understand:
   - Plugin lifecycle
   - Event system basics
   - Configuration management
   - Basic testing

2. Move to the Tasks Plugin to learn about:
   - Database integration
   - API endpoints
   - Complex event handling
   - Advanced testing
   - Real-world patterns

## Common Patterns Demonstrated

1. **Plugin Initialization**
```typescript
const plugin = new ExamplePlugin();
plugin.context.config = {
  // Plugin configuration
};
await plugin.init();
await plugin.start();
```

2. **Event Handling**
```typescript
protected async handleEvent(event: Event): Promise<void> {
  switch (event.type) {
    case 'example.event':
      // Handle event
      break;
  }
}
```

3. **Configuration Management**
```typescript
const configSchema = z.object({
  // Configuration schema
});

type PluginConfig = z.infer<typeof configSchema>;
```

4. **Health Checks**
```typescript
async getHealth(): Promise<PluginHealthCheck> {
  return {
    status: 'healthy',
    timestamp: Date.now(),
    metrics: {
      // Plugin metrics
    }
  };
}
```

## Best Practices

1. **Type Safety**
   - Use TypeScript for type safety
   - Define clear interfaces
   - Use Zod for runtime validation

2. **Error Handling**
   - Use custom error types
   - Provide detailed error messages
   - Handle edge cases

3. **Testing**
   - Write comprehensive tests
   - Mock external dependencies
   - Test error cases

4. **Documentation**
   - Document public APIs
   - Provide usage examples
   - Include configuration details

## Contributing New Examples

1. Create a new directory under `examples/`
2. Follow the example structure
3. Include comprehensive tests
4. Provide detailed documentation
5. Demonstrate unique features or patterns

## Related Documentation

- [Plugin Development Guide](../docs/plugin-development.md)
- [Event System](../docs/event-system.md)
- [Configuration](../docs/configuration.md)
- [Testing Guide](../docs/testing.md)
