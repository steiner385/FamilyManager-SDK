# Test Utilities

This directory contains core test utilities that are used across multiple modules in the application. These utilities provide fundamental testing capabilities that are not specific to any single module.

## File Organization

- `test-helpers.ts`: Core utilities for user and family management
- `test-setup.ts`: Global test environment setup and configuration
- `global-setup.ts` & `global-teardown.ts`: Jest configuration for setup and teardown
- `env-setup.ts`: Environment configuration for tests
- `jest-globals.ts`: Jest type definitions and global configurations
- `memory-cleanup.ts`: Memory management utilities for tests

## Module-Specific Test Utilities

Module-specific test utilities should be placed in their respective module's test directories. For example:

```
src/
  modules/
    calendar/
      __tests__/
        utils/           # Calendar-specific test utilities
          mock-data.ts   # Mock data for calendar tests
          server.ts      # Server setup for calendar tests
          types.ts       # Calendar test type definitions
    banking/
      __tests__/
        utils/           # Banking-specific test utilities
    shopping/
      __tests__/
        utils/           # Shopping-specific test utilities
```

## Guidelines

1. Keep core test utilities in this directory minimal and focused on shared functionality
2. Move module-specific test utilities to their respective module directories
3. When adding new test utilities, consider:
   - Is this utility used across multiple modules? → Place it here
   - Is this utility specific to one module? → Place it in the module's test utils
4. Document any new core utilities added to this directory

## Usage

```typescript
// Importing core test utilities
import { createTestUser, createTestFamily } from '../__tests__/utils/test-helpers';

// Importing module-specific test utilities
import { createMockCalendarData } from './utils/mock-data';
