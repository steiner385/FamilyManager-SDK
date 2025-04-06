import { EventBus } from '../../events/EventBus';
import { Logger } from '../Logger';

/**
 * Type guard to check if a value is an Error
 */
function isError(error: unknown): error is Error {
  return error instanceof Error;
}

/**
 * Enum representing the sync operation types
 */
export enum SyncOperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  BATCH = 'batch'
}

/**
 * Enum representing the sync status
 */
export enum SyncStatus {
  PENDING = 'pending',
  SYNCING = 'syncing',
  SYNCED = 'synced',
  FAILED = 'failed',
  CONFLICT = 'conflict'
}

/**
 * Interface for sync operation metadata
 */
export interface SyncMetadata {
  timestamp: number;
  deviceId: string;
  version: number;
  lastSyncedVersion?: number;
}

/**
 * Interface for a sync operation
 */
export interface SyncOperation<T extends Record<string, any>> {
  id: string;
  type: SyncOperationType;
  entityType: string;
  data: T;
  metadata: SyncMetadata;
  status: SyncStatus;
  retryCount?: number;
  conflictData?: T;
  errorMessage?: string;
}

/**
 * Interface for sync storage provider
 */
export interface SyncStorageProvider {
  saveOperation<T extends Record<string, any>>(operation: SyncOperation<T>): Promise<void>;
  getOperations<T extends Record<string, any>>(entityType?: string, status?: SyncStatus): Promise<SyncOperation<T>[]>;
  updateOperationStatus<T extends Record<string, any>>(id: string, status: SyncStatus, error?: string): Promise<void>;
  deleteOperation(id: string): Promise<void>;
  getLastSyncTimestamp(entityType: string): Promise<number>;
  setLastSyncTimestamp(entityType: string, timestamp: number): Promise<void>;
  getEntityVersion(entityType: string, entityId: string): Promise<number>;
  setEntityVersion(entityType: string, entityId: string, version: number): Promise<void>;
}

/**
 * Interface for sync network provider
 */
export interface SyncNetworkProvider {
  uploadOperations<T extends Record<string, any>>(operations: SyncOperation<T>[]): Promise<SyncResult<T>[]>;
  downloadChanges(entityTypes: string[], since: Record<string, number>): Promise<SyncOperation<any>[]>;
  isOnline(): Promise<boolean>;
}

/**
 * Interface for sync result
 */
export interface SyncResult<T extends Record<string, any>> {
  operationId: string;
  success: boolean;
  status: SyncStatus;
  data?: T;
  error?: string;
  conflictData?: T;
}

/**
 * Interface for sync conflict resolver
 */
export interface SyncConflictResolver<T extends Record<string, any>> {
  resolveConflict(localData: T, serverData: T, metadata: SyncMetadata): Promise<T>;
  canAutoResolve(localData: T, serverData: T, metadata: SyncMetadata): boolean;
}

/**
 * Interface for sync validator
 */
export interface SyncValidator<T extends Record<string, any>> {
  validate(data: T): Promise<boolean>;
  getValidationErrors(data: T): Promise<string[]>;
}

/**
 * Interface for sync options
 */
export interface SyncOptions {
  batchSize?: number;
  maxRetries?: number;
  syncInterval?: number;
  priorityEntities?: string[];
  deltaUpdates?: boolean;
  conflictResolution?: 'server-wins' | 'client-wins' | 'manual' | 'timestamp-wins';
}

/**
 * Events emitted by the SyncEngine
 */
export enum SyncEvent {
  SYNC_STARTED = 'sync:started',
  SYNC_COMPLETED = 'sync:completed',
  SYNC_FAILED = 'sync:failed',
  CONFLICT_DETECTED = 'sync:conflict',
  ENTITY_UPDATED = 'sync:entity:updated',
  ENTITY_CREATED = 'sync:entity:created',
  ENTITY_DELETED = 'sync:entity:deleted',
  CONNECTION_CHANGED = 'sync:connection:changed'
}

/**
 * Core sync engine that manages data synchronization between local storage and server
 */
