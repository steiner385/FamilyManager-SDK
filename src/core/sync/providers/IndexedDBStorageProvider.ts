import { SyncOperation, SyncStatus, SyncStorageProvider } from '../SyncEngine';
import { Logger } from '../../Logger';

/**
 * IndexedDB-based storage provider for sync operations
 * Used in browser environments
 */
export class IndexedDBStorageProvider implements SyncStorageProvider {
  private dbName: string;
  private dbVersion: number;
  private db: IDBDatabase | null = null;
  private logger: Logger;
  private ready: Promise<void>;

  // Store names
  private static readonly OPERATIONS_STORE = 'sync_operations';
  private static readonly TIMESTAMPS_STORE = 'sync_timestamps';
  private static readonly VERSIONS_STORE = 'entity_versions';

  /**
   * Create a new IndexedDBStorageProvider
   * 
   * @param dbName The name of the IndexedDB database
   * @param dbVersion The version of the IndexedDB database
   * @param logger The logger instance
   */
  constructor(dbName: string, dbVersion: number, logger: Logger) {
    this.dbName = dbName;
    this.dbVersion = dbVersion;
    this.logger = logger;
    this.ready = this.initializeDatabase();
  }

  /**
   * Initialize the IndexedDB database
   */
  private async initializeDatabase(): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      const request = indexedDB.open(this.dbName, this.dbVersion);

      request.onerror = (event) => {
        this.logger.error('Failed to open IndexedDB database', (event.target as any).error);
        reject(new Error('Failed to open IndexedDB database'));
      };

      request.onsuccess = (event) => {
        this.db = (event.target as IDBOpenDBRequest).result;
        this.logger.info('IndexedDB database opened successfully');
        resolve();
      };

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;

        // Create operations store
        if (!db.objectStoreNames.contains(IndexedDBStorageProvider.OPERATIONS_STORE)) {
          const operationsStore = db.createObjectStore(
            IndexedDBStorageProvider.OPERATIONS_STORE, 
            { keyPath: 'id' }
          );
          operationsStore.createIndex('status', 'status', { unique: false });
          operationsStore.createIndex('entityType', 'entityType', { unique: false });
          operationsStore.createIndex('entityType_status', ['entityType', 'status'], { unique: false });
        }

        // Create timestamps store
        if (!db.objectStoreNames.contains(IndexedDBStorageProvider.TIMESTAMPS_STORE)) {
          db.createObjectStore(
            IndexedDBStorageProvider.TIMESTAMPS_STORE, 
            { keyPath: 'entityType' }
          );
        }

