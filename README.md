# FamilyManager SDK

The FamilyManager SDK provides a comprehensive set of tools, utilities, and components for building modules and extensions for the FamilyManager platform. It serves as the foundation for all FamilyManager modules, ensuring consistency and interoperability.

## Core Features

- **Component Library**: Reusable React components with consistent styling and behavior
  - Common UI components (LoadingSpinner, Modal, ErrorBoundary, etc.)
  - Layout components
  - Form elements
  - Data display components

- **State Management**: Tools for managing application and module state
  - Global state integration
  - Module-specific state management
  - Persistence utilities
  - State synchronization

- **Authentication & Authorization**: Secure user management
  - Authentication utilities
  - Role-based access control
  - Permission management
  - Session handling

- **Event System**: Robust inter-module communication
  - Event emission and handling
  - Message bus integration
  - Event persistence
  - Type-safe events

- **Testing Utilities**: Comprehensive testing support
  - Test helpers and mocks
  - Testing utilities
  - Common test patterns
  - Integration test helpers

## Installation

```bash
npm install @familymanager/sdk --save
```

## Usage

### Using Components

```typescript
import { 
  LoadingSpinner, 
  ErrorBoundary, 
  Modal 
} from '@familymanager/sdk/components';

function MyComponent() {
  return (
    <ErrorBoundary>
      <Modal isOpen={true} onClose={() => {}}>
        <LoadingSpinner />
      </Modal>
    </ErrorBoundary>
  );
}
```

### State Management

```typescript
import { 
  useModuleState, 
  useGlobalState 
} from '@familymanager/sdk/state';

function MyComponent() {
  // Module-specific state
  const [moduleState, setModuleState] = useModuleState('myModule');
  
  // Global application state
  const globalState = useGlobalState();

  // Use state as needed
}
```

### Event Handling

```typescript
import { 
  useEventEmitter,
  useEventListener 
} from '@familymanager/sdk/events';

function MyComponent() {
  const emitter = useEventEmitter();
  
  // Listen for events
  useEventListener('user:updated', (data) => {
    // Handle user update
  });

  // Emit events
  const handleAction = () => {
    emitter.emit('myModule:action', { /* data */ });
  };
}
```

### Creating a Module

```typescript
import { BaseModule, ModuleContext } from '@familymanager/sdk';

export class MyModule extends BaseModule {
  metadata = {
    name: 'my-module',
    version: '1.0.0',
    description: 'My custom module'
  };

  async initialize(context: ModuleContext): Promise<void> {
    // Initialize module
    await this.registerRoutes();
    await this.setupServices();
    this.setupEventHandlers();
  }

  async teardown(): Promise<void> {
    // Cleanup resources
  }
}
```

## Development

```bash
# Install dependencies
npm install

# Build SDK
npm run build

# Run tests
npm test

# Run linting
npm run lint

# Generate documentation
npm run docs
```

## Testing

The SDK provides comprehensive testing utilities:

```typescript
import { 
  render, 
  fireEvent,
  createTestModule
} from '@familymanager/sdk/testing';

describe('MyComponent', () => {
  it('renders correctly', () => {
    const { getByText } = render(<MyComponent />);
    expect(getByText('Hello')).toBeInTheDocument();
  });

  it('handles module integration', () => {
    const testModule = createTestModule({
      name: 'test-module'
    });
    // Test module behavior
  });
});
```

## Documentation

Comprehensive documentation is available:

- [Getting Started](./docs/getting-started.md)
- [Component Library](./docs/components/README.md)
- [State Management](./docs/state/README.md)
- [Event System](./docs/events/README.md)
- [Testing Guide](./docs/testing/README.md)
- [API Reference](./docs/api/README.md)

## Examples

The SDK includes example implementations:

- [Basic Module](./examples/basic-module/): Simple module example
- [Tasks Module](./examples/tasks-module/): Full-featured task management
- [Integration Examples](./examples/integration/): Common integration patterns

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

Please ensure your contributions:
- Follow the existing code style
- Include appropriate tests
- Update relevant documentation
- Consider backward compatibility

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

- [Issue Tracker](https://github.com/familymanager/sdk/issues)
- [Documentation](./docs/README.md)
- [Discussions](https://github.com/familymanager/sdk/discussions)