export class SyncEngine {
  private storageProvider: SyncStorageProvider;
  private networkProvider: SyncNetworkProvider;
  private eventBus: EventBus;
  private logger: Logger;
  private options: SyncOptions;
  private deviceId: string;
  private isSyncing: boolean = false;
  private syncTimer: any;
  private validators: Map<string, SyncValidator<any>> = new Map<string, SyncValidator<any>>();
  private conflictResolvers: Map<string, SyncConflictResolver<any>> = new Map<string, SyncConflictResolver<any>>();
  private entityTypes: Set<string> = new Set();
  private lastSyncTimestamps: Record<string, number> = {};

  /**
   * Create a new SyncEngine instance
   * 
   * @param storageProvider The storage provider for sync operations
   * @param networkProvider The network provider for sync operations
   * @param eventBus The event bus for sync events
   * @param logger The logger for sync operations
   * @param options The sync options
   * @param deviceId The unique device identifier
   */
  constructor(
    storageProvider: SyncStorageProvider,
    networkProvider: SyncNetworkProvider,
    eventBus: EventBus,
    logger: Logger,
    options: SyncOptions = {},
    deviceId: string
  ) {
    this.storageProvider = storageProvider;
    this.networkProvider = networkProvider;
    this.eventBus = eventBus;
    this.logger = logger;
    this.options = {
      batchSize: 50,
      maxRetries: 5,
      syncInterval: 60000, // 1 minute
      priorityEntities: [],
      deltaUpdates: true,
      conflictResolution: 'timestamp-wins',
      ...options
    };
    this.deviceId = deviceId;
  }

  /**
   * Initialize the sync engine
   */
  public async initialize(): Promise<void> {
    this.logger.info('Initializing SyncEngine');
    
    // Load last sync timestamps for each entity type
    for (const entityType of this.entityTypes) {
      this.lastSyncTimestamps[entityType] = await this.storageProvider.getLastSyncTimestamp(entityType);
    }

    // Start periodic sync if enabled
    if (this.options.syncInterval && this.options.syncInterval > 0) {
      this.startPeriodicSync();
    }

    // Monitor network connectivity changes
    this.monitorConnectivity();
  }

  /**
   * Register an entity type for synchronization
   * 
   * @param entityType The entity type to register
   * @param validator Optional validator for the entity type
   * @param conflictResolver Optional conflict resolver for the entity type
   */
  public registerEntityType<T extends Record<string, any>>(
    entityType: string, 
    validator?: SyncValidator<T>,
    conflictResolver?: SyncConflictResolver<T>
  ): void {
    this.entityTypes.add(entityType);
    
    if (validator) {
      this.validators.set(entityType, validator);
    }
    
    if (conflictResolver) {
      this.conflictResolvers.set(entityType, conflictResolver);
    }
  }

  /**
   * Start periodic synchronization
   */
  private startPeriodicSync(): void {
    if (this.syncTimer) {
      clearInterval(this.syncTimer);
    }

    this.syncTimer = setInterval(async () => {
      try {
        const isOnline = await this.networkProvider.isOnline();
        if (isOnline && !this.isSyncing) {
          await this.syncAll();
        }
      } catch (error) {
        this.logger.error('Error during periodic sync', isError(error) ? error : new Error(String(error)));
      }
    }, this.options.syncInterval);
  }

  /**
   * Monitor network connectivity changes
   */
  private monitorConnectivity(): void {
    // This would be implemented differently depending on the platform
    // For now, we'll just check periodically in the sync timer
  }

