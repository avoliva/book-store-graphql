/**
 * Interface for entities that have an ID property
 */
export interface Identifiable {
  id: string;
}

/**
 * Generic store interface for data access abstraction
 * @template T - The type of record stored, must extend Identifiable
 */
export interface Store<T extends Identifiable> {
  /**
   * Retrieves a single record by ID
   * @param id - The ID of the record to retrieve
   * @returns The record if found, undefined otherwise
   */
  get(id: string): T | undefined;

  /**
   * Retrieves all records
   * @returns Array of all records
   */
  getAll(): T[];

  /**
   * Creates a new record
   * @param record - The record to create
   * @returns The created record
   */
  create(record: T): T;

  /**
   * Updates an existing record
   * @param id - The ID of the record to update
   * @param updates - Partial record with fields to update
   * @returns The updated record, or undefined if not found
   */
  update(id: string, updates: Partial<T>): T | undefined;
}
