import type { Hono } from 'hono';
import type { Env } from 'hono/types';
import type { PrismaClient } from '@prisma/client';
import type { LogMetadata } from '../logging/types';

/**
 * Plugin metadata interface
 */
export interface PluginMetadata {
  name: string;
  version: string;
  description: string;
  author?: string;
  dependencies?: string[];
  optionalDependencies?: string[];
}

/**
 * Plugin registry interface
 */
export interface PluginRegistry {
  hasPlugin(name: string): boolean;
  getPlugin(name: string): Plugin | undefined;
  getPluginState(name: string): PluginState;
}

/**
 * Plugin context interface
 */
export interface PluginContext<T extends Env = Env> {
  app: Hono<T>;
  prisma: PrismaClient;
  plugins: PluginRegistry;
  config: {
    env: string;
    [key: string]: any;
  };
  logMetadata?: Partial<LogMetadata>;
}

/**
 * Plugin interface
 */
export interface PluginRouteMeta {
  label: string;
  showInNav?: boolean;
  icon?: React.ComponentType;
  requiredPermissions?: string[];
}

export interface PluginRoute {
  path: string;
  element: React.ComponentType;
  meta?: PluginRouteMeta;
}

export interface PluginLifecycleHooks {
  onInstall?: () => Promise<void>;
  onUninstall?: () => Promise<void>;
  onEnable?: () => Promise<void>;
  onDisable?: () => Promise<void>;
  onUpdate?: (fromVersion: string) => Promise<void>;
}

export interface Plugin<T extends Env = Env> {
  readonly metadata: PluginMetadata;
  readonly routes?: PluginRoute[];
  readonly lifecycleHooks?: PluginLifecycleHooks;
  initialize(context: PluginContext<T>): Promise<void>;
  teardown?(): Promise<void>;
  onError?(error: Error): Promise<void>;
  onDependencyChange?(dependency: string): Promise<void>;
}

/**
 * Plugin state type
 */
export type PluginState = 'registered' | 'initializing' | 'ready' | 'error';

/**
 * Plugin error interface
 */
export interface PluginError extends Error {
  pluginName: string;
  code: string;
}

/**
 * Type guard for plugin errors
 */
export function isPluginError(error: any): error is PluginError {
  return error instanceof Error && 'pluginName' in error && 'code' in error;
}

/**
 * Helper function to create plugin errors
 */
export function createPluginError(pluginName: string, code: string, message: string): PluginError {
  const error = new Error(message) as PluginError;
  error.pluginName = pluginName;
  error.code = code;
  return error;
}