  /**
   * Create a new entity and queue it for synchronization
   * 
   * @param entityType The entity type
   * @param data The entity data
   * @returns The created entity with sync metadata
   */
  public async create<T extends Record<string, any> & { id: string }>(entityType: string, data: T): Promise<T> {
    // Validate data if a validator is registered
    if (this.validators.has(entityType)) {
      const validator = this.validators.get(entityType)!;
      const isValid = await validator.validate(data);
      
      if (!isValid) {
        const errors = await validator.getValidationErrors(data);
        throw new Error(`Validation failed: ${errors.join(', ')}`);
      }
    }

    // Create sync operation
    const version = 1;
    const operation: SyncOperation<T> = {
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      type: SyncOperationType.CREATE,
      entityType,
      data,
      metadata: {
        timestamp: Date.now(),
        deviceId: this.deviceId,
        version
      },
      status: SyncStatus.PENDING
    };

    // Save operation to storage
    await this.storageProvider.saveOperation(operation);
    
    // Set entity version
    await this.storageProvider.setEntityVersion(entityType, data.id, version);

    // Try to sync immediately if online
    this.trySyncOperation(operation);

    // Emit event
    await this.eventBus.publish(SyncEvent.ENTITY_CREATED, { entityType, data });

    return data;
  }

  /**
   * Update an entity and queue it for synchronization
   * 
   * @param entityType The entity type
   * @param data The updated entity data
   * @returns The updated entity with sync metadata
   */
  public async update<T extends Record<string, any> & { id: string }>(entityType: string, data: T): Promise<T> {
    // Validate data if a validator is registered
    if (this.validators.has(entityType)) {
      const validator = this.validators.get(entityType)!;
      const isValid = await validator.validate(data);
      
      if (!isValid) {
        const errors = await validator.getValidationErrors(data);
        throw new Error(`Validation failed: ${errors.join(', ')}`);
      }
    }

    // Get current version and increment
    const currentVersion = await this.storageProvider.getEntityVersion(entityType, data.id);
    const newVersion = currentVersion + 1;

    // Create sync operation
    const operation: SyncOperation<T> = {
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      type: SyncOperationType.UPDATE,
      entityType,
      data,
      metadata: {
        timestamp: Date.now(),
        deviceId: this.deviceId,
        version: newVersion,
        lastSyncedVersion: currentVersion
      },
      status: SyncStatus.PENDING
    };

    // Save operation to storage
    await this.storageProvider.saveOperation(operation);
    
    // Update entity version
    await this.storageProvider.setEntityVersion(entityType, data.id, newVersion);

    // Try to sync immediately if online
    this.trySyncOperation(operation);

    // Emit event
    await this.eventBus.publish(SyncEvent.ENTITY_UPDATED, { entityType, data });

    return data;
  }

  /**
   * Delete an entity and queue it for synchronization
   * 
   * @param entityType The entity type
   * @param id The entity ID
   * @returns True if the entity was deleted
   */
  public async delete(entityType: string, id: string): Promise<boolean> {
    // Create sync operation
    const operation: SyncOperation<{ id: string }> = {
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      type: SyncOperationType.DELETE,
      entityType,
      data: { id },
      metadata: {
        timestamp: Date.now(),
        deviceId: this.deviceId,
        version: 0 // Version doesn't matter for deletes
      },
      status: SyncStatus.PENDING
    };

    // Save operation to storage
    await this.storageProvider.saveOperation(operation);

    // Try to sync immediately if online
    this.trySyncOperation(operation);

    // Emit event
    await this.eventBus.publish(SyncEvent.ENTITY_DELETED, { entityType, id });

    return true;
  }

  /**
   * Try to sync a single operation immediately if online
   * 
   * @param operation The operation to sync
   */
  private async trySyncOperation<T extends Record<string, any>>(operation: SyncOperation<T>): Promise<void> {
    try {
      const isOnline = await this.networkProvider.isOnline();
      
      if (isOnline && !this.isSyncing) {
        await this.syncOperation(operation);
      }
    } catch (error) {
      this.logger.error('Error syncing operation', isError(error) ? error : new Error(String(error)));
    }
  }

