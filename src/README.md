# FamilyManager Plugin SDK

This SDK provides a comprehensive set of tools and utilities for building plugins for the FamilyManager platform. It includes everything you need to create, test, and integrate new functionality into the FamilyManager ecosystem.

## Directory Structure

```
sdk/
├── core/           # Core plugin interfaces and base classes
├── events/         # Event system integration
├── config/         # Configuration management
├── utils/          # Utility functions and helpers
├── docs/           # Detailed documentation
└── examples/       # Example plugin implementations
```

## Getting Started

1. Create a new plugin using the base plugin class:

```typescript
import { BasePlugin } from '@family-manager/sdk/core';

export class MyPlugin extends BasePlugin {
  name = 'my-plugin';
  version = '1.0.0';

  async onInit() {
    // Plugin initialization logic
  }

  async onStart() {
    // Plugin startup logic
  }

  async onStop() {
    // Plugin cleanup logic
  }
}
```

2. Configure your plugin:

```typescript
import { PluginConfig } from '@family-manager/sdk/config';

export const config: PluginConfig = {
  name: 'my-plugin',
  routes: [
    {
      path: '/api/my-plugin',
      method: 'GET',
      handler: myHandler
    }
  ],
  events: {
    subscriptions: ['user.created', 'family.updated'],
    publications: ['my-plugin.event']
  }
};
```

3. Handle events:

```typescript
import { EventHandler } from '@family-manager/sdk/events';

export class MyEventHandler extends EventHandler {
  async onUserCreated(event: UserCreatedEvent) {
    // Handle user creation
  }

  async onFamilyUpdated(event: FamilyUpdatedEvent) {
    // Handle family updates
  }
}
```

## Features

- **Plugin Lifecycle Management**: Built-in hooks for initialization, startup, and shutdown
- **Event System Integration**: Subscribe to and publish events across the platform
- **Configuration Management**: Type-safe configuration with validation
- **Route Management**: Easy API endpoint registration
- **Database Integration**: Access to the platform's database layer
- **Testing Utilities**: Comprehensive testing tools and helpers
- **Type Safety**: Full TypeScript support with extensive type definitions

## Best Practices

1. **Initialization**
   - Use `onInit` for one-time setup operations
   - Initialize database connections and external services
   - Register event handlers

2. **Configuration**
   - Keep sensitive data in environment variables
   - Use the configuration validation system
   - Document all configuration options

3. **Event Handling**
   - Use typed event definitions
   - Keep event handlers focused and small
   - Document event schemas

4. **Error Handling**
   - Use the built-in error types
   - Properly handle and log errors
   - Provide meaningful error messages

5. **Testing**
   - Write unit tests for all functionality
   - Use the provided testing utilities
   - Test error cases and edge conditions

## Example Plugins

Check the `examples/` directory for complete plugin implementations:

- Basic Plugin: Simple plugin demonstrating core concepts
- Database Plugin: Example of database integration
- API Plugin: REST API implementation
- Event Plugin: Event system usage
- Full Feature Plugin: Comprehensive example using all features

## Documentation

Detailed documentation is available in the `docs/` directory:

- [Plugin Development Guide](docs/plugin-development.md)
- [Event System](docs/event-system.md)
- [Configuration](docs/configuration.md)
- [Testing Guide](docs/testing.md)
- [API Reference](docs/api-reference.md)

## Contributing

1. Follow the TypeScript coding style
2. Write tests for new functionality
3. Update documentation as needed
4. Submit pull requests for review

## Support

For questions and support:
- Check the documentation
- Review example plugins
- Submit issues for bugs
- Join the developer community

## License

MIT License - See LICENSE file for details
