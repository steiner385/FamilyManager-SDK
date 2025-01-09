import { z } from 'zod';

export interface PluginMetadata {
  name: string;
  version: string;
  description: string;
  author: string;
  dependencies?: string[];
}

export interface PluginConfig {
  metadata: PluginMetadata;
  config?: z.ZodSchema;
  events?: {
    subscriptions?: string[];
    publications?: string[];
  };
}

export interface PluginHealthCheck {
  status: 'healthy' | 'unhealthy';
  message: string;
  error?: unknown;
}

export interface Event {
  type: string;
  data?: any;
  id?: string;
  timestamp?: number;
}

export interface Plugin {
  metadata: PluginMetadata;
  config: {
    name: string;
    defaultLayout?: string;
    availableLayouts?: Array<{
      id: string;
      name: string;
    }>;
    preferences?: Array<{
      key: string;
      label: string;
      type: string;
    }>;
  };
  initialize(context: any): Promise<void>;
  onInit?(): Promise<void>;
  onStart?(): Promise<void>;
  onStop?(): Promise<void>;
  getHealth(): Promise<PluginHealthCheck>;
}

export interface PluginRoute {
  path: string;
  method: string;
  handler: (context: any) => Promise<any>;
  description: string;
  middleware?: ((context: any, next: () => Promise<void>) => Promise<Response | void | undefined>)[];
  component?: string;
}