  /**
   * Sync a single operation
   * 
   * @param operation The operation to sync
   */
  private async syncOperation<T extends Record<string, any>>(operation: SyncOperation<T>): Promise<void> {
    // Update operation status
    await this.storageProvider.updateOperationStatus(operation.id, SyncStatus.SYNCING);

    try {
      // Upload operation
      const results = await this.networkProvider.uploadOperations([operation]);
      
      if (results.length === 0) {
        throw new Error('No result returned from server');
      }

      const result = results[0];

      if (result.success) {
        // Operation succeeded
        await this.storageProvider.updateOperationStatus(operation.id, SyncStatus.SYNCED);
        
        // If this was a successful update, update the lastSyncedVersion
        if (operation.type === SyncOperationType.UPDATE && 'id' in operation.data) {
          const entityId = operation.data.id;
          await this.storageProvider.setEntityVersion(
            operation.entityType, 
            entityId, 
            operation.metadata.version
          );
        }
      } else if (result.status === SyncStatus.CONFLICT) {
        // Handle conflict
        await this.handleConflict(operation, result.conflictData);
      } else {
        // Operation failed
        await this.storageProvider.updateOperationStatus(
          operation.id, 
          SyncStatus.FAILED, 
          result.error
        );
      }
    } catch (error) {
      // Update operation status to failed
      await this.storageProvider.updateOperationStatus(
        operation.id, 
        SyncStatus.FAILED, 
        error instanceof Error ? error.message : String(error)
      );
    }
  }

  /**
   * Handle a sync conflict
   * 
   * @param operation The operation with conflict
   * @param serverData The server data that conflicts
   */
  private async handleConflict<T extends Record<string, any>>(
    operation: SyncOperation<T>, 
    serverData?: T
  ): Promise<void> {
    if (!serverData) {
      // Can't resolve conflict without server data
      await this.storageProvider.updateOperationStatus(
        operation.id, 
        SyncStatus.CONFLICT, 
        'Server data not available for conflict resolution'
      );
      
      // Emit conflict event
      await this.eventBus.publish(SyncEvent.CONFLICT_DETECTED, {
        entityType: operation.entityType,
        localData: operation.data,
        serverData: null,
        operationId: operation.id
      });
      
      return;
    }

    // Check if we have a conflict resolver for this entity type
    if (this.conflictResolvers.has(operation.entityType)) {
      const resolver = this.conflictResolvers.get(operation.entityType)!;
      
      // Check if we can auto-resolve
      if (resolver.canAutoResolve(operation.data, serverData, operation.metadata)) {
        // Auto-resolve conflict
        const resolvedData = await resolver.resolveConflict(
          operation.data, 
          serverData, 
          operation.metadata
        );
        
        // Create a new update operation with the resolved data
        if (operation.type === SyncOperationType.UPDATE && 'id' in resolvedData) {
          await this.update(operation.entityType, resolvedData as any);
        }
        
        // Delete the conflicted operation
        await this.storageProvider.deleteOperation(operation.id);
        
        return;
      }
    }

    // Can't auto-resolve, mark as conflict and let the user handle it
    await this.storageProvider.updateOperationStatus(
      operation.id, 
      SyncStatus.CONFLICT
    );
    
    // Emit conflict event
    await this.eventBus.publish(SyncEvent.CONFLICT_DETECTED, {
      entityType: operation.entityType,
      localData: operation.data,
      serverData,
      operationId: operation.id
    });
  }

  /**
   * Manually resolve a conflict
   * 
   * @param operationId The ID of the conflicted operation
   * @param resolution The resolution data
   * @param useServer Whether to use the server data
   */
  public async resolveConflict<T extends Record<string, any> & { id: string }>(
    operationId: string, 
    resolution: T | null, 
    useServer: boolean = false
  ): Promise<void> {
    // Get the conflicted operation
    const operations = await this.storageProvider.getOperations<T>();
    const operation = operations.find(op => op.id === operationId);
    
    if (!operation) {
      throw new Error(`Operation not found: ${operationId}`);
    }
    
    if (operation.status !== SyncStatus.CONFLICT) {
      throw new Error(`Operation is not in conflict state: ${operationId}`);
    }

    if (useServer) {
      // Use server data
      if (!operation.conflictData) {
        throw new Error('Server data not available for conflict resolution');
      }
      
      // If this was an update, create a new update with the server data
      if (operation.type === SyncOperationType.UPDATE && 'id' in operation.conflictData) {
        await this.update(operation.entityType, operation.conflictData as any);
      }
      
      // Delete the conflicted operation
      await this.storageProvider.deleteOperation(operation.id);
    } else if (resolution) {
      // Use provided resolution
      if (operation.type === SyncOperationType.UPDATE) {
        await this.update(operation.entityType, resolution);
      }
      
      // Delete the conflicted operation
      await this.storageProvider.deleteOperation(operation.id);
    } else {
      // Keep local changes and retry
      await this.storageProvider.updateOperationStatus(operation.id, SyncStatus.PENDING);
    }
  }

