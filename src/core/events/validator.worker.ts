import { parentPort } from 'worker_threads';
import { BaseEvent, ValidationResult } from './types';

if (!parentPort) {
  throw new Error('This module must be run as a worker thread');
}

function validateEvent<T>(event: BaseEvent<T>): ValidationResult {
  try {
    // Required fields
    if (!event.type || typeof event.type !== 'string') {
      return {
        isValid: false,
        errors: ['Event must have a string type']
      };
    }

    if (typeof event.timestamp !== 'number') {
      return {
        isValid: false,
        errors: ['Event must have a numeric timestamp']
      };
    }

    // Optional fields
    if (!event.source || typeof event.source !== 'string') {
      return {
        isValid: false,
        errors: ['Event source must be a string if provided']
      };
    }

    if (event.payload === undefined || event.payload === null) {
      return {
        isValid: false,
        errors: ['Event data must be an object if provided']
      };
    }

    if (event.metadata !== undefined && (event.metadata === null || typeof event.metadata !== 'object')) {
      return {
        isValid: false,
        errors: ['Event metadata must be an object if provided']
      };
    }

    // Validate timestamp is not in the future
    if (event.timestamp > Date.now() + 1000) { // Allow 1 second buffer for clock skew
      return {
        isValid: false,
        errors: ['Event timestamp cannot be in the future']
      };
    }

    // Validate type format (e.g. USER.CREATED, AUTH.LOGIN)
    if (!/^[A-Z][A-Z0-9_]*(?:\.[A-Z][A-Z0-9_]*)*$/.test(event.type)) {
      return {
        isValid: false,
        errors: ['Event type must be uppercase with dots as separators']
      };
    }

    return { isValid: true };
  } catch (error) {
    return {
      isValid: false,
      errors: [error instanceof Error ? error.message : 'Unknown validation error']
    };
  }
}

// Handle messages from the main thread
parentPort.on('message', (event: BaseEvent<unknown>) => {
  try {
    const result = validateEvent(event);
    parentPort!.postMessage(result);
  } catch (error) {
    parentPort!.postMessage({
      isValid: false,
      errors: [error instanceof Error ? error.message : 'Unknown worker error']
    });
  }
});

// Handle worker cleanup
process.on('exit', () => {
  if (parentPort) {
    parentPort.removeAllListeners('message');
  }
});

process.on('uncaughtException', (error) => {
  console.error('Uncaught exception in validator worker:', error);
  process.exit(1);
});

process.on('unhandledRejection', (error) => {
  console.error('Unhandled rejection in validator worker:', error);
  process.exit(1);
});
