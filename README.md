# FamilyManager SDK

The FamilyManager SDK provides a comprehensive set of tools, utilities, and components for building plugins and extensions for the FamilyManager platform.

## Features

- Plugin System: Core functionality for creating and managing plugins
- UI Components: Reusable React components for consistent UI/UX
- State Management: Tools for managing plugin state and persistence
- Routing: Plugin-specific routing capabilities
- Events: Event system for inter-plugin communication
- Analytics: Built-in analytics tracking
- Accessibility: Accessibility helpers and components
- Testing: Testing utilities and helpers

## Installation

```bash
npm install familymanager-sdk
```

## Usage

### Creating a Plugin

```typescript
import { BasePlugin } from 'familymanager-sdk';

export class MyPlugin extends BasePlugin {
  async init() {
    // Initialize your plugin
  }

  async start() {
    // Start your plugin
  }

  async stop() {
    // Clean up when plugin is stopped
  }
}
```

### Using Components

```typescript
import { PluginContainer, PluginProvider } from 'familymanager-sdk';

function MyPluginComponent() {
  return (
    <PluginProvider plugin={myPlugin}>
      <PluginContainer>
        {/* Your plugin content */}
      </PluginContainer>
    </PluginProvider>
  );
}
```

### Using Hooks

```typescript
import { usePlugin, usePluginState } from 'familymanager-sdk';

function MyComponent() {
  const plugin = usePlugin();
  const [state, setState] = usePluginState();

  // Use plugin functionality
}
```

## Documentation

For detailed documentation, see the following guides:

- [Getting Started](./docs/README.md)
- [API Reference](./docs/api.md)
- [Events System](./docs/events.md)
- [Logging](./docs/logging.md)

## Examples

Check out the example plugins in the `examples/` directory:

- Basic Plugin: Simple plugin example
- Tasks Plugin: Full-featured task management plugin

## Development

```bash
# Install dependencies
npm install

# Build SDK
npm run build

# Run tests
npm test

# Generate documentation
npm run docs
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