  /**
   * Synchronize all pending operations
   * 
   * @returns The sync results
   */
  public async syncAll(): Promise<boolean> {
    if (this.isSyncing) {
      return false;
    }

    this.isSyncing = true;
    await this.eventBus.publish(SyncEvent.SYNC_STARTED, {});

    try {
      // Check if we're online
      const isOnline = await this.networkProvider.isOnline();
      
      if (!isOnline) {
        this.logger.info('Device is offline, skipping sync');
        this.isSyncing = false;
        return false;
      }

      // Get all pending operations
      const pendingOperations = await this.storageProvider.getOperations(
        undefined, 
        SyncStatus.PENDING
      );
      
      // Get failed operations that should be retried
      const failedOperations = await this.storageProvider.getOperations(
        undefined, 
        SyncStatus.FAILED
      );
      
      const retriableOperations = failedOperations.filter(op => 
        (op.retryCount || 0) < (this.options.maxRetries || 5)
      );

      // Combine operations
      const operations = [...pendingOperations, ...retriableOperations];
      
      if (operations.length === 0) {
        // No operations to sync, just download changes
        await this.downloadChanges();
        this.isSyncing = false;
        await this.eventBus.publish(SyncEvent.SYNC_COMPLETED, { uploaded: 0, downloaded: 0 });
        return true;
      }

      // Sort operations by priority and timestamp
      operations.sort((a, b) => {
        // First sort by priority entity type
        const aPriority = this.options.priorityEntities?.indexOf(a.entityType) ?? -1;
        const bPriority = this.options.priorityEntities?.indexOf(b.entityType) ?? -1;
        
        if (aPriority !== -1 && bPriority !== -1) {
          return aPriority - bPriority;
        } else if (aPriority !== -1) {
          return -1;
        } else if (bPriority !== -1) {
          return 1;
        }
        
        // Then sort by timestamp
        return a.metadata.timestamp - b.metadata.timestamp;
      });

      // Process operations in batches
      const batchSize = this.options.batchSize || 50;
      let processed = 0;
      
      for (let i = 0; i < operations.length; i += batchSize) {
        const batch = operations.slice(i, i + batchSize);
        
        // Mark operations as syncing
        for (const op of batch) {
          await this.storageProvider.updateOperationStatus(op.id, SyncStatus.SYNCING);
        }
        
        // Upload batch
        const results = await this.networkProvider.uploadOperations(batch);
        
        // Process results
        for (let j = 0; j < batch.length; j++) {
          const operation = batch[j];
          const result = results[j];
          
          if (result.success) {
            // Operation succeeded
            await this.storageProvider.deleteOperation(operation.id);
            processed++;
          } else if (result.status === SyncStatus.CONFLICT) {
            // Handle conflict
            await this.handleConflict(operation, result.conflictData);
          } else {
            // Operation failed
            const retryCount = (operation.retryCount || 0) + 1;
            
            if (retryCount >= (this.options.maxRetries || 5)) {
              // Max retries reached, mark as failed
              await this.storageProvider.updateOperationStatus(
                operation.id, 
                SyncStatus.FAILED, 
                result.error
              );
            } else {
              // Retry later
              await this.storageProvider.updateOperationStatus(
                operation.id, 
                SyncStatus.PENDING
              );
            }
          }
        }
      }

      // Download changes from server
      const downloaded = await this.downloadChanges();

      this.isSyncing = false;
      await this.eventBus.publish(SyncEvent.SYNC_COMPLETED, { uploaded: processed, downloaded });
      return true;
    } catch (error) {
      this.logger.error('Error during sync', isError(error) ? error : new Error(String(error)));
      this.isSyncing = false;
      await this.eventBus.publish(SyncEvent.SYNC_FAILED, { error: String(error) });
      return false;
    }
  }

