export interface ConfigEvent<T = any> {
  type: ConfigEventType;
  pluginName: string;
  timestamp: number;
  data: T;
}

export type ConfigEventType = 
  | 'config:changed'
  | 'config:loaded'
  | 'config:cleared'
  | 'config:validation-failed';

export interface ConfigEventEmitter {
  emit<T>(event: ConfigEvent<T>): void;
  on<T>(type: ConfigEventType, handler: (event: ConfigEvent<T>) => void): void;
  off<T>(type: ConfigEventType, handler: (event: ConfigEvent<T>) => void): void;
}
