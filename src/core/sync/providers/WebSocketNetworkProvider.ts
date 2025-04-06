import { SyncNetworkProvider, SyncOperation, SyncOperationType, SyncResult, SyncStatus } from '../SyncEngine';
import { Logger } from '../../Logger';

/**
 * Network provider that uses WebSockets for real-time sync
 */
export class WebSocketNetworkProvider implements SyncNetworkProvider {
  private apiBaseUrl: string;
  private wsClient: any; // This would be your WebSocket client
  private authToken: string | null = null;
  private logger: Logger;
  private deviceId: string;
  private onlineStatus: boolean = navigator.onLine;

  /**
   * Create a new WebSocketNetworkProvider
   * 
   * @param apiBaseUrl The base URL for the API
   * @param wsClient The WebSocket client
   * @param logger The logger instance
   * @param deviceId The unique device identifier
   */
  constructor(
    apiBaseUrl: string,
    wsClient: any,
    logger: Logger,
    deviceId: string
  ) {
    this.apiBaseUrl = apiBaseUrl;
    this.wsClient = wsClient;
    this.logger = logger;
    this.deviceId = deviceId;

    // Monitor online status
    this.setupOnlineListener();
  }

  /**
   * Set up online status listener
   */
  private setupOnlineListener(): void {
    window.addEventListener('online', () => {
      this.onlineStatus = true;
      this.logger.info('Device is online');
    });

    window.addEventListener('offline', () => {
      this.onlineStatus = false;
      this.logger.info('Device is offline');
    });
  }

  /**
   * Set the authentication token
   * 
   * @param token The authentication token
   */
  public setAuthToken(token: string): void {
    this.authToken = token;
  }

  /**
   * Check if the device is online
   * 
   * @returns True if the device is online
   */
  public async isOnline(): Promise<boolean> {
    return this.onlineStatus;
  }

  /**
   * Upload sync operations to the server
   * 
   * @param operations The operations to upload
   * @returns The results of the operations
   */
  public async uploadOperations<T extends Record<string, any>>(
    operations: SyncOperation<T>[]
  ): Promise<SyncResult<T>[]> {
    if (!this.authToken) {
      throw new Error('Authentication token not set');
    }

    try {
      const response = await fetch(`${this.apiBaseUrl}/sync/batch`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.authToken}`
        },
        body: JSON.stringify({
          operations,
          deviceId: this.deviceId
        })
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to upload operations: ${response.status} ${errorText}`);
      }

      const results: SyncResult<T>[] = await response.json();
      return results;
    } catch (error) {
      this.logger.error('Error uploading operations', error instanceof Error ? error : new Error(String(error)));
      
      // Return failed results for all operations
      return operations.map(op => ({
        operationId: op.id,
        success: false,
        status: SyncStatus.FAILED,
        error: error instanceof Error ? error.message : String(error)
      }));
    }
  }

  /**
   * Download changes from the server
   * 
   * @param entityTypes The entity types to download
   * @param since The timestamps to download changes since
   * @returns The downloaded changes
   */
  public async downloadChanges(
    entityTypes: string[],
    since: Record<string, number>
  ): Promise<SyncOperation<any>[]> {
    if (!this.authToken) {
      throw new Error('Authentication token not set');
    }

    try {
      const response = await fetch(`${this.apiBaseUrl}/sync/changes`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.authToken}`
        },
        body: JSON.stringify({
          entityTypes,
          since,
          deviceId: this.deviceId
        })
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to download changes: ${response.status} ${errorText}`);
      }

      const changes: SyncOperation<any>[] = await response.json();
      return changes;
    } catch (error) {
      this.logger.error('Error downloading changes', error instanceof Error ? error : new Error(String(error)));
      return [];
    }
  }

  /**
   * Subscribe to real-time updates for an entity type
   * 
   * @param entityType The entity type to subscribe to
   * @param callback The callback to call when an update is received
   */
  public subscribeToUpdates(
    entityType: string,
    callback: (operation: SyncOperation<any>) => void
  ): void {
    if (!this.wsClient) {
      this.logger.warn('WebSocket client not available, cannot subscribe to updates');
      return;
    }

    // Subscribe to WebSocket events for this entity type
    this.wsClient.on(`${entityType}:created`, (data: any) => {
      callback({
        id: `ws-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        type: SyncOperationType.CREATE,
        entityType,
        data,
        metadata: {
          timestamp: Date.now(),
          deviceId: 'server',
          version: data.version || 1
        },
        status: SyncStatus.SYNCED
      });
    });

    this.wsClient.on(`${entityType}:updated`, (data: any) => {
      callback({
        id: `ws-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        type: SyncOperationType.UPDATE,
        entityType,
        data,
        metadata: {
          timestamp: Date.now(),
          deviceId: 'server',
          version: data.version || 1
        },
        status: SyncStatus.SYNCED
      });
    });

    this.wsClient.on(`${entityType}:deleted`, (data: any) => {
      callback({
        id: `ws-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        type: SyncOperationType.DELETE,
        entityType,
        data,
        metadata: {
          timestamp: Date.now(),
          deviceId: 'server',
          version: 0
        },
        status: SyncStatus.SYNCED
      });
    });
  }

  /**
   * Unsubscribe from real-time updates for an entity type
   * 
   * @param entityType The entity type to unsubscribe from
   */
  public unsubscribeFromUpdates(entityType: string): void {
    if (!this.wsClient) {
      return;
    }

    this.wsClient.off(`${entityType}:created`);
    this.wsClient.off(`${entityType}:updated`);
    this.wsClient.off(`${entityType}:deleted`);
  }
}