  /**
   * Download changes from the server
   * 
   * @returns The number of changes downloaded
   */
  private async downloadChanges(): Promise<number> {
    try {
      // Download changes for all registered entity types
      const entityTypes = Array.from(this.entityTypes);
      const changes = await this.networkProvider.downloadChanges(
        entityTypes,
        this.lastSyncTimestamps
      );
      
      if (changes.length === 0) {
        return 0;
      }

      // Group changes by entity type
      const changesByType: Record<string, SyncOperation<any>[]> = {};
      
      for (const change of changes) {
        if (!changesByType[change.entityType]) {
          changesByType[change.entityType] = [];
        }
        
        changesByType[change.entityType].push(change);
      }

      // Process changes for each entity type
      let totalProcessed = 0;
      
      for (const entityType of entityTypes) {
        const entityChanges = changesByType[entityType] || [];
        
        if (entityChanges.length === 0) {
          continue;
        }
        
        // Find the latest timestamp
        const latestTimestamp = Math.max(
          ...entityChanges.map(change => change.metadata.timestamp)
        );
        
        // Update last sync timestamp
        this.lastSyncTimestamps[entityType] = latestTimestamp;
        await this.storageProvider.setLastSyncTimestamp(entityType, latestTimestamp);
        
        // Emit events for each change
        for (const change of entityChanges) {
          switch (change.type) {
            case SyncOperationType.CREATE:
              await this.eventBus.publish(SyncEvent.ENTITY_CREATED, {
                entityType,
                data: change.data
              });
              break;
            case SyncOperationType.UPDATE:
              await this.eventBus.publish(SyncEvent.ENTITY_UPDATED, {
                entityType,
                data: change.data
              });
              break;
            case SyncOperationType.DELETE:
              if ('id' in change.data) {
                await this.eventBus.publish(SyncEvent.ENTITY_DELETED, {
                  entityType,
                  id: change.data.id
                });
              }
              break;
          }
        }
        
        totalProcessed += entityChanges.length;
      }

      return totalProcessed;
    } catch (error) {
      this.logger.error('Error downloading changes', isError(error) ? error : new Error(String(error)));
      return 0;
    }
  }

  /**
   * Get all pending operations
   * 
   * @returns The pending operations
   */
  public async getPendingOperations(): Promise<SyncOperation<any>[]> {
    return this.storageProvider.getOperations(undefined, SyncStatus.PENDING);
  }

  /**
   * Get all operations with conflicts
   * 
   * @returns The operations with conflicts
   */
  public async getConflicts(): Promise<SyncOperation<any>[]> {
    return this.storageProvider.getOperations(undefined, SyncStatus.CONFLICT);
  }

  /**
   * Get the sync status for an entity
   * 
   * @param entityType The entity type
   * @param id The entity ID
   * @returns The sync status
   */
  public async getEntitySyncStatus(entityType: string, id: string): Promise<SyncStatus> {
    const operations = await this.storageProvider.getOperations<Record<string, any>>();
    
    // Find the latest operation for this entity
    const entityOperations = operations.filter(op => 
      op.entityType === entityType && 
      'id' in op.data && op.data.id === id
    );
    
    if (entityOperations.length === 0) {
      return SyncStatus.SYNCED;
    }
    
    // Sort by timestamp descending
    entityOperations.sort((a, b) => b.metadata.timestamp - a.metadata.timestamp);
    
    return entityOperations[0].status;
  }

  /**
   * Check if the device is currently online
   * 
   * @returns True if the device is online
   */
  public async isOnline(): Promise<boolean> {
    return this.networkProvider.isOnline();
  }

  /**
   * Dispose the sync engine
   */
  public dispose(): void {
    if (this.syncTimer) {
      clearInterval(this.syncTimer);
    }
  }
}