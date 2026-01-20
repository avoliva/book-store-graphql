/**
 * Normalizes an ID by trimming whitespace only
 * Does NOT remove any characters - invalid characters must be caught by validation
 * @param id - The ID to normalize
 * @returns Normalized ID (trimmed whitespace only)
 */
export function normalizeId(id: string): string {
  if (typeof id !== 'string') {
    return id;
  }

  // Only trim whitespace - do NOT remove any characters
  return id.trim();
}
