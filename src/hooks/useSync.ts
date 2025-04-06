import { useState, useEffect, useCallback } from 'react';
import { SyncEngine, SyncStatus, SyncEvent } from '../core/sync/SyncEngine';
import { IndexedDBStorageProvider } from '../core/sync/providers/IndexedDBStorageProvider';
import { WebSocketNetworkProvider } from '../core/sync/providers/WebSocketNetworkProvider';
import { DefaultConflictResolver, ConflictResolutionStrategy } from '../core/sync/conflict/DefaultConflictResolver';
import { DefaultValidator } from '../core/sync/validation/DefaultValidator';
import { useLogger } from './useLogger';
import { EventBus } from '../events/EventBus';
import { useAuth } from './useAuth';

/**
 * Hook options for useSync
 */
export interface UseSyncOptions {
  apiBaseUrl?: string;
  wsClient?: any;
  conflictStrategy?: ConflictResolutionStrategy;
  syncInterval?: number;
  autoSync?: boolean;
  entityTypes?: string[];
}

/**
 * Hook for using the sync system
 */
export function useSync(options: UseSyncOptions = {}) {
  const {
    apiBaseUrl = 'http://localhost:3000/api/v1/sync',
    wsClient,
    conflictStrategy = ConflictResolutionStrategy.TIMESTAMP_WINS,
    syncInterval = 60000, // 1 minute
    autoSync = true,
    entityTypes = ['tasks', 'calendar', 'finance', 'shopping', 'recipes']
  } = options;

  const logger = useLogger('SyncHook');
  const { user, token } = useAuth();
  const [syncEngine, setSyncEngine] = useState<SyncEngine | null>(null);
  const [isSyncing, setIsSyncing] = useState(false);
  const [lastSyncTime, setLastSyncTime] = useState<Date | null>(null);
  const [pendingChanges, setPendingChanges] = useState<number>(0);
  const [conflicts, setConflicts] = useState<any[]>([]);
  const [isOnline, setIsOnline] = useState<boolean>(navigator.onLine);

  // Initialize sync engine
  useEffect(() => {
    if (!user || !token) {
      return;
    }

    const init = async () => {
      try {
        // Create event bus
        const eventBus = new EventBus();

        // Create storage provider
        const storageProvider = new IndexedDBStorageProvider(
          'family-manager-sync',
          1,
          logger
        );

        // Create network provider
        const networkProvider = new WebSocketNetworkProvider(
          apiBaseUrl,
          wsClient,
          logger,
          user.id
        );

        // Set auth token
        networkProvider.setAuthToken(token);

        // Create sync engine
        const engine = new SyncEngine(
          storageProvider,
          networkProvider,
          eventBus,
          logger,
          {
            syncInterval: autoSync ? syncInterval : 0,
            conflictResolution: conflictStrategy,
            deltaUpdates: true
          },
          user.id
        );

        // Register entity types
        for (const entityType of entityTypes) {
          engine.registerEntityType(
            entityType,
            DefaultValidator.createForEntityType(entityType),
            new DefaultConflictResolver(conflictStrategy)
          );
        }

        // Initialize sync engine
        await engine.initialize();

        // Set up event listeners
        eventBus.subscribe(SyncEvent.SYNC_STARTED, async () => {
          setIsSyncing(true);
        });

        eventBus.subscribe(SyncEvent.SYNC_COMPLETED, async () => {
          setIsSyncing(false);
          setLastSyncTime(new Date());
          updatePendingChanges(engine);
        });

        eventBus.subscribe(SyncEvent.SYNC_FAILED, async () => {
          setIsSyncing(false);
        });

        eventBus.subscribe(SyncEvent.CONFLICT_DETECTED, async (event) => {
          updateConflicts(engine);
        });

        eventBus.subscribe(SyncEvent.CONNECTION_CHANGED, async (event) => {
          setIsOnline(event.data.online);
        });

        // Set sync engine
        setSyncEngine(engine);

        // Update pending changes
        updatePendingChanges(engine);

        // Update conflicts
        updateConflicts(engine);

        // Check online status
        const online = await engine.isOnline();
        setIsOnline(online);

        logger.info('Sync engine initialized');
      } catch (error) {
        logger.error('Failed to initialize sync engine', error);
      }
    };

    init();

    return () => {
      if (syncEngine) {
        syncEngine.dispose();
      }
    };
  }, [user, token, apiBaseUrl, wsClient, conflictStrategy, syncInterval, autoSync]);

  // Update pending changes
  const updatePendingChanges = async (engine: SyncEngine) => {
    if (!engine) return;
    const operations = await engine.getPendingOperations();
    setPendingChanges(operations.length);
  };

  // Update conflicts
  const updateConflicts = async (engine: SyncEngine) => {
    if (!engine) return;
    const conflictOperations = await engine.getConflicts();
    setConflicts(conflictOperations);
  };

  // Sync now
  const syncNow = useCallback(async () => {
    if (!syncEngine) return false;
    return syncEngine.syncAll();
  }, [syncEngine]);

  // Create entity
  const createEntity = useCallback(async <T extends Record<string, any> & { id: string }>(
    entityType: string,
    data: T
  ): Promise<T> => {
    if (!syncEngine) {
      throw new Error('Sync engine not initialized');
    }
    return syncEngine.create(entityType, data);
  }, [syncEngine]);

  // Update entity
  const updateEntity = useCallback(async <T extends Record<string, any> & { id: string }>(
    entityType: string,
    data: T
  ): Promise<T> => {
    if (!syncEngine) {
      throw new Error('Sync engine not initialized');
    }
    return syncEngine.update(entityType, data);
  }, [syncEngine]);

  // Delete entity
  const deleteEntity = useCallback(async (
    entityType: string,
    id: string
  ): Promise<boolean> => {
    if (!syncEngine) {
      throw new Error('Sync engine not initialized');
    }
    return syncEngine.delete(entityType, id);
  }, [syncEngine]);

  // Resolve conflict
  const resolveConflict = useCallback(async <T extends Record<string, any> & { id: string }>(
    operationId: string,
    resolution: T | null,
    useServer: boolean = false
  ): Promise<void> => {
    if (!syncEngine) {
      throw new Error('Sync engine not initialized');
    }
    await syncEngine.resolveConflict(operationId, resolution, useServer);
    updateConflicts(syncEngine);
  }, [syncEngine]);

  // Get entity sync status
  const getEntitySyncStatus = useCallback(async (
    entityType: string,
    id: string
  ): Promise<SyncStatus> => {
    if (!syncEngine) {
      throw new Error('Sync engine not initialized');
    }
    return syncEngine.getEntitySyncStatus(entityType, id);
  }, [syncEngine]);

  return {
    syncEngine,
    isSyncing,
    lastSyncTime,
    pendingChanges,
    conflicts,
    isOnline,
    syncNow,
    createEntity,
    updateEntity,
    deleteEntity,
    resolveConflict,
    getEntitySyncStatus
  };
}