import { Store, Identifiable } from './store';

/**
 * In-memory implementation of Store interface using Map
 * Provides O(1) lookup time for ID-based queries
 * @template T - The type of record stored, must extend Identifiable
 */
export class MemoryStore<T extends Identifiable> implements Store<T> {
  private data: Map<string, T>;

  /**
   * Creates a new MemoryStore instance
   * @param initialData - Optional array of initial records to populate the store
   */
  constructor(initialData?: T[]) {
    this.data = new Map<string, T>();
    if (initialData) {
      for (const record of initialData) {
        this.data.set(record.id, record);
      }
    }
  }

  /**
   * Retrieves a record by ID
   * @param id - The ID of the record to retrieve
   * @returns The record if found, undefined otherwise
   */
  get(id: string): T | undefined {
    return this.data.get(id);
  }

  /**
   * Retrieves all records
   * @returns Array of all records
   */
  getAll(): T[] {
    return Array.from(this.data.values());
  }

  /**
   * Creates a new record
   * @param record - The record to create (must have id property per Identifiable constraint)
   * @returns The created record
   */
  create(record: T): T {
    this.data.set(record.id, record);
    return record;
  }

  /**
   * Updates an existing record
   * @param id - The ID of the record to update
   * @param updates - Partial record with fields to update
   * @returns The updated record if found, undefined otherwise
   */
  update(id: string, updates: Partial<T>): T | undefined {
    const existing = this.data.get(id);
    if (!existing) {
      return undefined;
    }
    const updated = { ...existing, ...updates } as T;
    this.data.set(id, updated);
    return updated;
  }

  /**
   * Deletes a record by ID
   * @param id - The ID of the record to delete
   * @returns true if deleted, false if not found
   */
  delete(id: string): boolean {
    return this.data.delete(id);
  }

  /**
   * Checks if a record exists
   * @param id - The ID of the record to check
   * @returns true if exists, false otherwise
   */
  exists(id: string): boolean {
    return this.data.has(id);
  }
}
