import { Context } from 'hono';
import { z } from 'zod';
import { EventBus } from '../events/EventBus';
import { Logger } from './Logger';
import type { Event } from '../events/types';

/**
 * Plugin lifecycle states
 */
export enum PluginState {
  CREATED = 'created',
  INITIALIZED = 'initialized',
  STARTED = 'started',
  STOPPED = 'stopped',
  ERROR = 'error'
}

/**
 * Plugin layout definition
 */
export interface PluginLayout {
  id: string;
  name: string;
  description?: string;
}

/**
 * Plugin preference definition
 */
export interface PluginPreference {
  key: string;
  label: string;
  type: 'string' | 'number' | 'boolean';
  defaultValue?: any;
  required?: boolean;
}

/**
 * Plugin metadata interface
 */
export interface PluginMetadata {
  /** Unique identifier for the plugin */
  name: string;
  /** Semantic version of the plugin */
  version: string;
  /** Plugin description */
  description: string;
  /** Optional plugin author */
  author?: string;
  /** Optional plugin homepage */
  homepage?: string;
  /** Optional plugin repository URL */
  repository?: string;
  /** Optional plugin license */
  license?: string;
  /** Optional plugin keywords */
  keywords?: string[];
  /** Available layouts for this plugin */
  layouts?: PluginLayout[];
  /** Plugin preferences configuration */
  preferences?: PluginPreference[];
}

/**
 * Plugin dependencies configuration
 */
export interface PluginDependencies {
  /** Required plugin names and their version constraints */
  required?: Record<string, string>;
  /** Optional plugin names and their version constraints */
  optional?: Record<string, string>;
  /** Plugins that conflict with this plugin */
  conflicts?: string[];
}

/**
 * Plugin route definition
 */
export interface PluginRoute {
  /** Route path (e.g., /api/my-plugin) */
  path: string;
  /** Component to render for this route */
  component: React.ComponentType;
  /** HTTP method for API routes */
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  /** Route handler function for API routes */
  handler?: (c: Context) => Promise<Response>;
  /** Optional middleware functions */
  middleware?: Array<(c: Context, next: any) => Promise<Response | void>>;
  /** Route metadata */
  meta?: {
    title?: string;
    icon?: string;
    showInNav?: boolean;
    requiredPermissions?: string[];
  };
  /** Optional request body schema */
  requestSchema?: z.ZodSchema;
  /** Optional response schema */
  responseSchema?: z.ZodSchema;
}

/**
 * Plugin event configuration
 */
export interface PluginEvents {
  /** Event types this plugin subscribes to */
  subscriptions?: string[];
  /** Event types this plugin publishes */
  publications?: string[];
}

/**
 * Plugin configuration schema
 */
export interface PluginConfig {
  /** Plugin metadata */
  metadata: PluginMetadata;
  /** Plugin dependencies */
  dependencies?: PluginDependencies;
  /** Plugin routes */
  routes?: PluginRoute[];
  /** Plugin events configuration */
  events?: PluginEvents;
  /** Plugin environment variables schema */
  env?: z.ZodSchema;
  /** Plugin configuration schema */
  config?: z.ZodSchema;
}

/**
 * Plugin context provided to plugin instances
 */
export interface PluginContext {
  /** Event bus instance */
  eventBus: EventBus;
  /** Logger instance */
  logger: Logger;
  /** Plugin configuration */
  config: any;
  /** Environment variables */
  env: Record<string, string>;
}

/**
 * Plugin interface that all plugins must implement
 */
export interface Plugin {
  /** Plugin name */
  readonly name: string;
  /** Plugin version */
  readonly version: string;
  /** Current plugin state */
  readonly state: PluginState;
  /** Plugin configuration */
  readonly config: PluginConfig;
  /** Plugin context */
  readonly context: PluginContext;

  /**
   * Initialize the plugin
   * Called once when the plugin is first loaded
   */
  onInit(): Promise<void>;

  /**
   * Start the plugin
   * Called when the plugin should start its operations
   */
  onStart(): Promise<void>;

  /**
   * Stop the plugin
   * Called when the plugin should stop its operations
   */
  onStop(): Promise<void>;

  /**
   * Handle configuration changes
   * @param config Updated configuration
   */
  onConfigChange?(config: any): Promise<void>;

  /**
   * Handle dependency updates
   * @param dependency Name of the updated dependency
   * @param version New version of the dependency
   */
  onDependencyUpdate?(dependency: string, version: string): Promise<void>;

  /**
   * Cleanup plugin resources
   * Called before plugin is unloaded
   */
  onUnload?(): Promise<void>;
}

/**
 * Error types specific to plugins
 */
export enum PluginErrorType {
  INITIALIZATION = 'initialization_error',
  CONFIGURATION = 'configuration_error',
  DEPENDENCY = 'dependency_error',
  RUNTIME = 'runtime_error',
  VALIDATION = 'validation_error'
}

/**
 * Plugin-specific error class
 */
export class PluginError extends Error {
  constructor(
    public type: PluginErrorType,
    message: string,
    public plugin: string,
    public details?: any
  ) {
    super(message);
    this.name = 'PluginError';
  }
}

/**
 * Plugin validation result
 */
export interface PluginValidationResult {
  /** Whether the plugin is valid */
  isValid: boolean;
  /** Validation errors if any */
  errors?: string[];
}

/**
 * Plugin health check result
 */
export interface PluginHealthCheck {
  /** Plugin status */
  status: 'healthy' | 'unhealthy' | 'degraded';
  /** Optional status message */
  message?: string;
  /** Timestamp of the health check */
  timestamp: number;
  /** Optional error details */
  error?: any;
  /** Optional metrics */
  metrics?: Record<string, number>;
  /** Optional details */
  details?: Record<string, any>;
}