        // Create versions store
        if (!db.objectStoreNames.contains(IndexedDBStorageProvider.VERSIONS_STORE)) {
          const versionsStore = db.createObjectStore(
            IndexedDBStorageProvider.VERSIONS_STORE, 
            { keyPath: 'id' }
          );
          versionsStore.createIndex('entityType', 'entityType', { unique: false });
        }
      };
    });
  }

  /**
   * Ensure the database is ready
   */
  private async ensureReady(): Promise<void> {
    if (!this.db) {
      await this.ready;
    }
  }

  /**
   * Save a sync operation to storage
   * 
   * @param operation The operation to save
   */
  public async saveOperation<T extends Record<string, any>>(operation: SyncOperation<T>): Promise<void> {
    await this.ensureReady();

    return new Promise<void>((resolve, reject) => {
      if (!this.db) {
        reject(new Error('Database not initialized'));
        return;
      }

      const transaction = this.db.transaction(
        [IndexedDBStorageProvider.OPERATIONS_STORE], 
        'readwrite'
      );
      
      transaction.onerror = (event) => {
        this.logger.error('Transaction error', (event.target as any).error);
        reject(new Error('Transaction error'));
      };

      const store = transaction.objectStore(IndexedDBStorageProvider.OPERATIONS_STORE);
      const request = store.put(operation);

      request.onsuccess = () => {
        resolve();
      };

      request.onerror = (event) => {
        this.logger.error('Failed to save operation', (event.target as any).error);
        reject(new Error('Failed to save operation'));
      };
    });
  }

  /**
   * Get sync operations from storage
   * 
   * @param entityType Optional entity type filter
   * @param status Optional status filter
   * @returns The matching operations
   */
  public async getOperations<T extends Record<string, any>>(
    entityType?: string, 
    status?: SyncStatus
  ): Promise<SyncOperation<T>[]> {
    await this.ensureReady();

    return new Promise<SyncOperation<T>[]>((resolve, reject) => {
      if (!this.db) {
        reject(new Error('Database not initialized'));
        return;
      }

      const transaction = this.db.transaction(
        [IndexedDBStorageProvider.OPERATIONS_STORE], 
        'readonly'
      );
      
      transaction.onerror = (event) => {
        this.logger.error('Transaction error', (event.target as any).error);
        reject(new Error('Transaction error'));
      };

      const store = transaction.objectStore(IndexedDBStorageProvider.OPERATIONS_STORE);
      let request: IDBRequest;

      if (entityType && status) {
        // Query by entity type and status
        const index = store.index('entityType_status');
        request = index.getAll([entityType, status]);
      } else if (entityType) {
        // Query by entity type
        const index = store.index('entityType');
        request = index.getAll(entityType);
      } else if (status) {
        // Query by status
        const index = store.index('status');
        request = index.getAll(status);
      } else {
        // Get all operations
        request = store.getAll();
      }

      request.onsuccess = (event) => {
        const results = (event.target as IDBRequest).result;
        resolve(results as SyncOperation<T>[]);
      };

      request.onerror = (event) => {
        this.logger.error('Failed to get operations', (event.target as any).error);
        reject(new Error('Failed to get operations'));
      };
    });
  }

  /**
   * Update the status of a sync operation
   * 
   * @param id The operation ID
   * @param status The new status
   * @param error Optional error message
   */
  public async updateOperationStatus<T extends Record<string, any>>(
    id: string, 
    status: SyncStatus, 
    error?: string
  ): Promise<void> {
    await this.ensureReady();

    return new Promise<void>((resolve, reject) => {
      if (!this.db) {
        reject(new Error('Database not initialized'));
        return;
      }

      const transaction = this.db.transaction(
        [IndexedDBStorageProvider.OPERATIONS_STORE], 
        'readwrite'
      );
      
      transaction.onerror = (event) => {
        this.logger.error('Transaction error', (event.target as any).error);
        reject(new Error('Transaction error'));
      };

      const store = transaction.objectStore(IndexedDBStorageProvider.OPERATIONS_STORE);
      const getRequest = store.get(id);

      getRequest.onsuccess = (event) => {
        const operation = (event.target as IDBRequest).result;
        
        if (!operation) {
          reject(new Error(`Operation not found: ${id}`));
          return;
        }

        operation.status = status;
        
        if (error) {
          operation.errorMessage = error;
        }

        const updateRequest = store.put(operation);

        updateRequest.onsuccess = () => {
          resolve();
        };

        updateRequest.onerror = (event) => {
          this.logger.error('Failed to update operation status', (event.target as any).error);
          reject(new Error('Failed to update operation status'));
        };
      };

      getRequest.onerror = (event) => {
        this.logger.error('Failed to get operation', (event.target as any).error);
        reject(new Error('Failed to get operation'));
      };
    });
  }

  /**
   * Delete a sync operation from storage
   * 
   * @param id The operation ID
   */
  public async deleteOperation(id: string): Promise<void> {
    await this.ensureReady();

    return new Promise<void>((resolve, reject) => {
      if (!this.db) {
        reject(new Error('Database not initialized'));
        return;
      }

      const transaction = this.db.transaction(
        [IndexedDBStorageProvider.OPERATIONS_STORE], 
        'readwrite'
      );
      
      transaction.onerror = (event) => {
        this.logger.error('Transaction error', (event.target as any).error);
        reject(new Error('Transaction error'));
      };

      const store = transaction.objectStore(IndexedDBStorageProvider.OPERATIONS_STORE);
      const request = store.delete(id);

      request.onsuccess = () => {
        resolve();
      };

      request.onerror = (event) => {
        this.logger.error('Failed to delete operation', (event.target as any).error);
        reject(new Error('Failed to delete operation'));
      };
    });
  }

  /**
   * Get the last sync timestamp for an entity type
   * 
   * @param entityType The entity type
   * @returns The last sync timestamp
   */
  public async getLastSyncTimestamp(entityType: string): Promise<number> {
    await this.ensureReady();

    return new Promise<number>((resolve, reject) => {
      if (!this.db) {
        reject(new Error('Database not initialized'));
        return;
      }

      const transaction = this.db.transaction(
        [IndexedDBStorageProvider.TIMESTAMPS_STORE], 
        'readonly'
      );
      
      transaction.onerror = (event) => {
        this.logger.error('Transaction error', (event.target as any).error);
        reject(new Error('Transaction error'));
      };

      const store = transaction.objectStore(IndexedDBStorageProvider.TIMESTAMPS_STORE);
      const request = store.get(entityType);

      request.onsuccess = (event) => {
        const result = (event.target as IDBRequest).result;
        resolve(result ? result.timestamp : 0);
      };

      request.onerror = (event) => {
        this.logger.error('Failed to get timestamp', (event.target as any).error);
        reject(new Error('Failed to get timestamp'));
      };
    });
  }

  /**
   * Set the last sync timestamp for an entity type
   * 
   * @param entityType The entity type
   * @param timestamp The timestamp to set
   */
  public async setLastSyncTimestamp(entityType: string, timestamp: number): Promise<void> {
    await this.ensureReady();

    return new Promise<void>((resolve, reject) => {
      if (!this.db) {
        reject(new Error('Database not initialized'));
        return;
      }

      const transaction = this.db.transaction(
        [IndexedDBStorageProvider.TIMESTAMPS_STORE], 
        'readwrite'
      );
      
      transaction.onerror = (event) => {
        this.logger.error('Transaction error', (event.target as any).error);
        reject(new Error('Transaction error'));
      };

      const store = transaction.objectStore(IndexedDBStorageProvider.TIMESTAMPS_STORE);
      const request = store.put({ entityType, timestamp });

      request.onsuccess = () => {
        resolve();
      };

      request.onerror = (event) => {
        this.logger.error('Failed to set timestamp', (event.target as any).error);
        reject(new Error('Failed to set timestamp'));
      };
    });
  }

  /**
   * Get the version of an entity
   * 
   * @param entityType The entity type
   * @param entityId The entity ID
   * @returns The entity version
   */
  public async getEntityVersion(entityType: string, entityId: string): Promise<number> {
    await this.ensureReady();

    return new Promise<number>((resolve, reject) => {
      if (!this.db) {
        reject(new Error('Database not initialized'));
        return;
      }

      const transaction = this.db.transaction(
        [IndexedDBStorageProvider.VERSIONS_STORE], 
        'readonly'
      );
      
      transaction.onerror = (event) => {
        this.logger.error('Transaction error', (event.target as any).error);
        reject(new Error('Transaction error'));
      };

      const store = transaction.objectStore(IndexedDBStorageProvider.VERSIONS_STORE);
      const request = store.get(`${entityType}:${entityId}`);

      request.onsuccess = (event) => {
        const result = (event.target as IDBRequest).result;
        resolve(result ? result.version : 0);
      };

      request.onerror = (event) => {
        this.logger.error('Failed to get entity version', (event.target as any).error);
        reject(new Error('Failed to get entity version'));
      };
    });
  }

  /**
   * Set the version of an entity
   * 
   * @param entityType The entity type
   * @param entityId The entity ID
   * @param version The version to set
   */
  public async setEntityVersion(
    entityType: string, 
    entityId: string, 
    version: number
  ): Promise<void> {
    await this.ensureReady();

    return new Promise<void>((resolve, reject) => {
      if (!this.db) {
        reject(new Error('Database not initialized'));
        return;
      }

      const transaction = this.db.transaction(
        [IndexedDBStorageProvider.VERSIONS_STORE], 
        'readwrite'
      );
      
      transaction.onerror = (event) => {
        this.logger.error('Transaction error', (event.target as any).error);
        reject(new Error('Transaction error'));
      };

      const store = transaction.objectStore(IndexedDBStorageProvider.VERSIONS_STORE);
      const request = store.put({
        id: `${entityType}:${entityId}`,
        entityType,
        entityId,
        version
      });

      request.onsuccess = () => {
        resolve();
      };

      request.onerror = (event) => {
        this.logger.error('Failed to set entity version', (event.target as any).error);
        reject(new Error('Failed to set entity version'));
      };
    });
  }
}