import { SyncConflictResolver, SyncMetadata } from '../SyncEngine';

/**
 * Conflict resolution strategy
 */
export enum ConflictResolutionStrategy {
  SERVER_WINS = 'server-wins',
  CLIENT_WINS = 'client-wins',
  TIMESTAMP_WINS = 'timestamp-wins',
  MANUAL = 'manual',
  MERGE = 'merge'
}

/**
 * Default conflict resolver implementation
 */
export class DefaultConflictResolver<T extends Record<string, any>> implements SyncConflictResolver<T> {
  private strategy: ConflictResolutionStrategy;
  private mergeFields?: string[];

  /**
   * Create a new DefaultConflictResolver
   * 
   * @param strategy The conflict resolution strategy
   * @param mergeFields Optional fields to merge when using MERGE strategy
   */
  constructor(
    strategy: ConflictResolutionStrategy = ConflictResolutionStrategy.TIMESTAMP_WINS,
    mergeFields?: string[]
  ) {
    this.strategy = strategy;
    this.mergeFields = mergeFields;
  }

  /**
   * Check if the conflict can be automatically resolved
   * 
   * @param localData The local data
   * @param serverData The server data
   * @param metadata The sync metadata
   * @returns True if the conflict can be automatically resolved
   */
  public canAutoResolve(
    localData: T,
    serverData: T,
    metadata: SyncMetadata
  ): boolean {
    return this.strategy !== ConflictResolutionStrategy.MANUAL;
  }

  /**
   * Resolve a conflict
   * 
   * @param localData The local data
   * @param serverData The server data
   * @param metadata The sync metadata
   * @returns The resolved data
   */
  public async resolveConflict(
    localData: T,
    serverData: T,
    metadata: SyncMetadata
  ): Promise<T> {
    switch (this.strategy) {
      case ConflictResolutionStrategy.SERVER_WINS:
        return serverData;

      case ConflictResolutionStrategy.CLIENT_WINS:
        return localData;

      case ConflictResolutionStrategy.TIMESTAMP_WINS:
        // Compare timestamps and use the newer data
        const serverTimestamp = serverData.updatedAt ? new Date(serverData.updatedAt).getTime() : 0;
        const localTimestamp = metadata.timestamp;

        return serverTimestamp > localTimestamp ? serverData : localData;

      case ConflictResolutionStrategy.MERGE:
        return this.mergeData(localData, serverData);

      case ConflictResolutionStrategy.MANUAL:
      default:
        // Cannot auto-resolve, return local data
        return localData;
    }
  }

  /**
   * Merge local and server data
   * 
   * @param localData The local data
   * @param serverData The server data
   * @returns The merged data
   */
  private mergeData(localData: T, serverData: T): T {
    // If no merge fields specified, use all fields from server data
    if (!this.mergeFields || this.mergeFields.length === 0) {
      return { ...localData, ...serverData };
    }

    // Create a copy of local data
    const result = { ...localData };

    // Merge specified fields from server data
    for (const field of this.mergeFields) {
      if (field in serverData) {
        result[field] = serverData[field];
      }
    }

    return result;
  }
}