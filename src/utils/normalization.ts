/**
 * Normalizes a string by trimming whitespace and removing control characters
 * Used for general string normalization (not IDs)
 * @param value - The string to normalize
 * @returns Normalized string
 */
export function normalizeString(value: string): string {
  if (typeof value !== 'string') {
    return value;
  }

  // Trim leading and trailing whitespace
  let normalized = value.trim();

  // Remove control characters (except newline, tab, carriage return)
  // Control characters are characters with code points < 32, excluding:
  // - Space (32)
  // - Newline (10)
  // - Tab (9)
  // - Carriage return (13)
  normalized = normalized
    .split('')
    .filter((char) => {
      const charCode = char.charCodeAt(0);
      return charCode >= 32 || charCode === 9 || charCode === 10 || charCode === 13;
    })
    .join('');

  return normalized;
}

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
